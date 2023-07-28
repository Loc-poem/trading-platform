import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { CurrencyEntity } from '../entities/currency.entity';

export class CurrencyDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  key: string;

  @ApiPropertyOptional()
  iconUrl: string;

  @ApiPropertyOptional()
  exchangeRate: string;

  @ApiPropertyOptional()
  chainId: number;

  @ApiPropertyOptional()
  chainName: string;

  @ApiPropertyOptional()
  tokenId: string;

  @ApiPropertyOptional()
  decimal: number;

  @ApiPropertyOptional()
  isActive: boolean;

  constructor(currency: CurrencyEntity) {
    super(currency);
    this.name = currency.name;
    this.key = currency.key;
    this.iconUrl = currency.iconUrl;
    this.exchangeRate = currency.exchangeRate;
    this.chainId = currency.chainId;
    this.chainName = currency.chainName;
    this.tokenId = currency.tokenId;
    this.decimal = currency.decimal;
    this.isActive = currency.isActive;
  }
}
