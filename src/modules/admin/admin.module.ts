import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoingeckoModule } from '../../@sdk/coingecko/coingecko.module';
import { AuthModule } from '../auth/auth.module';
import { CurrencyModule } from '../currency/currency.module';
import { CurrencyEntity } from '../currency/entities/currency.entity';
import { PurchaseEntity } from '../purchase/entities/purchase.entity';
import { PurchaseModule } from '../purchase/purchase.module';
import { PutOnSaleEntity } from '../put-on-sale/entities/put-on-sale.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';
import { ReferralProgramConfigEntity } from './entities/referral-program-config.entity';
import { ServiceFeeTransactionEntity } from './entities/service-fee-transaction.entity';
import { StoreBannerEntity } from './entities/store-banner.entity';
import { StoreConfigEntity } from './entities/store-config.entity';
import { StoreFeeEntity } from './entities/store-fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminEntity,
      UserEntity,
      CurrencyEntity,
      StoreFeeEntity,
      StoreConfigEntity,
      StoreBannerEntity,
      PurchaseEntity,
      PutOnSaleEntity,
      ReferralProgramConfigEntity,
      ServiceFeeTransactionEntity,
    ]),
    AuthModule,
    CurrencyModule,
    CoingeckoModule,
    PurchaseModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
