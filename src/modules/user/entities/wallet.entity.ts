import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { WalletDto } from '../dtos/wallet.dto';
import { UserEntity } from './user.entity';
import { WithdrawTransactionDetailEntity } from './withdraw-transaction-detail.entity';

@Entity({ name: 'wallet' })
@UseDto(WalletDto)
export class WalletEntity extends AbstractEntity<WalletDto> {
  @Column({ name: 'total_amount', default: '0' })
  totalAmount: string;

  @Column({ name: 'chain_id', type: 'int' })
  chainId: number;

  @ManyToOne(() => UserEntity, (user) => user.listWallet)
  @JoinColumn({ name: 'owner_id' })
  owner?: UserEntity;

  @Column({ name: 'owner_id' })
  ownerId: Uuid;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.listWallet)
  @JoinColumn({ name: 'currency_id' })
  currency?: CurrencyEntity;

  @Column({ name: 'currency_id' })
  currencyId: Uuid;

  @OneToMany(
    () => WithdrawTransactionDetailEntity,
    (withdrawTransactionDetail) => withdrawTransactionDetail.wallet,
    {
      nullable: true,
    },
  )
  listWithdrawTransactionDetail: WithdrawTransactionDetailEntity[];
}
