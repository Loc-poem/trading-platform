import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { CurrencyDto } from '../../currency/dto/currency.dto';
import type { WithdrawTransactionDto } from '../../user/dtos/withdraw-transaction.dto';
import type { ServiceFeeTransactionEntity } from '../entities/service-fee-transaction.entity';
import type { ServiceFeeTransactionStatus } from '../enums/admin.enums';

export class ServiceFeeTransactionDto extends AbstractDto {
  totalAmount: string;

  chainId: number;

  currencyId: Uuid;

  currency: CurrencyDto;

  status: ServiceFeeTransactionStatus;

  withdrawTransaction: WithdrawTransactionDto;

  withdrawTransactionId: Uuid;

  constructor(serviceFeeTransaction: ServiceFeeTransactionEntity) {
    super(serviceFeeTransaction);
    this.totalAmount = serviceFeeTransaction.totalAmount;
    this.chainId = serviceFeeTransaction.chainId;
    this.currencyId = serviceFeeTransaction.currencyId;
    this.status = serviceFeeTransaction.status;
    this.withdrawTransactionId = serviceFeeTransaction.withdrawTransactionId;

    if (serviceFeeTransaction.currency) {
      this.currency = serviceFeeTransaction.currency.toDto();
    }

    if (serviceFeeTransaction.withdrawTransaction) {
      this.withdrawTransaction =
        serviceFeeTransaction.withdrawTransaction.toDto();
    }
  }
}
