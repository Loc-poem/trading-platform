import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { PutOnSaleEntity } from '../../put-on-sale/entities/put-on-sale.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PurchaseDto } from '../dto/purchase.dto';
import { PurchaseStatus } from '../enums/purchase.enum';
import { ProofTransferredMoneyEntity } from './proof-transferred-money.entity';

@Entity({ name: 'purchase' })
@UseDto(PurchaseDto)
export class PurchaseEntity extends AbstractEntity<PurchaseDto> {
  @Column({ name: 'buy_amount' })
  buyAmount: string;

  @Column({
    name: 'status',
    enum: PurchaseStatus,
    default: PurchaseStatus.DRAFT,
  })
  status: number;

  @Column({ name: 'chain_id', type: 'int' })
  chainId: number;

  @Column({ name: 'currency_id', nullable: true })
  currencyId: Uuid;

  @Column({ name: 'fiat_currency_id', nullable: true })
  fiatCurrencyId: Uuid;

  @ManyToOne(() => PaymentEntity, (payment) => payment)
  @JoinColumn({ name: 'payment_id' })
  payment?: PaymentEntity;

  @Column({ name: 'buy_fiat_amount' })
  buyFiatAmount: string;

  @Column({ name: 'exchange_rate' })
  exchangeRate: string;

  @Column({ name: 'fiat_exchange_rate' })
  fiatExchangeRate: string;

  @Column({ name: 'payment_id', nullable: true })
  paymentId: Uuid;

  @ManyToOne(() => PutOnSaleEntity, (putOnSale) => putOnSale.listPurchase, {
    nullable: true,
  })
  @JoinColumn({ name: 'put_on_sale_id' })
  putOnSale?: PutOnSaleEntity;

  @Column({ name: 'put_on_sale_id' })
  putOnSaleId: Uuid;

  @Column({ name: 'otp', nullable: true })
  otp?: string;

  @Column({ name: 'send_otp_time', nullable: true })
  sendOtpTime?: Date;

  @Column({ name: 'total_verify_otp', nullable: true, type: 'int' })
  totalVerifyOtp: number;

  @ManyToOne(() => UserEntity, (user) => user.listBuyPurchase, {
    nullable: true,
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer?: UserEntity;

  @Column({ name: 'buyer_id' })
  buyerId: Uuid;

  @Column({ name: 'confirm_otp_time', nullable: true })
  confirmOtpTime: Date;

  @ManyToOne(() => UserEntity, (user) => user.listSellPurchase, {
    nullable: true,
  })
  @JoinColumn({ name: 'seller_id' })
  seller?: UserEntity;

  @Column({ name: 'seller_id', nullable: true })
  sellerId: Uuid;

  @Column({ name: 'current_job_id', nullable: true })
  currentJobId: string;

  @OneToMany(
    () => ProofTransferredMoneyEntity,
    (proofTransferredMoney) => proofTransferredMoney.purchase,
    {
      nullable: true,
    },
  )
  listProofTransferredMoney?: ProofTransferredMoneyEntity[];
}
