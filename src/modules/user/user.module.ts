import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfitEntity } from '../admin/entities/profit.entity';
import { ReferralProgramConfigEntity } from '../admin/entities/referral-program-config.entity';
import { ServiceFeeTransactionEntity } from '../admin/entities/service-fee-transaction.entity';
import { StoreFeeEntity } from '../admin/entities/store-fee.entity';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { NationalityEntity } from './entities/nationality.entity';
import { ReferralProgramEntity } from './entities/referral-program-level.entity';
import { ReferralRewardTransactionEntity } from './entities/referral-reward-transaction.entity';
import { UserEntity } from './entities/user.entity';
import { WalletEntity } from './entities/wallet.entity';
import { WithdrawTransactionEntity } from './entities/withdraw-transaction.entity';
import { WithdrawTransactionDetailEntity } from './entities/withdraw-transaction-detail.entity';
import { WithdrawTask } from './job/withdraw.task';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      NationalityEntity,
      WalletEntity,
      StoreFeeEntity,
      WithdrawTransactionEntity,
      WithdrawTransactionDetailEntity,
      ReferralProgramEntity,
      ProfitEntity,
      CurrencyEntity,
      ReferralProgramConfigEntity,
      ServiceFeeTransactionEntity,
      ReferralRewardTransactionEntity,
    ]),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, WithdrawTask],
})
export class UserModule {}
