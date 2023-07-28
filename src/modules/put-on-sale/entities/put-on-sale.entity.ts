import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { CurrencyEntity } from '../../currency/entities/currency.entity';
import { FiatCurrencyEntity } from '../../currency/entities/fiat-currency.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PutOnSaleDto } from '../dto/put-on-sale.dto';
import {
  PutOnSaleCancelReason,
  PutOnSaleStatus,
} from '../enums/put-on-sale.enum';

@Entity({ name: 'put_on_sale' })
@UseDto(PutOnSaleDto)
export class PutOnSaleEntity extends AbstractEntity<PutOnSaleDto> {
  @ManyToOne(() => UserEntity, (user) => user.listPutOnSale)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ name: 'user_id' })
  userId: Uuid;

  @Column({ name: 'tx_id', nullable: true })
  txId: string;

  @Column({ name: 'chain_id', type: 'int' })
  chainId: number;

  @Column({ name: 'amount', nullable: true })
  amount: string;

  @Column({ name: 'available_amount', nullable: true })
  availableAmount: string;

  @Column({ name: 'min_fiat_amount', nullable: true })
  minFiatAmount?: string;

  @Column({ name: 'max_fiat_amount', nullable: true })
  maxFiatAmount?: string;

  @Column({ name: 'from_wallet_address', nullable: true })
  fromWalletAddress?: string;

  @Column({
    name: 'status',
    enum: PutOnSaleStatus,
    default: PutOnSaleStatus.DRAFT,
  })
  status: PutOnSaleStatus;

  @Column({ name: 'signature_put_on_sale', nullable: true })
  signaturePutOnSale?: string;

  @ManyToMany(() => PaymentEntity, (payment) => payment.listPutOnSale, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'payment_accept_put_on_sale' })
  listPaymentAccept?: PaymentEntity[];

  @ManyToOne(
    () => CurrencyEntity,
    (currency) => currency.listPutOnSaleByCurrency,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'currency_id' })
  currency?: CurrencyEntity;

  @Column({ name: 'currency_id' })
  currencyId: Uuid;

  @ManyToOne(
    () => FiatCurrencyEntity,
    (fiatCurrency) => fiatCurrency.listPutOnSaleByFiatCurrency,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'fiat_currency_id' })
  fiatCurrency?: FiatCurrencyEntity;

  @Column({ name: 'fiat_currency_id' })
  fiatCurrencyId: Uuid;

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.putOnSale, {
    nullable: true,
  })
  listPurchase: PurchaseEntity[];

  @Column({
    name: 'cancel_reason',
    enum: PutOnSaleCancelReason,
    nullable: true,
  })
  cancelReason: PutOnSaleCancelReason;

  @Column({ name: 'signature_cancel', nullable: true })
  signatureCancel: string;

  @Column({ name: 'tx_id_cancel', nullable: true })
  txIdCancel: string;
}
