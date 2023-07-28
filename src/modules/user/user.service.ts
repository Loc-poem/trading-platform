import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import type { FindOptionsWhere, UpdateResult } from 'typeorm';
import {
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { SendGridService } from '../../@sdk/sendgrid/sendgrid.service';
import { MailSubject } from '../../@sdk/smtp-mail/enum/mail.enums';
import { SmtpMailService } from '../../@sdk/smtp-mail/smtp-mail.service';
import { VonageService } from '../../@sdk/vonage/vonage.service';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { ApiError } from '../../common/response/api-error';
import { generateHash, otp } from '../../common/utils';
import { Web3Util } from '../../common/web3/web3.util';
import { FileNotImageException } from '../../exceptions';
import type { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import type { ServiceFeeTransactionPageOptionDto } from '../admin/dto/service-fee-transaction-page-option.dto';
import { ProfitEntity } from '../admin/entities/profit.entity';
import { ReferralProgramConfigEntity } from '../admin/entities/referral-program-config.entity';
import { ServiceFeeTransactionEntity } from '../admin/entities/service-fee-transaction.entity';
import { StoreFeeEntity } from '../admin/entities/store-fee.entity';
import { ServiceFeeTransactionStatus } from '../admin/enums/admin.enums';
import type { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import type { ResendOtpCodeDto } from '../auth/dto/resend-otp-code.dto';
import type { ResetPasswordDto } from '../auth/dto/reset-password-dto';
import type { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import type { VerifyOtpCodeDto } from '../auth/dto/verify-otp-code.dto';
import type { VerifyOtpMailDto } from '../auth/dto/verify-otp-mail.dto';
import { OtpType } from '../auth/enums/auth.enum';
import { ContractService } from '../contract/contract.service';
import { nativeTokenId } from '../currency/constants/currency.const';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { PutOnSaleStatus } from '../put-on-sale/enums/put-on-sale.enum';
import { OTP_EXPIRED_TIME } from './constants/user.constants';
import type { UpdateAccountInformationDto } from './dtos/update-account-information.dto';
import { UpdateWithdrawDto } from './dtos/update-withdraw.dto';
import type { VerifyChangePasswordOtpDto } from './dtos/verify-change-password-otp.dto';
import type { WalletPageOptionDto } from './dtos/wallet-page-option.dto';
import type { WalletQueryDto } from './dtos/wallet-query.dto';
import { WithdrawTokenDto } from './dtos/withdraw-token.dto';
import { NationalityEntity } from './entities/nationality.entity';
import { ReferralProgramEntity } from './entities/referral-program-level.entity';
import { ReferralRewardTransactionEntity } from './entities/referral-reward-transaction.entity';
import { UserEntity } from './entities/user.entity';
import { WalletEntity } from './entities/wallet.entity';
import { WithdrawTransactionEntity } from './entities/withdraw-transaction.entity';
import { WithdrawTransactionDetailEntity } from './entities/withdraw-transaction-detail.entity';
import { WithdrawTransactionStatus } from './enums/user.enums';

BigNumber.config({ EXPONENTIAL_AT: 9999 });

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(NationalityEntity)
    private nationalityRepository: Repository<NationalityEntity>,
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(StoreFeeEntity)
    private readonly storeFeeRepository: Repository<StoreFeeEntity>,
    @InjectRepository(WithdrawTransactionEntity)
    private readonly withdrawTransactionRepository: Repository<WithdrawTransactionEntity>,
    @InjectRepository(WithdrawTransactionDetailEntity)
    private readonly withdrawTransactionDetailRepository: Repository<WithdrawTransactionDetailEntity>,
    @InjectRepository(ReferralProgramEntity)
    private readonly referralProgramRepository: Repository<ReferralProgramEntity>,
    @InjectRepository(ProfitEntity)
    readonly profitRepository: Repository<ProfitEntity>,
    @InjectRepository(ReferralProgramConfigEntity)
    private readonly referralProgramConfigRepository: Repository<ReferralProgramConfigEntity>,
    @InjectRepository(ServiceFeeTransactionEntity)
    private readonly serviceFeeTransactionRepository: Repository<ServiceFeeTransactionEntity>,
    @InjectRepository(ReferralRewardTransactionEntity)
    private readonly referralRewardTransactionRepository: Repository<ReferralRewardTransactionEntity>,
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private readonly vonageService: VonageService,
    private readonly sendGridService: SendGridService,
    private readonly smtpMailService: SmtpMailService,
    private readonly contractService: ContractService,
  ) {}

  /**
   * Find single user
   */
  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<UserEntity> {
    const { email, referralCode, ...dataCreateUser } = userRegisterDto;

    const existedUser = await this.userRepository.findOne({
      where: [
        {
          email: email.toLowerCase().trim(),
        },
        {
          phone: userRegisterDto.phone,
        },
        {
          userName: dataCreateUser.userName,
        },
      ],
      select: {
        id: true,
        email: true,
        phone: true,
        userName: true,
      },
    });

    if (existedUser) {
      if (existedUser.email === email.toLowerCase()) {
        throw new ApiError('Email account already exists', 'E1');
      }

      if (existedUser.phone === userRegisterDto.phone) {
        throw new ApiError('Phone number already exists', 'E1');
      }

      if (existedUser.userName === dataCreateUser.userName) {
        throw new ApiError('User name already exists', 'E1');
      }
    }

    //const referralCodeGenerate = await this.generateReferralCodeUser();

    const user = this.userRepository.create({
      ...dataCreateUser,
      email: email.toLowerCase().trim(),
      //referralCode: referralCodeGenerate,
    });

    if (userRegisterDto.nationalityId) {
      const nationality = await this.nationalityRepository.findOne({
        where: {
          id: userRegisterDto.nationalityId,
        },
      });

      if (!nationality) {
        throw new NotFoundException();
      }

      user.nationality = nationality;
    }

    const generateOtp = otp();
    user.otpCode = generateOtp;
    user.sentOtpTime = new Date();
    user.isVerified = false;
    user.isConsumedOtp = false;
    user.isActive = true;

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    await this.userRepository.save(user);

    if (referralCode) {
      await this.updateReferralProgramData(referralCode, user);
    }

    this.smtpMailService
      .sendEmail(user.email, MailSubject.OtpCode, 'user', 'send-otp', {
        otpCode: generateOtp,
      })
      .then((resp) => resp)
      .catch((e) => e);

    return user;
  }

  private async updateReferralProgramData(
    referralCode: string,
    sourceUser: UserEntity,
  ) {
    const referralOwnerUser = await this.userRepository.findOne({
      where: {
        userName: referralCode,
      },
      select: {
        id: true,
      },
    });

    if (!referralOwnerUser) {
      throw new ApiError(
        'The referral code is invalid. Please try again',
        'E-1',
      );
    }

    const referralProgramInsert = [] as ReferralProgramEntity[];

    referralProgramInsert.push(
      this.referralProgramRepository.create({
        sourceUser,
        referralOwner: referralOwnerUser,
        level: 1,
      }),
    );

    const listReferralProgramOfOwnerUser =
      await this.referralProgramRepository.find({
        where: {
          sourceUserId: referralOwnerUser.id,
          level: LessThanOrEqual(4),
        },
        relations: ['referralOwner'],
        select: {
          id: true,
          level: true,
          referralOwner: {
            id: true,
          },
        },
      });

    if (listReferralProgramOfOwnerUser.length > 0) {
      for (const referralProgram of listReferralProgramOfOwnerUser) {
        referralProgramInsert.push(
          this.referralProgramRepository.create({
            sourceUser,
            referralOwner: referralProgram.referralOwner,
            level: referralProgram.level + 1,
          }),
        );
      }
    }

    await this.referralProgramRepository.save(referralProgramInsert);
  }

  private async generateReferralCodeUser() {
    const generateCode = Math.random().toString(36).substring(2, 7);
    const referralCode = `${generateCode}-${new Date().getTime()}`;
    const existedUser = await this.userRepository.count({
      where: {
        referralCode,
      },
    });

    if (existedUser) {
      return this.generateReferralCodeUser();
    }

    return referralCode;
  }

  async resentOtpCode(data: ResendOtpCodeDto) {
    await this.sendOtpMail(data, OtpType.LOGIN);

    return true;
  }

  async resentOtpCodeReset(data: ResendOtpCodeDto) {
    await this.sendOtpMail(data, OtpType.FORGOT_PASSWORD);

    return true;
  }

  async forgotPassword(data: ForgotPasswordDto) {
    await this.sendOtpMail(data, OtpType.FORGOT_PASSWORD);

    return data.email;
  }

  async sendOtpMail(data: ResendOtpCodeDto | ForgotPasswordDto, type: OtpType) {
    const existedUser = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
    });

    if (!existedUser) {
      throw new ApiError('Invalid email', 'E11');
    }

    const generateOtp = otp();
    const current = new Date();
    let subject = '';
    let mailTemplate = '';

    switch (type) {
      case OtpType.FORGOT_PASSWORD: {
        existedUser.otpResetPassword = generateOtp;
        existedUser.sendOtpResetTime = current;
        existedUser.totalVerifyResetOtp = 0;
        subject = MailSubject.OtpResetPassword;
        mailTemplate = 'sent-otp-forgot-password';
        break;
      }

      case OtpType.LOGIN: {
        existedUser.otpCode = generateOtp;
        existedUser.sentOtpTime = current;
        existedUser.isConsumedOtp = false;
        subject = MailSubject.OtpCode;
        mailTemplate = 'sent-otp-forgot-password';
        break;
      }
    }

    await this.userRepository.save(existedUser);

    this.smtpMailService
      .sendEmail(existedUser.email, subject, 'user', mailTemplate, {
        otpCode: generateOtp,
      })
      .then((resp) => resp)
      .catch((e) => e);
  }

  private async sendOtpCodeMessage(
    otpCode: string,
    phone: string,
    phoneCode: string,
    // type: OtpType,
  ) {
    const message = `SWAP2CASH: Your OTP to verify phone number is: ${otpCode},
      please do not share it with anyone. This code is valid for 10 minutes`;

    await this.vonageService.sendSmsMessage(phone, phoneCode, message);
  }

  async verifyOtpCode(data: VerifyOtpCodeDto) {
    const { otpCode, email } = data;
    const existedUser = await this.userRepository.findOne({
      where: {
        email,
        otpCode,
      },
    });

    if (!existedUser) {
      throw new ApiError('Invalid Otp Code', 'E2');
    }

    const currentTime = new Date();
    const sentTime = new Date(existedUser.sentOtpTime);

    if (currentTime.getTime() - sentTime.getTime() > OTP_EXPIRED_TIME) {
      throw new ApiError('Expired Otp', 'E3');
    }

    if (existedUser.isConsumedOtp === true) {
      throw new ApiError('Otp code has used', 'E4');
    }

    existedUser.isConsumedOtp = true;
    existedUser.isVerified = true;

    await this.userRepository.save(existedUser);

    return existedUser;
  }

  async verifyOtpCodeReset(data: VerifyOtpCodeDto) {
    const { otpCode, email } = data;
    const existedUser = await this.userRepository.findOne({
      where: {
        email,
      },
      select: {
        id: true,
        sendOtpResetTime: true,
        otpResetPassword: true,
        totalVerifyResetOtp: true,
      },
    });

    if (!existedUser) {
      throw new ApiError('Invalid Otp Code', 'E2');
    }

    if (
      !existedUser.otpResetPassword ||
      existedUser.otpResetPassword !== otpCode
    ) {
      await this.userRepository.update(
        {
          id: existedUser.id,
        },
        {
          totalVerifyResetOtp: (existedUser.totalVerifyResetOtp || 0) + 1,
        },
      );

      throw new ApiError('Invalid Otp Code', 'E2');
    }

    const currentTime = new Date();
    const sentTime = new Date(existedUser.sendOtpResetTime || new Date());

    if (existedUser.totalVerifyResetOtp > 3) {
      throw new ApiError('You have entered wrongly more than 3 times', 'E12');
    }

    if (currentTime.getTime() - sentTime.getTime() > OTP_EXPIRED_TIME) {
      throw new ApiError('Expired Otp', 'E3');
    }

    await this.userRepository.update(
      {
        id: existedUser.id,
      },
      {
        isVerifiedOtpReset: true,
      },
    );

    return true;
  }

  async sendOtpCodeChangePassword(user: UserEntity) {
    const otpData = otp();
    const result = await this.userRepository.update(
      {
        id: user.id,
      },
      {
        otpVerifyChangePassword: otpData,
        sendOtpVerifyChangePasswordTime: new Date(),
        totalVerifyChangePasswordOtp: 0,
      },
    );

    this.smtpMailService
      .sendEmail(
        user.email,
        MailSubject.OtpCode,
        'user',
        'send-otp-verify-change-password',
        { otpCode: otpData },
      )
      .then((resp) => resp)
      .catch((e) => e);

    return result.affected !== 0;
  }

  async verifyOtpCodeChangePassword(
    user: UserEntity,
    data: VerifyChangePasswordOtpDto,
  ) {
    const { otpCode } = data;
    const userInfor = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        otpVerifyChangePassword: true,
        sendOtpVerifyChangePasswordTime: true,
        acceptChangePassword: true,
        totalVerifyChangePasswordOtp: true,
      },
    });

    if (!userInfor) {
      throw new ApiError('Invalid data', 'E-1');
    }

    if (
      !userInfor.otpVerifyChangePassword ||
      userInfor.otpVerifyChangePassword !== otpCode
    ) {
      await this.userRepository.update(
        {
          id: user.id,
        },
        {
          totalVerifyChangePasswordOtp:
            userInfor.totalVerifyChangePasswordOtp + 1,
        },
      );

      throw new ApiError('Invalid Otp code', 'E-1');
    }

    const current = new Date();

    if (userInfor.totalVerifyChangePasswordOtp > 3) {
      throw new ApiError('You have entered wrongly more than 3 times', 'E12');
    }

    if (
      new Date(
        userInfor.sendOtpVerifyChangePasswordTime || new Date(),
      ).getTime() -
        current.getTime() >
      OTP_EXPIRED_TIME
    ) {
      throw new ApiError('Expired Otp', 'E3');
    }

    const result = await this.userRepository.update(
      {
        id: user.id,
      },
      {
        totalVerifyChangePasswordOtp: undefined,
        otpVerifyChangePassword: undefined,
        sendOtpVerifyChangePasswordTime: undefined,
        acceptChangePassword: true,
      },
    );

    return result.affected !== 0;
  }

  async updateAccountInformation(
    user: UserEntity,
    data: UpdateAccountInformationDto,
  ) {
    const { nationalityId, ...dataUpdate } = data;

    if (nationalityId) {
      const nationality = await this.nationalityRepository.findOne({
        where: {
          id: nationalityId,
        },
      });

      if (!nationality) {
        throw new ApiError('');
      }

      dataUpdate.nationality = nationality;
    }

    if (data.password) {
      const userData = await this.userRepository.findOne({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          acceptChangePassword: true,
        },
      });

      if (userData?.acceptChangePassword === false) {
        throw new ApiError(
          'You cannot change the password without validate email',
          'E12',
        );
      }

      dataUpdate.password = generateHash(dataUpdate.password);
    }

    const result = await this.userRepository.update(
      {
        id: user.id,
      },
      {
        ...dataUpdate,
      },
    );

    return result.affected !== 0;
  }

  async resetPassword(data: ResetPasswordDto) {
    const { otpCode, email, password } = data;
    const existedUser = await this.userRepository.findOne({
      where: {
        email,
        otpResetPassword: otpCode,
      },
    });

    if (
      !existedUser ||
      !existedUser.isVerifiedOtpReset ||
      (existedUser.totalVerifyResetOtp && existedUser.totalVerifyResetOtp > 3)
    ) {
      throw new ApiError('Invalid otp', 'E-1');
    }

    const result = await this.userRepository.update(
      {
        id: existedUser.id,
      },
      {
        password: generateHash(password),
        otpResetPassword: undefined,
        sendOtpResetTime: undefined,
        isVerifiedOtpReset: undefined,
        totalVerifyResetOtp: undefined,
      },
    );

    return result.affected !== 0;
  }

  async sendOtpVerifyPhoneNumber(user: UserEntity) {
    const generateOtp = otp();
    const current = new Date();

    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        otpVerifyPhoneNumber: generateOtp,
        sendOtpVerifyPhoneNumberTime: current,
        totalVerifyPhoneNumberOtp: 0,
      },
    );

    await this.sendOtpCodeMessage(
      generateOtp,
      user.phone,
      user.phoneCode,
      // OtpType.VERIFY_PHONE_NUMBER,
    );

    return true;
  }

  async verifyOtpPhoneNumber(user: UserEntity, data: VerifyOtpMailDto) {
    const userData = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      select: [
        'otpVerifyPhoneNumber',
        'sendOtpVerifyPhoneNumberTime',
        'totalVerifyPhoneNumberOtp',
        'isVerifiedPhoneNumber',
      ],
    });

    if (!userData) {
      throw new ApiError('Invalid', 'E-1');
    }

    if (userData.isVerifiedPhoneNumber) {
      throw new ApiError('Phone number is valid', 'E14');
    }

    const currentTime = new Date();
    const sentTime = new Date(
      userData.sendOtpVerifyPhoneNumberTime || new Date(),
    );

    if (userData.totalVerifyPhoneNumberOtp > 3) {
      throw new ApiError('You have entered wrongly more than 3 times', 'E12');
    }

    if (currentTime.getTime() - sentTime.getTime() > OTP_EXPIRED_TIME) {
      throw new ApiError('Expired Otp', 'E3');
    }

    if (
      !userData.otpVerifyPhoneNumber ||
      userData.otpVerifyPhoneNumber !== data.otpCode
    ) {
      await this.userRepository.update(
        {
          id: user.id,
        },
        {
          totalVerifyResetOtp: (userData.totalVerifyResetOtp || 0) + 1,
        },
      );

      throw new ApiError('Invalid Otp Code', 'E2');
    }

    const result = await this.userRepository.update(
      {
        id: userData.id,
      },
      {
        isVerifiedPhoneNumber: true,
        otpVerifyPhoneNumber: undefined,
        sendOtpVerifyPhoneNumberTime: undefined,
        totalVerifyPhoneNumberOtp: undefined,
      },
    );

    return result.affected !== 0;
  }

  async getUserProfile(user: UserEntity) {
    const userData = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: ['listPayment', 'listPayment.listPaymentAccountNumber'],
    });

    if (!userData) {
      throw new ApiError('Invalid data', 'E-1');
    }

    return userData.toDto();
  }

  async getWalletOfUser(user: UserEntity, filter: WalletPageOptionDto) {
    const { chainId } = filter;
    const where = {} as WalletQueryDto;
    where.ownerId = user.id;

    if (chainId) {
      where.chainId = chainId;
    }

    const [listWallet, total] = await this.walletRepository.findAndCount({
      where,
      relations: ['currency'],
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listWallet.toPageDto(pageMetaDto);
  }

  async getListReferralRewardTransaction(
    user: UserEntity,
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
    where.rewardOwnerId = user.id;

    const [listReferralRewardTransaction, total] =
      await this.referralRewardTransactionRepository.findAndCount({
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

    return listReferralRewardTransaction.toPageDto(pageMetaDto);
  }

  @Transactional()
  async withDrawToken(user: UserEntity, data: WithdrawTokenDto) {
    const { userWalletAddress, listWalletId, chainId } = data;
    const nonce = await this.contractService.getNonceOfUser({
      chainId,
      userId: user.id,
    });
    const checkWrongData = await this.walletRepository.count({
      where: {
        ownerId: Not(user.id),
        id: In(listWalletId),
      },
    });

    if (checkWrongData) {
      throw new ApiError('Invalid data', 'E-1');
    }

    const listWallet = await this.walletRepository.find({
      where: {
        ownerId: user.id,
        id: In(listWalletId),
      },
      relations: ['currency'],
      select: {
        id: true,
        totalAmount: true,
        currency: {
          id: true,
          tokenId: true,
          name: true,
          exchangeRate: true,
          decimal: true,
        },
      },
    });

    let totalFiatAmount = new BigNumber(0);
    const tokenIds = [] as string[];
    const amounts = [] as number[];
    const decimal = [] as number[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const amountsDecimal = [] as unknown as any;

    for (const wallet of listWallet) {
      totalFiatAmount = totalFiatAmount.plus(
        new BigNumber(wallet.totalAmount).multipliedBy(
          new BigNumber(wallet.currency?.exchangeRate || 1),
        ),
      );

      tokenIds.push(wallet.currency?.tokenId || '');
      decimal.push(wallet.currency?.decimal || 18);
      amounts.push(new BigNumber(wallet.totalAmount).toNumber());

      const pow = new BigNumber(Math.pow(10, wallet.currency?.decimal || 18));
      amountsDecimal.push(
        new BigNumber(wallet.totalAmount).multipliedBy(pow).toString(),
      );
    }

    const nativeToken = await this.currencyRepository.findOne({
      where: {
        chainId,
        tokenId: nativeTokenId,
      },
    });

    if (!nativeToken) {
      throw new ApiError('Invalid data', 'E-1');
    }

    const storeFee = await this.storeFeeRepository.find({
      where: {
        minFiatAmountUsd: LessThanOrEqual(totalFiatAmount.toNumber()),
      },
      order: {
        minFiatAmountUsd: 'DESC',
      },
      take: 1,
    });

    const serviceFeeAmount = totalFiatAmount
      .multipliedBy(storeFee[0].fee || 1)
      .dividedBy(new BigNumber(100))
      .dividedBy(new BigNumber(nativeToken.exchangeRate))
      .toPrecision(6);

    const pow = new BigNumber(Math.pow(10, nativeToken.decimal));
    const serviceFeeAmountPow = new BigNumber(serviceFeeAmount)
      .multipliedBy(pow)
      .toString();

    const withDrawTransaction = this.withdrawTransactionRepository.create({
      user,
      walletAddress: userWalletAddress,
      status: WithdrawTransactionStatus.DRAFT,
      serviceFee: storeFee[0].fee,
      chainId,
    });

    await this.withdrawTransactionRepository.save(withDrawTransaction);
    await this.updateReferralAndServiceFee(
      totalFiatAmount.toString(),
      storeFee[0].fee,
      user.id,
      chainId,
      withDrawTransaction,
      nativeToken,
      serviceFeeAmount,
    );

    const listWithdrawTransactionDetail =
      [] as WithdrawTransactionDetailEntity[];

    for (const wallet of listWallet) {
      listWithdrawTransactionDetail.push(
        this.withdrawTransactionDetailRepository.create({
          amount: wallet.totalAmount,
          currency: wallet.currency,
          exchangeRate: wallet.currency?.exchangeRate || '0',
          wallet,
          withdrawTransaction: withDrawTransaction,
        }),
      );
    }

    await this.withdrawTransactionDetailRepository.save(
      listWithdrawTransactionDetail,
    );

    const dataSignature = Web3Util.signDataWithdraw({
      toAddress: userWalletAddress,
      nonce,
      tokenIds,
      amountsDecimal,
      amounts,
      userId: user.id,
      id: withDrawTransaction.id,
      chainId,
      decimal,
      serviceFeeAmount: serviceFeeAmountPow,
    });

    await this.withdrawTransactionRepository.update(
      {
        id: withDrawTransaction.id,
      },
      {
        signatureWithdraw: dataSignature.signature,
      },
    );

    return dataSignature;
  }

  @Transactional()
  async updateReferralAndServiceFee(
    totalFiatAmount: string,
    serviceFee: string,
    userId: Uuid,
    chainId: number,
    withdrawTransaction: WithdrawTransactionEntity,
    nativeToken: CurrencyEntity,
    serviceFeeAmount,
  ) {
    const listReferralOwner = await this.referralProgramRepository.find({
      where: {
        sourceUserId: userId,
      },
      relations: ['referralOwner'],
      select: {
        id: true,
        level: true,
        referralOwner: {
          id: true,
        },
      },
      order: {
        level: 'DESC',
      },
    });

    const serviceFeeTransaction = [] as ServiceFeeTransactionEntity[];

    if (listReferralOwner.length === 0) {
      serviceFeeTransaction.push(
        this.serviceFeeTransactionRepository.create({
          totalAmount: serviceFeeAmount,
          chainId,
          currency: nativeToken,
          withdrawTransaction,
          status: ServiceFeeTransactionStatus.DRAFT,
        }),
      );

      await this.serviceFeeTransactionRepository.save(serviceFeeTransaction);

      return true;
    }

    const referralConfig = await this.referralProgramConfigRepository.find({
      where: {
        level: LessThanOrEqual(listReferralOwner[0].level),
      },
      select: {
        id: true,
        level: true,
        rewardPercent: true,
      },
      order: {
        level: 'DESC',
      },
    });
    const userReferralRewardData = [] as ReferralRewardTransactionEntity[];

    let adminFee = new BigNumber(totalFiatAmount).dividedBy(
      new BigNumber(nativeToken.exchangeRate),
    );

    for (let index1 = 0; index1 <= listReferralOwner.length - 1; index1++) {
      const userReferralReward = new BigNumber(serviceFeeAmount)
        .multipliedBy(new BigNumber(referralConfig[index1].rewardPercent))
        .dividedBy(new BigNumber(100));
      adminFee = adminFee.minus(userReferralReward);
      userReferralRewardData.push(
        this.referralRewardTransactionRepository.create({
          totalAmount: userReferralReward.toString(),
          chainId,
          currency: nativeToken,
          status: ServiceFeeTransactionStatus.DRAFT,
          withdrawTransaction,
          rewardOwner: listReferralOwner[index1].referralOwner,
        }),
      );
    }

    serviceFeeTransaction.push(
      this.serviceFeeTransactionRepository.create({
        totalAmount: adminFee.toString(),
        chainId,
        currency: nativeToken,
        withdrawTransaction,
        status: ServiceFeeTransactionStatus.DRAFT,
      }),
    );

    await Promise.all([
      this.referralRewardTransactionRepository.save(userReferralRewardData),
      this.serviceFeeTransactionRepository.save(serviceFeeTransaction),
    ]);

    return true;
  }

  @Transactional()
  async withdrawReferralRewardToken(user: UserEntity) {
    const listReferralReward =
      await this.referralRewardTransactionRepository.find({
        where: {
          status: ServiceFeeTransactionStatus.SUCCESS,
          rewardOwnerId: user.id,
        },
        relations: ['currency'],
        select: {
          id: true,
          currencyId: true,
          currency: {
            id: true,
          },
          chainId: true,
          rewardOwnerId: true,
          totalAmount: true,
        },
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listCurrencyUpdate = {} as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promiseAll = [] as any;

    for (const referralReward of listReferralReward) {
      if (listCurrencyUpdate[`${referralReward.currencyId}`]) {
        listCurrencyUpdate[`${referralReward.currencyId}`].totalAmount =
          new BigNumber(
            listCurrencyUpdate[`${referralReward.currencyId}`].totalAmount,
          )
            .plus(new BigNumber(referralReward.totalAmount))
            .toString();
      } else {
        listCurrencyUpdate[`${referralReward.currencyId}`] = {
          totalAmount: referralReward.totalAmount,
          currency: referralReward.currency,
          chainId: referralReward.chainId,
          ownerId: user.id,
        };
      }
    }

    const listCurrencyId = Object.keys(listCurrencyUpdate);

    for (const currencyId of listCurrencyId) {
      promiseAll.push(
        this.upsertWalletFromReferralReward(
          listCurrencyUpdate[`${currencyId}`].chainId,
          listCurrencyUpdate[`${currencyId}`].ownerId,
          listCurrencyUpdate[`${currencyId}`].totalAmount,
          listCurrencyUpdate[`${currencyId}`].currency,
        ),
      );
    }

    promiseAll.push(
      this.referralRewardTransactionRepository.update(
        {
          status: ServiceFeeTransactionStatus.SUCCESS,
          rewardOwnerId: user.id,
        },
        {
          status: ServiceFeeTransactionStatus.IS_WITHDRAW,
        },
      ),
    );

    await Promise.all(promiseAll);

    return true;
  }

  @Transactional()
  async upsertWalletFromReferralReward(
    chainId: number,
    ownerId: Uuid,
    amount: string,
    currency: CurrencyEntity,
  ) {
    const walletExisted = await this.walletRepository.findOne({
      where: {
        ownerId,
        chainId,
        currencyId: currency.id,
      },
      select: {
        id: true,
        totalAmount: true,
      },
    });

    if (!walletExisted) {
      const wallet = this.walletRepository.create();
      wallet.totalAmount = amount;
      wallet.chainId = chainId;
      wallet.ownerId = ownerId;
      wallet.currency = currency;

      await this.walletRepository.save(wallet);
    } else {
      const updateTotalAmount = new BigNumber(walletExisted.totalAmount)
        .plus(new BigNumber(amount))
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
  }

  @Transactional()
  async updateTxIdForWithdraw(user: UserEntity, data: UpdateWithdrawDto) {
    const pendingWithdrawTransaction =
      await this.withdrawTransactionRepository.count({
        where: {
          id: data.id,
          userId: user.id,
          //status: WithdrawTransactionStatus.DRAFT,
        },
      });

    if (!pendingWithdrawTransaction) {
      throw new ApiError('Invalid data', 'E-1');
    }

    const result = await this.withdrawTransactionRepository.update(
      {
        id: data.id,
      },
      {
        status: WithdrawTransactionStatus.PENDING,
        txId: data.txId,
      },
    );
    const promiseAll = [] as Array<Promise<UpdateResult>>;
    const listWithdrawTransactionDetail =
      await this.withdrawTransactionDetailRepository.find({
        where: {
          withdrawTransactionId: data.id,
        },
        relations: ['wallet'],
        select: {
          id: true,
          amount: true,
          wallet: {
            id: true,
            totalAmount: true,
          },
        },
      });

    for (const withDrawDetail of listWithdrawTransactionDetail) {
      promiseAll.push(
        this.walletRepository.update(
          {
            id: withDrawDetail.wallet.id,
          },
          {
            totalAmount: new BigNumber(withDrawDetail.wallet.totalAmount)
              .minus(new BigNumber(withDrawDetail.amount))
              .toString(),
          },
        ),
      );
    }

    await Promise.all(promiseAll);

    return result.affected !== 0;
  }

  async rejectWithdraw(user: UserEntity, id: Uuid) {
    const pendingWithdrawTransaction =
      await this.withdrawTransactionRepository.count({
        where: {
          id,
          userId: user.id,
          status: WithdrawTransactionStatus.DRAFT,
        },
      });

    if (!pendingWithdrawTransaction) {
      throw new ApiError('Invalid data', 'E-1');
    }

    const result = await this.withdrawTransactionRepository.update(
      {
        id,
      },
      {
        status: WithdrawTransactionStatus.CANCEL,
      },
    );

    return result.affected !== 0;
  }

  async syncDataWithdraw() {
    const listPendingWithdraw = await this.withdrawTransactionRepository.find({
      where: {
        status: WithdrawTransactionStatus.PENDING,
        txId: Not(IsNull()),
      },
      select: {
        id: true,
        txId: true,
        userId: true,
        chainId: true,
      },
    });

    if (listPendingWithdraw.length === 0) {
      return true;
    }

    const promiseAll = [] as Array<Promise<UpdateResult>>;

    for (const withdrawTransaction of listPendingWithdraw) {
      const { id, txId, chainId } = withdrawTransaction;
      const web3Provider = Web3Util.getProvider(chainId);
      // eslint-disable-next-line no-await-in-loop
      const transaction = await web3Provider.eth.getTransactionReceipt(txId);
      let statusUpdate;

      if (transaction.status === true) {
        statusUpdate = WithdrawTransactionStatus.SUCCESS;
        promiseAll.push(
          this.serviceFeeTransactionRepository.update(
            {
              withdrawTransactionId: withdrawTransaction.id,
              status: ServiceFeeTransactionStatus.DRAFT,
            },
            {
              status: ServiceFeeTransactionStatus.SUCCESS,
            },
          ),
        );
        promiseAll.push(
          this.referralRewardTransactionRepository.update(
            {
              withdrawTransactionId: withdrawTransaction.id,
              status: ServiceFeeTransactionStatus.DRAFT,
            },
            {
              status: ServiceFeeTransactionStatus.SUCCESS,
            },
          ),
        );
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (transaction.status === false) {
        statusUpdate = PutOnSaleStatus.FAIL;
        const listWithdrawDetail =
          // eslint-disable-next-line no-await-in-loop
          await this.withdrawTransactionDetailRepository.find({
            where: {
              withdrawTransactionId: id,
            },
            relations: ['wallet'],
            select: {
              id: true,
              amount: true,
              wallet: {
                id: true,
                totalAmount: true,
              },
            },
          });

        promiseAll.push(
          this.serviceFeeTransactionRepository.update(
            {
              withdrawTransactionId: withdrawTransaction.id,
              status: ServiceFeeTransactionStatus.DRAFT,
            },
            {
              status: ServiceFeeTransactionStatus.FAIL,
            },
          ),
        );
        promiseAll.push(
          this.referralRewardTransactionRepository.update(
            {
              withdrawTransactionId: withdrawTransaction.id,
              status: ServiceFeeTransactionStatus.DRAFT,
            },
            {
              status: ServiceFeeTransactionStatus.FAIL,
            },
          ),
        );

        for (const withDrawDetail of listWithdrawDetail) {
          promiseAll.push(
            this.walletRepository.update(
              {
                id: withDrawDetail.wallet.id,
              },
              {
                totalAmount: new BigNumber(withDrawDetail.wallet.totalAmount)
                  .plus(new BigNumber(withDrawDetail.amount))
                  .toString(),
              },
            ),
          );
        }
      }

      promiseAll.push(
        this.withdrawTransactionRepository.update(
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

    return true;
  }
}
