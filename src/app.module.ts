import './boilerplate.polyfill';

import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { CoingeckoModule } from './@sdk/coingecko/coingecko.module';
import { SendgridModule } from './@sdk/sendgrid/sendgrid.module';
import { SmtpMailModule } from './@sdk/smtp-mail/smtp-mail.module';
import { VonageModule } from './@sdk/vonage/vonage.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContractModule } from './modules/contract/contract.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { LookupTableModule } from './modules/lookup-table/lookup-table.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PostModule } from './modules/post/post.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { PutOnSaleModule } from './modules/put-on-sale/put-on-sale.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    HealthCheckerModule,
    LookupTableModule,
    CurrencyModule,
    ScheduleModule.forRoot(),
    PaymentModule,
    PutOnSaleModule,
    SendgridModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src/assets'),
    }),
    PutOnSaleModule,
    VonageModule,
    PurchaseModule,
    CoingeckoModule,
    SendgridModule,
    SmtpMailModule,
    AdminModule,
    PostModule,
    ContractModule,
    BullModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        redis: configService.redisConfig,
      }),
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
  ],
  providers: [],
})
export class AppModule {}
