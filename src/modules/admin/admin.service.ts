import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { CoingeckoService } from '../../@sdk/coingecko/coingecko.service';
import { MailSubject } from '../../@sdk/smtp-mail/enum/mail.enums';
import { SmtpMailService } from '../../@sdk/smtp-mail/smtp-mail.service';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { ApiError } from '../../common/response/api-error';
import { storageExtUrlRemove } from '../../common/store.const';
import { convertStringToBoolean, validateHash } from '../../common/utils';
import type { IFile } from '../../interfaces';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ContractService } from '../contract/contract.service';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { PurchaseStatus } from '../purchase/enums/purchase.enum';
import { PurchaseService } from '../purchase/purchase.service';
import type { GetListConditionDto } from '../put-on-sale/dto/get-list-condition.dto';
import type { PutOnSalePageOptionDto } from '../put-on-sale/dto/put-on-sale-page-option.dto';
import { PutOnSaleEntity } from '../put-on-sale/entities/put-on-sale.entity';
import {
  PutOnSaleCancelReason,
  PutOnSaleStatus,
} from '../put-on-sale/enums/put-on-sale.enum';
import { UserEntity } from '../user/entities/user.entity';
import type { AdminPageOptionsDto } from './dto/admin-page-options.dto';
import type { BannerPageOptionDto } from './dto/banner-page-option.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';
import { CreateStoreFeeDto } from './dto/create-store-fee.dto';
import type { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import type { ImportTokenDto } from './dto/import-token.dto';
import type { LoginAdminDto } from './dto/login.dto';
import type { PendingPurchasePageOptionDto } from './dto/pending-purchase-page-option.dto';
import type { SendEmailDto } from './dto/send-email.dto';
import type { ServiceFeeTransactionPageOptionDto } from './dto/service-fee-transaction-page-option.dto';
import type { StoreFeePageOptionDto } from './dto/store-fee-page-option.dto';
import type { UpdateTokenDto } from './dto/update-token.dto';
import { UpdateUserActiveDto } from './dto/update-user-active.dto';
import { UpsertReferralProgramConfigDto } from './dto/upsert-referral-program-config.dto';
import type { UpsertStoreConfigDto } from './dto/upsert-store-config.dto';
import type { UserPageOptionDto } from './dto/user-page-option.dto';
import { AdminEntity } from './entities/admin.entity';
import { ReferralProgramConfigEntity } from './entities/referral-program-config.entity';
import { ServiceFeeTransactionEntity } from './entities/service-fee-transaction.entity';
import { StoreBannerEntity } from './entities/store-banner.entity';
import { StoreConfigEntity } from './entities/store-config.entity';
import { StoreFeeEntity } from './entities/store-fee.entity';
import { AdminRole, ServiceFeeTransactionStatus } from './enums/admin.enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
    @InjectRepository(StoreFeeEntity)
    private readonly storeFeeRepository: Repository<StoreFeeEntity>,
    @InjectRepository(StoreConfigEntity)
    private readonly storeConfigRepository: Repository<StoreConfigEntity>,
    @InjectRepository(StoreBannerEntity)
    private readonly storeBannerRepository: Repository<StoreBannerEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(PutOnSaleEntity)
    private readonly putOnSaleRepository: Repository<PutOnSaleEntity>,
    @InjectRepository(ReferralProgramConfigEntity)
    private readonly referralProgramConfigRepository: Repository<ReferralProgramConfigEntity>,
    @InjectRepository(ServiceFeeTransactionEntity)
    private readonly serviceFeeTransactionRepository: Repository<ServiceFeeTransactionEntity>,
    private readonly apiConfigService: ApiConfigService,
    private readonly smtpMailService: SmtpMailService,
    private readonly coingeckoService: CoingeckoService,
    private readonly contractService: ContractService,
    private readonly purchaseService: PurchaseService,
  ) {}

  async login(data: LoginAdminDto) {
    const existedUser = await this.adminRepository.findOne({
      where: {
        userName: data.userName,
      },
    });

    if (
      !existedUser ||
      !(await validateHash(data.password, existedUser.password))
    ) {
      throw new ApiError('email or password is invalid', 'E7');
    }

    return existedUser.toDto();
  }

  async createSubAdmin(data: CreateSubAdminDto) {
    const existedAdmin = await this.adminRepository.count({
      where: {
        userName: data.userName,
      },
    });

    if (existedAdmin) {
      throw new ApiError('User name has already used', 'E20');
    }

    const admin = this.adminRepository.create({
      userName: data.userName,
      password: data.password,
      role: AdminRole.SubAdmin,
    });

    await this.adminRepository.save(admin);

    return admin.toDto();
  }

  async deleteSubAdmin(id: Uuid) {
    const result = await this.adminRepository.delete({
      id,
    });

    return result.affected !== 0;
  }

  async getListAdmin(filter: AdminPageOptionsDto) {
    const [listAdmin, total] = await this.adminRepository.findAndCount({
      where: {
        role: AdminRole.SubAdmin,
      },
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listAdmin.toPageDto(pageMetaDto);
  }

  async getListUser(filter: UserPageOptionDto) {
    const { email, name, phoneCode, isActive } = filter;
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.isVerified = TRUE');

    if (email) {
      queryBuilder.andWhere('user.email = :email', { email });
    }

    if (name) {
      queryBuilder.andWhere(
        `LOWER(CONCAT(user.firstName, ' ', user.lastName)) LIKE LOWER(:name)`,
        { name: `%${name}%` },
      );
    }

    if (phoneCode) {
      queryBuilder.andWhere('user.phoneCode = :phoneCode', { phoneCode });
    }

    if (isActive) {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive,
      });
    }

    queryBuilder.leftJoinAndSelect('user.listPayment', 'listPayment');
    queryBuilder.leftJoinAndSelect('user.listWallet', 'listWallet');

    const [listUser, pageMetaDto] = await queryBuilder.paginate(filter);

    return listUser.toPageDto(pageMetaDto);
  }

  async changePassword(admin: AdminEntity, data: ChangePasswordDto) {
    const result = await this.adminRepository.update(
      {
        id: admin.id,
      },
      {
        password: data.newPassword,
      },
    );

    return result.affected !== 0;
  }

  @Transactional()
  async updateUserActive(data: UpdateUserActiveDto) {
    const result = await this.userRepository.update(
      { id: data.userId },
      {
        isActive: data.isActive,
      },
    );

    if (!data.isActive) {
      await this.putOnSaleRepository.update(
        {
          userId: data.userId,
          status: In([
            PutOnSaleStatus.ACTIVE,
            PutOnSaleStatus.DRAFT,
            PutOnSaleStatus.PENDING,
          ]),
        },
        {
          status: PutOnSaleStatus.CANCELED,
          cancelReason: PutOnSaleCancelReason.UserDisabled,
        },
      );

      const listPurchaseBuyerConfirm = await this.purchaseRepository.find({
        where: {
          sellerId: data.userId,
          status: PurchaseStatus.BUYER_CONFIRM_PAY,
        },
        relations: ['buyer'],
        select: {
          id: true,
          buyer: {
            id: true,
            email: true,
          },
        },
      });
      let listEmail = '';

      for (const purchase of listPurchaseBuyerConfirm) {
        listEmail += `${purchase.buyer?.email || ''},`;
      }

      this.smtpMailService
        .sendEmail(
          listEmail,
          MailSubject.PurchasePendingBySellerDisabled,
          'user',
          'send-pending-purchase',
          { appDomain: this.apiConfigService.appConfig.domain },
        )
        .then((resp) => resp)
        .catch((e) => e);

      await this.purchaseRepository.update(
        {
          sellerId: data.userId,
          status: PurchaseStatus.BUYER_CONFIRM_PAY,
        },
        {
          status: PurchaseStatus.PENDING_BY_DISABLE_USER,
        },
      );

      await this.purchaseRepository.update(
        {
          sellerId: data.userId,
          status: PurchaseStatus.WAITING_TO_PAYMENT,
        },
        {
          status: PurchaseStatus.CANCEL,
        },
      );
    }

    return result.affected !== 0;
  }

  async importToken(data: ImportTokenDto, file?: IFile) {
    const existedTokenId = await this.currencyRepository.findOne({
      where: {
        tokenId: data.tokenId,
        chainId: data.chainId,
      },
    });

    if (existedTokenId) {
      if (existedTokenId.isActive) {
        throw new ApiError('This token has been imported before', 'E-1');
      } else {
        existedTokenId.isActive = true;
        await this.currencyRepository.save(existedTokenId);

        return existedTokenId.toDto();
      }
    }

    const token = this.currencyRepository.create({
      ...data,
      decimal: await this.contractService.getDecimalOfToken({
        tokenId: data.tokenId,
        chainId: data.chainId,
      }),
    });

    if (file) {
      token.iconUrl = file.path.replace(storageExtUrlRemove, '');
    }

    token.chainName = this.getChainName(data.chainId);

    await this.currencyRepository.save(token);

    return token.toDto();
  }

  async updateToken(id: Uuid, data: UpdateTokenDto) {
    const result = await this.currencyRepository.update(
      {
        id,
      },
      {
        isActive: convertStringToBoolean(data.isActive),
      },
    );

    return result.affected !== 0;
  }

  getChainName(chainId: number) {
    switch (chainId.toString()) {
      case this.apiConfigService.chainIdConfig.binanceChainId:
        return 'Binance Smart Chain';
      case this.apiConfigService.chainIdConfig.ethChainId:
        return 'ETHER Chain';
      case this.apiConfigService.chainIdConfig.polygonChainId:
        return 'POLIGON Chain';
      default:
        return '';
    }
  }

  @Transactional()
  async upsertStoreFee(data: CreateStoreFeeDto) {
    const { dataCreateStoreFee } = data;
    await this.storeFeeRepository.delete({});

    await this.storeFeeRepository.save(dataCreateStoreFee);

    return true;
  }

  // async updateStoreFee(data: UpdateStoreFeeDto) {
  //   const { id,  } = data;
  //   const existed = await this.storeFeeRepository.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  //
  //   if (!existed) {
  //     throw new ApiError('Invalid data', 'E-1');
  //   }
  //
  //   existed.fee = fee;
  //
  //   if (!existed.isDefault) {
  //     existed.minFiatAmountUsd = minFiatAmountUsd;
  //   }
  //
  //   await this.storeFeeRepository.save(existed);
  //
  //   return true;
  // }

  async deleteStoreFee(id: Uuid) {
    const result = await this.storeFeeRepository.delete({
      id,
      isDefault: false,
    });

    return result.affected !== 0;
  }

  async getListStoreFee(filter: StoreFeePageOptionDto) {
    const listStoreFee = await this.storeFeeRepository.find({
      order: {
        minFiatAmountUsd: filter.order,
      },
    });

    return listStoreFee.map((storeFee) => storeFee.toDto());
  }

  sendEmail(data: SendEmailDto) {
    const { listMail, subject, context } = data;
    this.smtpMailService
      .sendRawEmail(listMail, subject, context)
      .then((resp) => resp)
      .catch((e) => e);

    return true;
  }

  async upsertStoreConfig(data: UpsertStoreConfigDto, file?: IFile) {
    const { bannerUrl, ...dataStoreConfig } = data;

    if (file) {
      dataStoreConfig.logo = file.path.replace(storageExtUrlRemove, '');
    }

    const existed = await this.storeConfigRepository.findOne({
      where: {},
    });

    if (existed) {
      if (bannerUrl) {
        await this.uploadBanner(bannerUrl);
      }

      await this.storeConfigRepository.update({}, { ...dataStoreConfig });

      return existed.toDto();
    }

    if (bannerUrl) {
      await this.uploadBanner(bannerUrl);
    }

    const storeConfig = this.storeConfigRepository.create({
      ...dataStoreConfig,
    });
    await this.storeConfigRepository.save(storeConfig);

    return storeConfig.toDto();
  }

  async getStoreConfig() {
    const storeConfig = await this.storeConfigRepository.findOne({
      where: {},
    });
    const banner = await this.storeBannerRepository.find();

    if (!storeConfig) {
      return {};
    }

    return {
      ...storeConfig.toDto(),
      listBanner: banner,
    };
  }

  async getListUserPutOnSale(filter: PutOnSalePageOptionDto) {
    const { status, chainId, currencyId, fiatCurrencyId } = filter;
    const where = {} as GetListConditionDto;

    if (status) {
      where.status = status;
    }

    if (chainId) {
      where.chainId = chainId;
    }

    if (currencyId) {
      where.currencyId = currencyId;
    }

    if (fiatCurrencyId) {
      where.fiatCurrencyId = fiatCurrencyId;
    }

    where.txId = Not(IsNull());
    const [listPutOnSale, total] = await this.putOnSaleRepository.findAndCount({
      where,
      relations: ['currency', 'fiatCurrency', 'listPaymentAccept'],
      order: {
        createdAt: filter.order,
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listPutOnSale.toPageDto(pageMetaDto);
  }

  async getListPendingPurchase(filter: PendingPurchasePageOptionDto) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = {} as any;
    where.status = PurchaseStatus.PENDING_BY_DISABLE_USER;

    if (filter.chainId) {
      where.chainId = filter.chainId;
    }

    const [listPending, total] = await this.purchaseRepository.findAndCount({
      where,
      relations: [
        'buyer',
        'seller',
        'putOnSale',
        'putOnSale.currency',
        'putOnSale.fiatCurrency',
        'payment',
        'listProofTransferredMoney',
      ],
      order: {
        createdAt: filter.order,
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listPending.toPageDto(pageMetaDto);
  }

  async getDetailPendingPurchase(id: Uuid) {
    const pendingPurchase = await this.purchaseRepository.findOne({
      where: {
        id,
        status: PurchaseStatus.PENDING_BY_DISABLE_USER,
      },
      relations: [
        'buyer',
        'seller',
        'putOnSale',
        'putOnSale.currency',
        'putOnSale.fiatCurrency',
        'payment',
        'listProofTransferredMoney',
      ],
    });

    if (!pendingPurchase) {
      throw new ApiError('Invalid data', 'E-1');
    }

    return pendingPurchase.toDto();
  }

  async uploadBanner(listBanner: string[]) {
    await this.storeBannerRepository.delete({});
    const listBannerUrl = [] as StoreBannerEntity[];

    for (const banner of listBanner) {
      listBannerUrl.push(
        this.storeBannerRepository.create({
          bannerUrl: banner,
        }),
      );
    }

    await this.storeBannerRepository.save(listBannerUrl);

    return listBannerUrl;
  }

  async getListBanner(filter: BannerPageOptionDto) {
    const [listBanner, total] = await this.storeBannerRepository.findAndCount(
      {},
    );
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listBanner.toPageDto(pageMetaDto);
  }

  @Transactional()
  async confirmPendingPurchase(id: Uuid) {
    const pendingPurchase = await this.purchaseRepository.findOne({
      where: {
        id,
        status: PurchaseStatus.PENDING_BY_DISABLE_USER,
      },
      relations: ['seller'],
      select: {
        id: true,
        status: true,
        seller: {
          id: true,
        },
      },
    });

    if (!pendingPurchase || !pendingPurchase.seller) {
      throw new ApiError('Invalid data', 'E-1');
    }

    await this.purchaseService.sellerConfirmBuy(
      pendingPurchase.seller,
      {
        id: pendingPurchase.id,
      },
      true,
    );
  }

  @Transactional()
  async upsertReferralProgramConfig(data: UpsertReferralProgramConfigDto) {
    const { referralProgramConfig } = data;
    await this.referralProgramConfigRepository.delete({});
    const referralProgramDataInsert = referralProgramConfig.map((config) =>
      this.referralProgramConfigRepository.create({ ...config }),
    );

    return this.referralProgramConfigRepository.save(referralProgramDataInsert);
  }

  getListReferralProgramConfig() {
    return this.referralProgramConfigRepository.find();
  }

  async getListServiceFeeTransaction(
    filter: ServiceFeeTransactionPageOptionDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = {} as any;

    if (filter.chainId) {
      where.chainId = filter.chainId;
    }

    if (filter.from) {
      where.createdAt = MoreThanOrEqual(filter.from);
    }

    if (filter.to) {
      where.createdAt = LessThanOrEqual(filter.to);
    }

    where.status = ServiceFeeTransactionStatus.SUCCESS;

    const [listServiceFeeTransaction, total] =
      await this.serviceFeeTransactionRepository.findAndCount({
        where,
        relations: ['currency', 'withdrawTransaction'],
        order: {
          createdAt: filter.order,
        },
      });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listServiceFeeTransaction.toPageDto(pageMetaDto);
  }
}
