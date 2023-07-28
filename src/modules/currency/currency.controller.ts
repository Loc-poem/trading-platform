import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrencyService } from './currency.service';
import { CurrencyPageOptionDto } from './dto/currency-page-option.dto';
import { FiatCurrencyPageOptionDto } from './dto/fiat-currency-page-option.dto';

@Controller('currency')
@ApiTags('Currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list currency of store' })
  getListCurrencies(@Query() filter: CurrencyPageOptionDto) {
    return this.currencyService.getListCurrencies(filter);
  }

  @Get('fiat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'get list fiat currencies of store ' })
  getListFiatCurrencies(@Query() filter: FiatCurrencyPageOptionDto) {
    return this.currencyService.getListFiatCurrencies(filter);
  }
}
