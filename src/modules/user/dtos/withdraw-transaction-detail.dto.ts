import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { CurrencyDto } from '../../currency/dto/currency.dto';
import type { WithdrawTransactionDetailEntity } from '../entities/withdraw-transaction-detail.entity';
import type { WithdrawTransactionDto } from './withdraw-transaction.dto';

export class WithdrawTransactionDetailDto extends AbstractDto {
  exchangeRate: string;

  currency: CurrencyDto;

  currencyId: Uuid;

  amount: string;

  withdrawTransaction: WithdrawTransactionDto;

  withdrawTransactionId: Uuid;

  constructor(withdrawTransactionDetail: WithdrawTransactionDetailEntity) {
    super(withdrawTransactionDetail);
    this.exchangeRate = withdrawTransactionDetail.exchangeRate;

    if (withdrawTransactionDetail.currency) {
      this.currency = withdrawTransactionDetail.currency.toDto();
    }

    this.currencyId = withdrawTransactionDetail.currencyId;
    this.amount = withdrawTransactionDetail.amount;

    if (withdrawTransactionDetail.withdrawTransaction) {
      this.withdrawTransaction =
        withdrawTransactionDetail.withdrawTransaction.toDto();
    }

    this.withdrawTransactionId =
      withdrawTransactionDetail.withdrawTransactionId;
  }
}
