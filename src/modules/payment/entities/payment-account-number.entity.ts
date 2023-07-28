import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { PaymentAccountNumberDto } from '../dto/payment-account-number.dto';
import { PaymentEntity } from './payment.entity';

@Entity({ name: 'payment_account_number' })
@UseDto(PaymentAccountNumberDto)
export class PaymentAccountNumberEntity extends AbstractEntity<PaymentAccountNumberDto> {
  @Column({ name: 'account_number' })
  accountNumber: string;

  @ManyToOne(
    () => PaymentEntity,
    (payment) => payment.listPaymentAccountNumber,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'payment_id' })
  payment: PaymentEntity;

  @Column({ name: 'payment_id' })
  paymentId: Uuid;
}
