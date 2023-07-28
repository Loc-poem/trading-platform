import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { PutOnSaleEntity } from '../../put-on-sale/entities/put-on-sale.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentType } from '../enums/payment.enums';
import { PaymentAccountNumberEntity } from './payment-account-number.entity';

@Entity({ name: 'payment' })
@UseDto(PaymentDto)
export class PaymentEntity extends AbstractEntity<PaymentDto> {
  @OneToMany(
    () => PaymentAccountNumberEntity,
    (paymentAccountNumber) => paymentAccountNumber.payment,
    {
      nullable: true,
    },
  )
  listPaymentAccountNumber?: PaymentAccountNumberEntity[];

  @Column({
    name: 'name',
  })
  name: string;

  @Column({ name: 'note', length: 2000, nullable: true })
  note: string;

  @Column({
    name: 'account_name',
    nullable: true,
  })
  accountName?: string;

  @Column({
    name: 'type',
    enum: PaymentType,
    default: PaymentType.BANK_TRANSFER,
  })
  type: PaymentType;

  @ManyToOne(() => UserEntity, (user) => user.listPayment)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ name: 'user_id' })
  userId: Uuid;

  @ManyToMany(
    () => PutOnSaleEntity,
    (putOnSale) => putOnSale.listPaymentAccept,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  listPutOnSale: PutOnSaleEntity[];
}
