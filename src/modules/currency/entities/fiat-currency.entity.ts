import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { PutOnSaleEntity } from '../../put-on-sale/entities/put-on-sale.entity';
import { FiatCurrencyDto } from '../dto/fiat-currency.dto';

@Entity({ name: 'fiat_currency' })
@UseDto(FiatCurrencyDto)
export class FiatCurrencyEntity extends AbstractEntity<FiatCurrencyDto> {
  @Column({
    name: 'code',
  })
  code: string;

  @Column({
    name: 'name',
  })
  name: string;

  @Column({
    name: 'symbol',
  })
  symbol: string;

  @Column({ type: 'int' })
  precision: number;

  @Column({ name: 'exchange_rate', nullable: true })
  exchangeRate: string;

  @OneToMany(() => PutOnSaleEntity, (putOnSale) => putOnSale.fiatCurrency, {
    nullable: true,
  })
  listPutOnSaleByFiatCurrency: PutOnSaleEntity[];
}
