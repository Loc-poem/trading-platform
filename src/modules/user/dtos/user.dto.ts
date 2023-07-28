import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { RoleType } from '../../../constants';
import type { PaymentDto } from '../../payment/dto/payment.dto';
import type { UserEntity } from '../entities/user.entity';
import { NationalityDto } from './nationality.dto';
import type { WalletDto } from './wallet.dto';

// TODO, remove this class and use constructor's second argument's type
export type UserDtoOptions = Partial<{ isActive: boolean }>;

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  firstName?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional({ enum: RoleType })
  role: RoleType;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  nationality: NationalityDto;

  @ApiPropertyOptional()
  netAmount: string;

  @ApiPropertyOptional()
  phoneCode: string;

  @ApiPropertyOptional()
  isVerified: boolean;

  @ApiPropertyOptional()
  isVerifiedPhoneNumber: boolean;

  @ApiPropertyOptional()
  listPayment: PaymentDto[];

  @ApiPropertyOptional()
  listWallet: WalletDto[];

  isActive: boolean;

  @ApiPropertyOptional()
  totalUserUseReferralCode: number;

  userName: string;

  referralCode: string;

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.email = user.email;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.phoneCode = user.phoneCode;
    this.referralCode = user.referralCode;

    if (user.nationality) {
      this.nationality = user.nationality.toDto();
    }

    if (user.listPayment) {
      this.listPayment = user.listPayment.map((payment) => payment.toDto());
    }

    if (user.listWallet) {
      this.listWallet = user.listWallet.map((wallet) => wallet.toDto());
    }

    this.netAmount = user.netAmount;
    this.isVerified = user.isVerified;
    this.isVerifiedPhoneNumber = user.isVerifiedPhoneNumber;
    this.isActive = user.isActive;
    this.totalUserUseReferralCode = user.totalUserUseReferralCode;
    this.userName = user.userName;
  }
}
