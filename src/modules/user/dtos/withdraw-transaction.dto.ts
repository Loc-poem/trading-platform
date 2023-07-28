import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { WithdrawTransactionEntity } from '../entities/withdraw-transaction.entity';
import type { UserDto } from './user.dto';
import type { WithdrawTransactionDetailDto } from './withdraw-transaction-detail.dto';

export class WithdrawTransactionDto extends AbstractDto {
  txId: string;

  user: UserDto;

  userId: Uuid;

  walletAddress: string;

  status: number;

  listWithdrawTransactionDetail: WithdrawTransactionDetailDto[];

  serviceFee: string;

  signatureWithdraw: string;

  chainId: number;

  constructor(withdrawTransaction: WithdrawTransactionEntity) {
    super(withdrawTransaction);
    this.txId = withdrawTransaction.txId;

    if (withdrawTransaction.user) {
      this.user = withdrawTransaction.user.toDto();
    }

    this.walletAddress = withdrawTransaction.walletAddress;
    this.status = withdrawTransaction.status;
    this.serviceFee = withdrawTransaction.serviceFee;
    this.signatureWithdraw = withdrawTransaction.signatureWithdraw;
    this.chainId = withdrawTransaction.chainId;

    if (withdrawTransaction.listWithdrawTransactionDetail) {
      this.listWithdrawTransactionDetail =
        withdrawTransaction.listWithdrawTransactionDetail.map(
          (withdrawTransactionDetail) => withdrawTransactionDetail.toDto(),
        );
    }
  }
}
