import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { ProfitDto } from '../dto/profit.dto';
import { ProfitType } from '../enums/admin.enums';

@Entity({ name: 'profit' })
@UseDto(ProfitDto)
export class ProfitEntity extends AbstractEntity<ProfitDto> {
  @Column({ name: 'total_amount', default: '0' })
  totalAmount: string;

  @Column({ name: 'chain_id', type: 'int' })
  chainId: number;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.listAdminWallet)
  @JoinColumn({ name: 'currency_id' })
  currency?: CurrencyEntity;

  @Column({ name: 'currency_id' })
  currencyId: Uuid;

  @Column({ name: 'type', enum: ProfitType, default: ProfitType.ServiceFee })
  type: ProfitType;
}
