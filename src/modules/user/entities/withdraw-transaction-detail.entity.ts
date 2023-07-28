import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { WithdrawTransactionDetailDto } from '../dtos/withdraw-transaction-detail.dto';
import { WalletEntity } from './wallet.entity';
import { WithdrawTransactionEntity } from './withdraw-transaction.entity';

@Entity({ name: 'withdraw_transaction_detail' })
@UseDto(WithdrawTransactionDetailDto)
export class WithdrawTransactionDetailEntity extends AbstractEntity<WithdrawTransactionDetailDto> {
  @Column({ name: 'exchange_rate' })
  exchangeRate: string;

  @ManyToOne(
    () => CurrencyEntity,
    (currency) => currency.listWithdrawTransactionDetail,
  )
  @JoinColumn({ name: 'currency_id' })
  currency?: CurrencyEntity;

  @Column({ name: 'currency_id' })
  currencyId: Uuid;

  @Column({ name: 'amount' })
  amount: string;

  @ManyToOne(
    () => WalletEntity,
    (wallet) => wallet.listWithdrawTransactionDetail,
  )
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  @Column({ name: 'wallet_id', nullable: true })
  walletId: Uuid;

  @ManyToOne(
    () => WithdrawTransactionEntity,
    (withdrawTransaction) => withdrawTransaction.listWithdrawTransactionDetail,
  )
  @JoinColumn({ name: 'withdraw_transaction_id' })
  withdrawTransaction?: WithdrawTransactionEntity;

  @Column({ name: 'withdraw_transaction_id', nullable: true })
  withdrawTransactionId: Uuid;
}
