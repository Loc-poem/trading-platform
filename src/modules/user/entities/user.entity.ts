import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import type { IAbstractEntity } from '../../../common/abstract.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { RoleType } from '../../../constants';
import { UseDto, VirtualColumn } from '../../../decorators';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { PutOnSaleEntity } from '../../put-on-sale/entities/put-on-sale.entity';
import type { UserDtoOptions } from '../dtos/user.dto';
import { UserDto } from '../dtos/user.dto';
import { NationalityEntity } from './nationality.entity';
import { ReferralProgramEntity } from './referral-program-level.entity';
import { ReferralRewardTransactionEntity } from './referral-reward-transaction.entity';
import { WalletEntity } from './wallet.entity';
import { WithdrawTransactionEntity } from './withdraw-transaction.entity';

export interface IUserEntity extends IAbstractEntity<UserDto> {
  firstName?: string;

  lastName?: string;

  role: RoleType;

  email?: string;

  password?: string;

  phone: string;

  avatar?: string;

  fullName?: string;

  nationalityId?: Uuid;

  otpCode?: string;

  isVerified: boolean;

  netAmount: string;

  isConsumedOtp?: boolean;

  referralCode?: string;

  sendOtpResetTime?: Date;

  isVerifiedPhoneNumber: boolean;
}

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity
  extends AbstractEntity<UserDto, UserDtoOptions>
  implements IUserEntity
{
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: true })
  avatar?: string;

  @VirtualColumn()
  fullName?: string;

  @ManyToOne(() => NationalityEntity, (nationality) => nationality.user, {
    nullable: true,
  })
  @JoinColumn({ name: 'nationality_id' })
  nationality?: NationalityEntity;

  @Column({
    name: 'nationality_id',
    nullable: true,
  })
  nationalityId: Uuid;

  @Column({
    name: 'otp_code',
    nullable: true,
  })
  otpCode: string;

  @Column({
    name: 'send_otp_time',
    nullable: true,
  })
  sentOtpTime: Date;

  @Column({ name: 'phone_code', nullable: true })
  phoneCode: string;

  @Column({
    name: 'is_verified',
    default: false,
  })
  isVerified: boolean;

  @Column({
    nullable: false,
    default: '0',
  })
  netAmount: string;

  @Column({ nullable: false, default: false })
  isConsumedOtp?: boolean;

  @Column({ nullable: true })
  referralCode: string;

  @Column({ nullable: true, default: '0' })
  referralUserAmount: string;

  @Column({ name: 'total_user_use_referral_code', type: 'int', default: 0 })
  totalUserUseReferralCode: number;

  @Column({ name: 'otp_reset_password', nullable: true })
  otpResetPassword?: string;

  @Column({ name: 'send_otp_reset_time', nullable: true })
  sendOtpResetTime?: Date;

  @Column({ name: 'is_verified_otp_reset', nullable: true })
  isVerifiedOtpReset: boolean;

  @Column({ name: 'total_verify_reset_otp', nullable: true, type: 'int' })
  totalVerifyResetOtp: number;

  @Column({ name: 'otp_verify_phone_number', nullable: true })
  otpVerifyPhoneNumber?: string;

  @Column({ name: 'send_otp_verify_phone_number_time', nullable: true })
  sendOtpVerifyPhoneNumberTime?: Date;

  @Column({ name: 'is_verified_phone_number', nullable: true, default: false })
  isVerifiedPhoneNumber: boolean;

  @Column({
    name: 'total_verify_phone_number_otp',
    nullable: true,
    type: 'int',
  })
  totalVerifyPhoneNumberOtp: number;

  @OneToMany(() => PaymentEntity, (payment) => payment.user, {
    nullable: true,
  })
  listPayment?: PaymentEntity[];

  @OneToMany(() => PutOnSaleEntity, (putOnSale) => putOnSale.user, {
    nullable: true,
  })
  listPutOnSale: PutOnSaleEntity[];

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.buyer, {
    nullable: true,
  })
  listBuyPurchase: PurchaseEntity[];

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.seller, {
    nullable: true,
  })
  listSellPurchase: PurchaseEntity[];

  @OneToMany(() => WalletEntity, (wallet) => wallet.owner, {
    nullable: true,
  })
  listWallet?: WalletEntity[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(
    () => WithdrawTransactionEntity,
    (withdrawTransaction) => withdrawTransaction.user,
    {
      nullable: true,
    },
  )
  listWithdrawTransaction: WithdrawTransactionEntity[];

  @Column({ name: 'reason_disabled', nullable: true })
  reasonDisabled: string;

  @Column({ name: 'user_name', nullable: true })
  userName: string;

  @OneToMany(
    () => ReferralProgramEntity,
    (referralProgram) => referralProgram.sourceUser,
    { nullable: true },
  )
  listReferralProgramOfUser: ReferralProgramEntity[];

  @OneToMany(
    () => ReferralProgramEntity,
    (referralProgram) => referralProgram.referralOwner,
    { nullable: true },
  )
  listReferralProgramOfOwner: ReferralProgramEntity[];

  @OneToMany(
    () => ReferralRewardTransactionEntity,
    (referralRewardTransaction) => referralRewardTransaction.rewardOwner,
    { nullable: true },
  )
  listReferralRewardTransaction: ReferralRewardTransactionEntity[];

  @Column({ name: 'otp_verify_change_password', nullable: true })
  otpVerifyChangePassword?: string;

  @Column({ name: 'send_otp_verify_change_password_time', nullable: true })
  sendOtpVerifyChangePasswordTime?: Date;

  @Column({
    name: 'total_verify_change_password_otp',
    nullable: true,
    type: 'int',
  })
  totalVerifyChangePasswordOtp: number;

  @Column({
    name: 'accept_change_password',
    default: false,
  })
  acceptChangePassword: boolean;
}
