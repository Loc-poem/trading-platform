import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { ServiceFeeTransactionPageOptionDto } from '../admin/dto/service-fee-transaction-page-option.dto';
import { UpdateAccountInformationDto } from './dtos/update-account-information.dto';
import { UpdateWithdrawDto } from './dtos/update-withdraw.dto';
import { VerifyChangePasswordOtpDto } from './dtos/verify-change-password-otp.dto';
import { WalletPageOptionDto } from './dtos/wallet-page-option.dto';
import { WithdrawTokenDto } from './dtos/withdraw-token.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-password-otp')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  sendOtpCodeChangePassword(@AuthUser() user: UserEntity) {
    return this.userService.sendOtpCodeChangePassword(user);
  }

  @Put('verify-otp-code-change-password')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  verifyOtpCodeChangePassword(
    @AuthUser() user: UserEntity,
    @Body() data: VerifyChangePasswordOtpDto,
  ) {
    return this.userService.verifyOtpCodeChangePassword(user, data);
  }

  @Put('account-information')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  updateAccountInformation(
    @AuthUser() user: UserEntity,
    @Body() data: UpdateAccountInformationDto,
  ) {
    return this.userService.updateAccountInformation(user, data);
  }

  @Get('wallet')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list token of user wallet' })
  getWalletOfUser(
    @AuthUser() user: UserEntity,
    @Query() filter: WalletPageOptionDto,
  ) {
    return this.userService.getWalletOfUser(user, filter);
  }

  @Get('referral-reward')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list referral reward transaction' })
  getListReferralRewardTransaction(
    @AuthUser() user: UserEntity,
    @Query() filter: ServiceFeeTransactionPageOptionDto,
  ) {
    return this.userService.getListReferralRewardTransaction(user, filter);
  }

  @Post('withdraw')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'withdraw token of user' })
  withdrawToken(@AuthUser() user: UserEntity, @Body() data: WithdrawTokenDto) {
    return this.userService.withDrawToken(user, data);
  }

  @Post('withdraw-referral-reward')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'withdraw referral reward of user' })
  withdrawReferralRewardToken(@AuthUser() user: UserEntity) {
    return this.userService.withdrawReferralRewardToken(user);
  }

  @Put('txId-withdraw')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'update tx id for withdraw token request of user' })
  updateTxIdForWithdraw(
    @AuthUser() user: UserEntity,
    @Body() data: UpdateWithdrawDto,
  ) {
    return this.userService.updateTxIdForWithdraw(user, data);
  }

  @Put('reject-withdraw/:id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'reject withdraw token request of user' })
  rejectWithdraw(@AuthUser() user: UserEntity, @Param('id') id: Uuid) {
    return this.userService.rejectWithdraw(user, id);
  }
}
