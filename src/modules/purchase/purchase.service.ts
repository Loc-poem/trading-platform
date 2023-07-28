import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { In, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { MailSubject } from '../../@sdk/smtp-mail/enum/mail.enums';
import { SmtpMailService } from '../../@sdk/smtp-mail/smtp-mail.service';
import { VonageService } from '../../@sdk/vonage/vonage.service';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { UpdateDto } from '../../common/dto/update.dto';
import { ApiError } from '../../common/response/api-error';
import { storageExtUrlRemove } from '../../common/store.const';
import { otp } from '../../common/utils';
import type { IFile } from '../../interfaces';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ContractService } from '../contract/contract.service';
import type { PaymentEntity } from '../payment/entities/payment.entity';
import { PutOnSaleEntity } from '../put-on-sale/entities/put-on-sale.entity';
import {
  PutOnSaleCancelReason,
  PutOnSaleStatus,
} from '../put-on-sale/enums/put-on-sale.enum';
import { OTP_EXPIRED_TIME } from '../user/constants/user.constants';
import { UserEntity } from '../user/entities/user.entity';
import { WalletEntity } from '../user/entities/wallet.entity';
import { DELAY_TIME_WAITING_BUYER_CONFIRM } from './constants/purchase.const';
import { BuyerConfirmPayDto } from './dto/buyer-confirm-pay.dto';
import { CreateProofTransferredMoneyDto } from './dto/create-proof-transferred-money.dto';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import type { PurchasePageOptionDto } from './dto/purchase-page-option.dto';
import type { QueryPurchaseDto } from './dto/query-purchase.dto';
import type { ResentOtpPurchaseDto } from './dto/resent-otp-purchase.dto';
import { VerifyOtpPurchaseDto } from './dto/verify-otp-purchase.dto';
import { ProofTransferredMoneyEntity } from './entities/proof-transferred-money.entity';
import { PurchaseEntity } from './entities/purchase.entity';
import { PurchaseStatus } from './enums/purchase.enum';
import { PurchaseQueue } from './queues/purchase.queue';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(PutOnSaleEntity)
    private readonly putOnSaleRepository: Repository<PutOnSaleEntity>,
    private readonly vonageService: VonageService,
    private readonly purchaseQueue: PurchaseQueue,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    @InjectRepository(ProofTransferredMoneyEntity)
    private readonly proofTransferredMoneyRepository: Repository<ProofTransferredMoneyEntity>,
    private readonly smtpMailService: SmtpMailService,
    private readonly contractService: ContractService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  @Transactional()
  async createPurchase(user: UserEntity, data: CreatePurchaseDto) {
    const { buyAmount, putOnSaleId } = data;
    const putOnSale = await this.putOnSaleRepository.findOne({
      where: {
        id: putOnSaleId,
        status: PutOnSaleStatus.ACTIVE,
      },
      relations: ['currency', 'fiatCurrency', 'user'],
      select: {
        id: true,
        chainId: true,
        amount: true,
        availableAmount: true,
        minFiatAmount: true,
        currencyId: true,
        fiatCurrencyId: true,
        maxFiatAmount: true,
        currency: {
          id: true,
          exchangeRate: true,
        },
        fiatCurrency: {
          id: true,
          exchangeRate: true,
        },
        listPaymentAccept: true,
        user: {
          id: true,
        },
      },
    });

    if (!putOnSale || !putOnSale.user) {
      throw new ApiError('Invalid data', 'E-1');
    }

    if (
      !(await this.contractService.checkValidOrder({
        id: putOnSale.id,
        chainId: putOnSale.chainId,
      }))
    ) {
      await this.putOnSaleRepository.update(
        {
          id: putOnSale.id,
        },
        {
          status: PutOnSaleStatus.CANCELED,
          cancelReason: PutOnSaleCancelReason.UserCancel,
        },
      );

      throw new ApiError('Sell order is invalid', 'E-1');
    }

    if (parseFloat(buyAmount) > parseFloat(putOnSale.availableAmount)) {
      throw new ApiError(
        'the remaining quantity of token is not enough',
        'E17',
      );
    }

    const buyFiatAmount = new BigNumber(buyAmount)
      .multipliedBy(new BigNumber(putOnSale.currency?.exchangeRate || 1))
      .multipliedBy(new BigNumber(putOnSale.fiatCurrency?.exchangeRate || 1))
      .toString();

    if (
      putOnSale.minFiatAmount &&
      parseFloat(putOnSale.minFiatAmount) > parseFloat(buyFiatAmount)
    ) {
      throw new ApiError(
        'buy amount must be greater than minimum amount',
        'E18',
      );
    }

    if (
      putOnSale.maxFiatAmount &&
      parseFloat(putOnSale.maxFiatAmount) < parseFloat(buyFiatAmount)
    ) {
      throw new ApiError('buy amount must be less than maximum amount', 'E19');
    }

    const otpData = otp();

    const purchase = this.purchaseRepository.create({
      buyAmount,
      status: PurchaseStatus.DRAFT,
      buyFiatAmount,
      chainId: putOnSale.chainId,
      exchangeRate: putOnSale.currency?.exchangeRate,
      fiatExchangeRate: putOnSale.fiatCurrency?.exchangeRate,
      currencyId: putOnSale.currencyId,
      fiatCurrencyId: putOnSale.fiatCurrencyId,
      putOnSale,
      otp: otpData,
      sendOtpTime: new Date(),
      totalVerifyOtp: 0,
      buyer: user,
      seller: putOnSale.user,
    });

    await this.purchaseRepository.save(purchase);
    const message = `SWAP2CASH: Your OTP code to verify transaction is: ${otpData},
    please do not share it with anyone. This code is valid for 10 minutes`;
    await this.vonageService.sendSmsMessage(
      user.phone,
      user.phoneCode,
      message,
    );

    this.smtpMailService
      .sendEmail(
        user.email,
        MailSubject.OtpCode,
        'user',
        'send-otp-verify-purchase-buyer',
        { otpCode: otpData },
      )
      .then((resp) => resp)
      .catch((e) => e);

    return purchase.toDto();
  }

  @Transactional()
  async verifyOtp(user: UserEntity, data: VerifyOtpPurchaseDto) {
    const { id, otpCode } = data;
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id,
        buyerId: user.id,
        status: PurchaseStatus.DRAFT,
      },
      relations: ['putOnSale'],
      select: {
        id: true,
        otp: true,
        sendOtpTime: true,
        totalVerifyOtp: true,
        buyAmount: true,
        putOnSale: {
          id: true,
          amount: true,
          availableAmount: true,
        },
      },
    });

    if (!purchase || !purchase.putOnSale) {
      throw new ApiError('Invalid otp', 'E10');
    }

    if (parseFloat(purchase.putOnSale.availableAmount) <= 0) {
      throw new ApiError('token have been bought out. please f5 to verify');
    }

    if (
      parseFloat(purchase.buyAmount) >
      parseFloat(purchase.putOnSale.availableAmount)
    ) {
      throw new ApiError(
        'the remaining quantity of token is not enough',
        'E17',
      );
    }

    if (!purchase.otp || purchase.otp !== otpCode) {
      await this.purchaseRepository.update(
        {
          id,
        },
        {
          totalVerifyOtp: purchase.totalVerifyOtp + 1,
        },
      );

      throw new ApiError('Invalid Otp code', 'E-1');
    }

    const current = new Date();

    if (purchase.totalVerifyOtp > 3) {
      throw new ApiError('You have entered wrongly more than 3 times', 'E12');
    }

    if (
      new Date(purchase.sendOtpTime || new Date()).getTime() -
        current.getTime() >
      OTP_EXPIRED_TIME
    ) {
      throw new ApiError('Expired Otp', 'E3');
    }

    const result = await this.purchaseRepository.update(
      {
        id,
      },
      {
        status: PurchaseStatus.WAITING_TO_PAYMENT,
        otp: undefined,
        sendOtpTime: undefined,
        totalVerifyOtp: undefined,
        confirmOtpTime: new Date(),
      },
    );

    const newAvailableAmount = new BigNumber(purchase.putOnSale.availableAmount)
      .minus(new BigNumber(purchase.buyAmount))
      .toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePutOnSale = {} as any;
    updatePutOnSale.availableAmount = newAvailableAmount;

    if (newAvailableAmount === '0') {
      updatePutOnSale.status = PutOnSaleStatus.CANCELED;
      updatePutOnSale.cancelReason = PutOnSaleCancelReason.OutOfToken;

      await this.purchaseRepository.update(
        {
          putOnSaleId: purchase.putOnSale.id,
          id: Not(purchase.id),
          status: In([PurchaseStatus.DRAFT, PurchaseStatus.WAITING_TO_PAYMENT]),
        },
        {
          status: PurchaseStatus.CANCEL,
        },
      );
    }

    await this.putOnSaleRepository.update(
      {
        id: purchase.putOnSale.id,
      },
      updatePutOnSale,
    );

    await this.purchaseQueue.addCheckStatusPurchaseQueue(
      id,
      DELAY_TIME_WAITING_BUYER_CONFIRM,
      PurchaseStatus.WAITING_TO_PAYMENT,
    );

    return result.affected !== 0;
  }

  @Transactional()
  async buyerCancelPurchase(user: UserEntity, id: Uuid) {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id,
        buyerId: user.id,
        status: PurchaseStatus.WAITING_TO_PAYMENT,
      },
      relations: ['putOnSale'],
      select: {
        id: true,
        buyAmount: true,
        putOnSale: {
          id: true,
          availableAmount: true,
        },
      },
    });

    if (!purchase || !purchase.putOnSale) {
      throw new ApiError('Invalid data', 'E-1');
    }

    const result = await this.purchaseRepository.update(
      {
        id,
      },
      {
        status: PurchaseStatus.CANCEL,
      },
    );
    const refundAmount = new BigNumber(
      purchase.putOnSale.availableAmount || '0',
    )
      .plus(new BigNumber(purchase.buyAmount))
      .toString();
    await this.putOnSaleRepository.update(
      {
        id: purchase.putOnSale.id,
      },
      {
        availableAmount: refundAmount,
      },
    );

    return result.affected !== 0;
  }

  async resentOtpCode(user: UserEntity, data: ResentOtpPurchaseDto) {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: data.id,
        buyer: {
          id: user.id,
        },
      },
    });

    if (!purchase) {
      throw new ApiError('Invalid data', 'E-1');
    }

    if (purchase.status !== PurchaseStatus.DRAFT) {
      throw new ApiError('Invalid purchase', 'E-1');
    }

    const otpData = otp();
    const result = await this.purchaseRepository.update(
      {
        id: data.id,
      },
      {
        otp: otpData,
        sendOtpTime: new Date(),
        totalVerifyOtp: 0,
      },
    );

    const message = `SWAP2CASH: Your OTP code to verify transaction is: ${otpData},
    please do not share it with anyone. This code is valid for 10 minutes`;
    await this.vonageService.sendSmsMessage(
      user.phone,
      user.phoneCode,
      message,
    );

    this.smtpMailService
      .sendEmail(
        user.email,
        MailSubject.OtpCode,
        'user',
        'send-otp-verify-purchase-buyer',
        { otpCode: otpData },
      )
      .then((resp) => resp)
      .catch((e) => e);

    return result.affected !== 0;
  }

  @Transactional()
  async buyerConfirmBuy(user: UserEntity, data: BuyerConfirmPayDto) {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: data.id,
        buyerId: user.id,
        status: PurchaseStatus.WAITING_TO_PAYMENT,
      },
      relations: ['seller', 'putOnSale', 'putOnSale.listPaymentAccept'],
      select: {
        id: true,
        buyAmount: true,
        seller: {
          id: true,
          phone: true,
          phoneCode: true,
          email: true,
        },
        putOnSale: {
          id: true,
          availableAmount: true,
          listPaymentAccept: {
            id: true,
          },
        },
      },
    });

    if (
      !purchase ||
      !purchase.seller ||
      !purchase.putOnSale?.listPaymentAccept
    ) {
      throw new ApiError('Invalid data', 'E-1');
    }

    let isPaymentValid = false;
    let paymentInsert = {} as PaymentEntity;

    for (const payment of purchase.putOnSale.listPaymentAccept) {
      if (payment.id === data.paymentId) {
        paymentInsert = payment;
        isPaymentValid = true;
        break;
      }
    }

    if (!isPaymentValid) {
      throw new ApiError('Invalid payment data', 'E-1');
    }

    const result = await this.purchaseRepository.update(
      {
        id: data.id,
      },
      {
        status: PurchaseStatus.BUYER_CONFIRM_PAY,
        payment: paymentInsert,
      },
    );

    const message = `The buyer has just purchased your token and has confirmed the transfer.
                     Please check the transaction and confirm with the system that the money has been received. The transaction id is: ${data.id}
                    `;

    this.vonageService
      .sendSmsMessage(purchase.seller.phone, purchase.seller.phoneCode, message)
      .then((resp) => resp)
      .catch((e) => e);

    this.smtpMailService
      .sendEmail(
        purchase.seller.email,
        MailSubject.ConfirmPurchase,
        'user',
        'send-confirm-purchase',
        { id: purchase.id, appDomain: this.apiConfigService.appConfig.domain },
      )
      .then((resp) => resp)
      .catch((e) => e);

    return result.affected !== 0;
  }

  @Transactional()
  async sellerConfirmBuy(
    user: UserEntity,
    data: UpdateDto,
    fromAdmin?: boolean,
  ) {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: data.id,
        sellerId: user.id,
        status:
          fromAdmin === true
            ? PurchaseStatus.PENDING_BY_DISABLE_USER
            : PurchaseStatus.BUYER_CONFIRM_PAY,
      },
      relations: ['buyer', 'putOnSale', 'putOnSale.currency'],
      select: {
        id: true,
        buyAmount: true,
        buyerId: true,
        currencyId: true,
        chainId: true,
        buyer: {
          id: true,
        },
        putOnSale: {
          id: true,
          availableAmount: true,
          currency: {
            id: true,
          },
        },
      },
    });

    if (
      !purchase ||
      !purchase.putOnSale ||
      !purchase.putOnSale.currency ||
      !purchase.buyer
    ) {
      throw new ApiError('Invalid data', 'E-1');
    }

    purchase.status = PurchaseStatus.SELLER_CONFIRM_PAY;

    await this.purchaseRepository.update(
      {
        id: purchase.id,
      },
      {
        status: PurchaseStatus.SELLER_CONFIRM_PAY,
      },
    );

    const walletExisted = await this.walletRepository.findOne({
      where: {
        ownerId: purchase.buyerId,
        chainId: purchase.chainId,
        currencyId: purchase.currencyId,
      },
      select: {
        id: true,
        totalAmount: true,
      },
    });

    if (!walletExisted) {
      const wallet = this.walletRepository.create();
      wallet.totalAmount = purchase.buyAmount;
      wallet.chainId = purchase.chainId;
      wallet.owner = purchase.buyer;
      wallet.currency = purchase.putOnSale.currency;

      await this.walletRepository.save(wallet);
    } else {
      const updateTotalAmount = new BigNumber(walletExisted.totalAmount)
        .plus(new BigNumber(purchase.buyAmount))
        .toString();

      await this.walletRepository.update(
        {
          id: walletExisted.id,
        },
        {
          totalAmount: updateTotalAmount,
        },
      );
    }

    return purchase;
  }

  async getListPurchaseSell(user: UserEntity, filter: PurchasePageOptionDto) {
    const where = {} as QueryPurchaseDto;
    where.sellerId = user.id;

    return this.getListPurchase(where, filter);
  }

  async getListPurchaseBuy(user: UserEntity, filter: PurchasePageOptionDto) {
    const where = {} as QueryPurchaseDto;
    where.buyerId = user.id;

    return this.getListPurchase(where, filter);
  }

  async getListPurchase(
    where: QueryPurchaseDto,
    filter: PurchasePageOptionDto,
  ) {
    const { status, chainId, currencyId, fiatCurrencyId } = filter;

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

    if (!status) {
      where.status = Not(PurchaseStatus.DRAFT);
    }

    const [listPurchase, total] = await this.purchaseRepository.findAndCount({
      where,
      relations: [
        'buyer',
        'seller',
        'putOnSale',
        'putOnSale.currency',
        'putOnSale.fiatCurrency',
        'putOnSale.listPaymentAccept',
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

    return listPurchase.toPageDto(pageMetaDto);
  }

  async buyerGetDetail(user: UserEntity, id: Uuid) {
    const where = {
      id,
      buyerId: user.id,
    } as QueryPurchaseDto;

    return this.getDetailPurchase(where);
  }

  async sellerGetDetail(user: UserEntity, id: Uuid) {
    const where = {
      id,
      sellerId: user.id,
    } as QueryPurchaseDto;

    return this.getDetailPurchase(where);
  }

  async getDetailPurchase(where: QueryPurchaseDto) {
    const purchase = await this.purchaseRepository.findOne({
      where,
      relations: [
        'buyer',
        'seller',
        'putOnSale',
        'putOnSale.currency',
        'putOnSale.fiatCurrency',
        'putOnSale.listPaymentAccept',
        'payment',
      ],
    });

    if (!purchase) {
      throw new ApiError('Invalid data', 'E-1');
    }

    return purchase.toDto();
  }

  async uploadProofTransferredImage(user: UserEntity, id: Uuid, file: IFile) {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id,
        buyerId: user.id,
        status: PurchaseStatus.PENDING_BY_DISABLE_USER,
      },
      select: {
        id: true,
      },
    });

    if (!purchase) {
      throw new ApiError('Invalid data', 'E-1');
    }

    return file.path.replace(storageExtUrlRemove, '');
  }

  @Transactional()
  async upsertProofTransferredMoney(
    user: UserEntity,
    data: CreateProofTransferredMoneyDto,
  ) {
    const { purchaseId, dataProof, description } = data;

    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: purchaseId,
        buyerId: user.id,
        status: PurchaseStatus.PENDING_BY_DISABLE_USER,
      },
      select: {
        id: true,
      },
    });

    if (!purchase) {
      throw new ApiError('Invalid data', 'E-1');
    }

    await this.proofTransferredMoneyRepository.delete({
      purchaseId: purchase.id,
    });

    const listProof = [] as ProofTransferredMoneyEntity[];

    for (const proof of dataProof) {
      listProof.push(
        this.proofTransferredMoneyRepository.create({
          ...proof,
          description,
          purchase,
        }),
      );
    }

    await this.proofTransferredMoneyRepository.save(listProof);

    return true;
  }
}
