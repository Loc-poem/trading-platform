import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ServiceFeeTransactionStatus } from '../../admin/enums/admin.enums';
import type { CurrencyDto } from '../../currency/dto/currency.dto';
import type { ReferralRewardTransactionEntity } from '../entities/referral-reward-transaction.entity';
import type { WithdrawTransactionDto } from './withdraw-transaction.dto';

export class ReferralRewardTransactionDto extends AbstractDto {
  totalAmount: string;

  chainId: number;

  currencyId: Uuid;

  currency: CurrencyDto;

  status: ServiceFeeTransactionStatus;

  withdrawTransaction: WithdrawTransactionDto;

  withdrawTransactionId: Uuid;

  constructor(referralRewardTransaction: ReferralRewardTransactionEntity) {
    super(referralRewardTransaction);
    this.totalAmount = referralRewardTransaction.totalAmount;
    this.chainId = referralRewardTransaction.chainId;
    this.currencyId = referralRewardTransaction.currencyId;
    this.status = referralRewardTransaction.status;
    this.withdrawTransactionId =
      referralRewardTransaction.withdrawTransactionId;

    if (referralRewardTransaction.currency) {
      this.currency = referralRewardTransaction.currency.toDto();
    }

    if (referralRewardTransaction.withdrawTransaction) {
      this.withdrawTransaction =
        referralRewardTransaction.withdrawTransaction.toDto();
    }
  }
}
