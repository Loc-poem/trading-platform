import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { ServiceFeeTransactionStatus } from '../../admin/enums/admin.enums';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { ReferralRewardTransactionDto } from '../dtos/referral-reward-transaction.dto';
import { UserEntity } from './user.entity';
import { WithdrawTransactionEntity } from './withdraw-transaction.entity';

@Entity({ name: 'referral_reward_transaction ' })
@UseDto(ReferralRewardTransactionDto)
export class ReferralRewardTransactionEntity extends AbstractEntity<ReferralRewardTransactionDto> {
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

  @ManyToOne(() => UserEntity, (user) => user)
  @JoinColumn({ name: 'reward_owner_id' })
  rewardOwner: UserEntity;

  @Column({ name: 'reward_owner_id' })
  rewardOwnerId: Uuid;

  @ManyToOne(
    () => WithdrawTransactionEntity,
    (withdraw) => withdraw.listReferralRewardTransaction,
  )
  @JoinColumn({ name: 'withdraw_transaction_id' })
  withdrawTransaction?: WithdrawTransactionEntity;

  @Column({ name: 'withdraw_transaction_id' })
  withdrawTransactionId: Uuid;
}
