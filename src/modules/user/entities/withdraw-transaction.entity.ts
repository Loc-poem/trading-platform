import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { ServiceFeeTransactionEntity } from '../../admin/entities/service-fee-transaction.entity';
import { WithdrawTransactionDto } from '../dtos/withdraw-transaction.dto';
import { WithdrawTransactionStatus } from '../enums/user.enums';
import { ReferralRewardTransactionEntity } from './referral-reward-transaction.entity';
import { UserEntity } from './user.entity';
import { WithdrawTransactionDetailEntity } from './withdraw-transaction-detail.entity';

@Entity({ name: 'withdraw_transaction' })
@UseDto(WithdrawTransactionDto)
export class WithdrawTransactionEntity extends AbstractEntity<WithdrawTransactionDto> {
  @Column({ name: 'tx_id', nullable: true })
  txId: string;

  @ManyToOne(() => UserEntity, (user) => user.listWithdrawTransaction)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ name: 'user_id' })
  userId: Uuid;

  @Column({ name: 'wallet_address' })
  walletAddress: string;

  @Column({
    name: 'status',
    enum: WithdrawTransactionStatus,
    default: WithdrawTransactionStatus.DRAFT,
  })
  status: WithdrawTransactionStatus;

  @Column({ name: 'service_fee' })
  serviceFee: string;

  @Column({ name: 'signature_withdraw', nullable: true })
  signatureWithdraw: string;

  @Column({ name: 'chain_id', nullable: true })
  chainId: number;

  @OneToMany(
    () => WithdrawTransactionDetailEntity,
    (withdrawTransactionDetail) =>
      withdrawTransactionDetail.withdrawTransaction,
    {
      nullable: true,
    },
  )
  listWithdrawTransactionDetail?: WithdrawTransactionDetailEntity[];

  @OneToMany(
    () => ServiceFeeTransactionEntity,
    (serviceFeeTransaction) => serviceFeeTransaction.withdrawTransaction,
    { nullable: true },
  )
  listServiceFeeTransaction: ServiceFeeTransactionEntity[];

  @OneToMany(
    () => ReferralRewardTransactionEntity,
    (referralRewardTransaction) =>
      referralRewardTransaction.withdrawTransaction,
    { nullable: true },
  )
  listReferralRewardTransaction: ReferralRewardTransactionEntity[];
}
