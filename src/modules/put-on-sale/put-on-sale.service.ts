import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import type { UpdateResult } from 'typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { ApiError } from '../../common/response/api-error';
import { Web3Util } from '../../common/web3/web3.util';
import { ServiceFeeTransactionEntity } from '../admin/entities/service-fee-transaction.entity';
import { ContractService } from '../contract/contract.service';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { FiatCurrencyEntity } from '../currency/entities/fiat-currency.entity';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { PurchaseStatus } from '../purchase/enums/purchase.enum';
import { UserEntity } from '../user/entities/user.entity';
import type { CancelPutOnSaleDto } from './dto/cancel-put-on-sale.dto';
import { CreatePutOnSaleDto } from './dto/create-put-on-sale.dto';
import type { GetListConditionDto } from './dto/get-list-condition.dto';
import type { PutOnSalePageOptionDto } from './dto/put-on-sale-page-option.dto';
import type { UpdatePutOnSaleDto } from './dto/update-put-on-sale.dto';
import { PutOnSaleEntity } from './entities/put-on-sale.entity';
import { PutOnSaleStatus } from './enums/put-on-sale.enum';

@Injectable()
export class PutOnSaleService {
  constructor(
    @InjectRepository(PutOnSaleEntity)
    private readonly putOnSaleRepository: Repository<PutOnSaleEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
    @InjectRepository(FiatCurrencyEntity)
    private readonly fiatCurrencyRepository: Repository<FiatCurrencyEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(ServiceFeeTransactionEntity)
    private readonly adminWalletRepository: Repository<ServiceFeeTransactionEntity>,
    private readonly contractService: ContractService,
  ) {}

