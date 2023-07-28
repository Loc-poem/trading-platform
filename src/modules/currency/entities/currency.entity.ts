import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { ServiceFeeTransactionEntity } from '../../admin/entities/service-fee-transaction.entity';
import { PutOnSaleEntity } from '../../put-on-sale/entities/put-on-sale.entity';
import { WalletEntity } from '../../user/entities/wallet.entity';
import { WithdrawTransactionDetailEntity } from '../../user/entities/withdraw-transaction-detail.entity';
import { CurrencyDto } from '../dto/currency.dto';

@Entity({ name: 'currency' })
@UseDto(CurrencyDto)
export class CurrencyEntity extends AbstractEntity<CurrencyDto> {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'key' })
  key: string;

  @Column({ name: 'icon_url' })
  iconUrl: string;

  @Column({ name: 'exchange_rate', nullable: true })
  exchangeRate: string;

  @Column({ name: 'chain_id', type: 'int' })
  chainId: number;

  @Column({ name: 'chain_name' })
  chainName: string;

  @Column({ name: 'token_id' })
  tokenId: string;

  @Column({ name: 'decimal', type: 'int' })
  decimal: number;

  @OneToMany(() => PutOnSaleEntity, (putOnSale) => putOnSale.currency, {
    nullable: true,
  })
  listPutOnSaleByCurrency: PutOnSaleEntity[];

  @OneToMany(() => WalletEntity, (wallet) => wallet.currency, {
    nullable: true,
  })
  listWallet: WalletEntity[];

  @OneToMany(
    () => ServiceFeeTransactionEntity,
    (adminWallet) => adminWallet.currency,
    {
      nullable: true,
    },
  )
  listAdminWallet: ServiceFeeTransactionEntity[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(
    () => WithdrawTransactionDetailEntity,
    (withdrawTransactionDetail) => withdrawTransactionDetail.currency,
    {
      nullable: true,
    },
  )
  listWithdrawTransactionDetail: WithdrawTransactionDetailEntity[];
}
