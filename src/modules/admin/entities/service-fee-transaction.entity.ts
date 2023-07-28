import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { WithdrawTransactionEntity } from '../../user/entities/withdraw-transaction.entity';
import { ServiceFeeTransactionDto } from '../dto/service-fee-transaction.dto';
import { ServiceFeeTransactionStatus } from '../enums/admin.enums';

@Entity({ name: 'service_fee_transaction ' })
@UseDto(ServiceFeeTransactionDto)
export class ServiceFeeTransactionEntity extends AbstractEntity<ServiceFeeTransactionDto> {
  @Column({ name: 'total_amount', default: '0' })
  totalAmount: string;

  @Column({ name: 'chain_id', type: 'int' })
  chainId: number;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.listAdminWallet)
  @JoinColumn({ name: 'currency_id' })
  currency?: CurrencyEntity;

  @Column({ name: 'currency_id' })
  currencyId: Uuid;

  @Column({
    name: 'status',
    enum: ServiceFeeTransactionStatus,
    default: ServiceFeeTransactionStatus.DRAFT,
  })
  status: ServiceFeeTransactionStatus;

  @ManyToOne(
    () => WithdrawTransactionEntity,
    (withdraw) => withdraw.listServiceFeeTransaction,
  )
  @JoinColumn({ name: 'withdraw_transaction_id' })
  withdrawTransaction?: WithdrawTransactionEntity;

  @Column({ name: 'withdraw_transaction_id', nullable: true })
  withdrawTransactionId: Uuid;
}