  @Transactional()
  async createPutOnSaleTemp(user: UserEntity, data: CreatePutOnSaleDto) {
    const {
      chainId,
      fiatCurrencyId,
      currencyId,
      fromWalletAddress,
      listAcceptablePaymentId,
      amount,
      minFiatAmount,
      maxFiatAmount,
    } = data;
    const userData = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      select: { isVerifiedPhoneNumber: true },
    });

    if (!userData?.isVerifiedPhoneNumber) {
      //throw new ApiError('Please verify your email before start.', 'E15');
    }

    const listPaymentAccept = await this.paymentRepository.find({
      where: {
        id: In(listAcceptablePaymentId),
      },
    });

    const currency = await this.currencyRepository.findOne({
      where: {
        id: currencyId,
      },
    });

    const fiatCurrency = await this.fiatCurrencyRepository.findOne({
      where: {
        id: fiatCurrencyId,
      },
    });

    if (!currency || !fiatCurrency) {
      throw new ApiError('Invalid currency', 'E17');
    }

    const putOnSale = this.putOnSaleRepository.create();

    if (minFiatAmount) {
      putOnSale.minFiatAmount = minFiatAmount;
    }

    if (maxFiatAmount) {
      putOnSale.maxFiatAmount = maxFiatAmount;
    }

    putOnSale.chainId = chainId;
    putOnSale.amount = amount;
    putOnSale.availableAmount = amount;
    putOnSale.fromWalletAddress = fromWalletAddress;
    putOnSale.currency = currency;
    putOnSale.fiatCurrency = fiatCurrency;
    putOnSale.listPaymentAccept = listPaymentAccept;
    putOnSale.user = user;

    await this.putOnSaleRepository.save(putOnSale);
    const dataSignature = Web3Util.signDataPutOnSale(putOnSale, currency);
    putOnSale.signaturePutOnSale = dataSignature;
    await this.putOnSaleRepository.save(putOnSale);

    return putOnSale.toDto();
  }

  async updatePutOnSaleTemp(user: UserEntity, data: UpdatePutOnSaleDto) {
    const { id, txId } = data;
    const putOnSale = await this.putOnSaleRepository.count({
      where: {
        id,
        userId: user.id,
        status: PutOnSaleStatus.DRAFT,
      },
    });

    if (!putOnSale) {
      throw new ApiError('Invalid data', 'E-1');
    }

    const result = await this.putOnSaleRepository.update(
      {
        id,
      },
      {
        txId,
        status: PutOnSaleStatus.PENDING,
      },
    );

    return result.affected !== 0;
  }

  async rejectPutOnSale(user: UserEntity, id: Uuid) {
    const putOnSale = await this.putOnSaleRepository.count({
      where: {
        id,
        userId: user.id,
        status: PutOnSaleStatus.DRAFT,
      },
    });

    if (!putOnSale) {
      throw new ApiError('Invalid data', 'E-1');
    }

    const result = await this.putOnSaleRepository.delete({
      id,
    });

    return result.affected !== 0;
  }

  async getListPutOnSaleOfUser(
    user: UserEntity,
    filter: PutOnSalePageOptionDto,
  ) {
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

    where.userId = user.id;
    where.txId = Not(IsNull());

    const [listPutOnSale, total] = await this.putOnSaleRepository.findAndCount({
      where,
      relations: ['currency', 'fiatCurrency', 'listPaymentAccept'],
      order: {
        createdAt: 'DESC',
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listPutOnSale.toPageDto(pageMetaDto);
  }

  async getListOnSale(filter: PutOnSalePageOptionDto) {
    const { chainId, currencyId, fiatCurrencyId } = filter;
    const where = {} as GetListConditionDto;

    if (chainId) {
      where.chainId = chainId;
    }

    if (currencyId) {
      where.currencyId = currencyId;
    }

    if (fiatCurrencyId) {
      where.fiatCurrencyId = fiatCurrencyId;
    }

    where.status = PutOnSaleStatus.ACTIVE;
    where.txId = Not(IsNull());
    const [listPutOnSale, total] = await this.putOnSaleRepository.findAndCount({
      where,
      relations: ['currency', 'fiatCurrency', 'listPaymentAccept', 'user'],
      order: {
        createdAt: 'DESC',
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listPutOnSale.toPageDto(pageMetaDto);
  }

  async syncDataPutOnSale() {
    const listPending = await this.putOnSaleRepository.find({
      where: {
        txId: Not(IsNull()),
        status: PutOnSaleStatus.PENDING,
      },
      relations: ['currency'],
      select: {
        id: true,
        txId: true,
        chainId: true,
        currencyId: true,
        amount: true,
        currency: {
          id: true,
        },
      },
    });

    if (listPending.length === 0) {
      return;
    }

    const promiseAll = [] as Array<Promise<UpdateResult>>;
    const promiseUpdateAdminWallet = [] as Array<Promise<void>>;

    for (const putOnSale of listPending) {
      const { id, txId, chainId } = putOnSale;
      const web3Provider = Web3Util.getProvider(chainId);
      // eslint-disable-next-line no-await-in-loop
      const transaction = await web3Provider.eth.getTransactionReceipt(txId);
      let statusUpdate;

      if (transaction.status === true) {
        statusUpdate = PutOnSaleStatus.ACTIVE;
        promiseUpdateAdminWallet.push(this.updateAdminWallet(putOnSale));
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (transaction.status === false) {
        statusUpdate = PutOnSaleStatus.FAIL;
      }

      promiseAll.push(
        this.putOnSaleRepository.update(
          {
            id,
          },
          {
            status: statusUpdate,
          },
        ),
      );
    }

    await Promise.allSettled(promiseAll);
    Promise.allSettled(promiseUpdateAdminWallet)
      .then((resp) => resp)
      .catch((error) => error);

    return true;
  }

  async updateAdminWallet(putOnSale: PutOnSaleEntity) {
    const walletExisted = await this.adminWalletRepository.findOne({
      where: {
        chainId: putOnSale.chainId,
        currencyId: putOnSale.currencyId,
      },
      select: {
        id: true,
        totalAmount: true,
      },
    });

    if (!walletExisted) {
      const wallet = this.adminWalletRepository.create();
      wallet.totalAmount = putOnSale.amount;
      wallet.chainId = putOnSale.chainId;
      wallet.currency = putOnSale.currency;

      await this.adminWalletRepository.save(wallet);
    } else {
      const updateTotalAmount = new BigNumber(walletExisted.totalAmount)
        .plus(new BigNumber(putOnSale.amount))
        .toString();

      await this.adminWalletRepository.update(
        {
          id: walletExisted.id,
        },
        {
          totalAmount: updateTotalAmount,
        },
      );
    }
  }

  async cancelPutOnSale(user: UserEntity, id: Uuid, data: CancelPutOnSaleDto) {
    const { walletAddress } = data;
    const existedPutOnSale = await this.putOnSaleRepository.findOne({
      where: {
        id,
        userId: user.id,
        status: In([PutOnSaleStatus.ACTIVE, PutOnSaleStatus.CANCEL_FAIL]),
      },
      relations: ['currency'],
      select: {
        id: true,
        userId: true,
        chainId: true,
        availableAmount: true,
        currency: {
          id: true,
          tokenId: true,
          decimal: true,
        },
      },
    });
    const pendingPurchase = await this.purchaseRepository.count({
      where: {
        status: In([
          PurchaseStatus.WAITING_TO_PAYMENT,
          PurchaseStatus.BUYER_CONFIRM_PAY,
        ]),
        putOnSaleId: id,
      },
    });

    if (pendingPurchase) {
      throw new ApiError(
        'Your sell order are having pending transaction. Please wait for entire transaction to be completed',
        'E-1',
      );
    }

    if (!existedPutOnSale || !existedPutOnSale.currency) {
      throw new ApiError('Invalid data', 'E-1');
    }

    if (existedPutOnSale.amount === '0') {
      throw new ApiError('Your put on sale was invalid', 'E-1');
    }

    const nonce = await this.contractService.getNonceOfUser({
      chainId: existedPutOnSale.chainId,
      userId: user.id,
    });

    const dataSignature = Web3Util.signDataCancelPutOnSale({
      toAddress: walletAddress,
      tokenId: existedPutOnSale.currency.tokenId,
      amount: existedPutOnSale.availableAmount,
      nonce,
      userId: user.id,
      id: existedPutOnSale.id,
      chainId: existedPutOnSale.chainId,
      decimal: existedPutOnSale.currency.decimal,
    });

    await this.putOnSaleRepository.update(
      {
        id: existedPutOnSale.id,
      },
      {
        signatureCancel: dataSignature.signature,
      },
    );

    await this.purchaseRepository.update(
      {
        putOnSaleId: id,
        status: PurchaseStatus.DRAFT,
      },
      {
        status: PurchaseStatus.CANCEL,
      },
    );

    return dataSignature;
  }

  async updateTxIdCancel(user, data: UpdatePutOnSaleDto) {
    const { id, txId } = data;
    const result = await this.putOnSaleRepository.update(
      {
        id,
        userId: user.id,
        status: PutOnSaleStatus.ACTIVE,
        signatureCancel: Not(IsNull()),
      },
      {
        status: PutOnSaleStatus.CANCEL_PENDING,
        txIdCancel: txId,
      },
    );

    return result.affected !== 0;
  }

  async syncDataCancelPutOnSale() {
    const listPending = await this.putOnSaleRepository.find({
      where: {
        status: PutOnSaleStatus.CANCEL_PENDING,
        txIdCancel: Not(IsNull()),
      },
      select: {
        id: true,
        txIdCancel: true,
      },
    });

    if (listPending.length === 0) {
      return true;
    }

    const promiseAllSettled = [] as Array<Promise<UpdateResult>>;

    for (const putOnSale of listPending) {
      const { id, txIdCancel, chainId } = putOnSale;
      const web3Provider = Web3Util.getProvider(chainId);
      // eslint-disable-next-line no-await-in-loop
      const transaction = await web3Provider.eth.getTransactionReceipt(
        txIdCancel,
      );
      let statusUpdate;

      if (transaction.status === true) {
        statusUpdate = PutOnSaleStatus.CANCELED;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (transaction.status === false) {
        statusUpdate = PutOnSaleStatus.CANCEL_FAIL;
      }

      promiseAllSettled.push(
        this.putOnSaleRepository.update(
          {
            id,
          },
          {
            status: statusUpdate,
          },
        ),
      );
    }

    await Promise.allSettled(promiseAllSettled);

    return true;
  }
}
