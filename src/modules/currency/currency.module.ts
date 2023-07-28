import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { CurrencyEntity } from './entities/currency.entity';
import { FiatCurrencyEntity } from './entities/fiat-currency.entity';
import { CurrencyTask } from './job/currency.task';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyEntity, FiatCurrencyEntity])],
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyTask],
  exports: [CurrencyService],
})
export class CurrencyModule {}
