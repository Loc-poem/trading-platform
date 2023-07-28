import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { UserDto } from '../../user/dtos/user.dto';
import type { PaymentEntity } from '../entities/payment.entity';
import type { PaymentType } from '../enums/payment.enums';
import type { PaymentAccountNumberDto } from './payment-account-number.dto';

export class PaymentDto extends AbstractDto {
  name: string;

  type: PaymentType;

  user: UserDto;

  userId: Uuid;

  listPaymentAccountNumber: PaymentAccountNumberDto[];

  accountName: string;

  note: string;

  constructor(payment: PaymentEntity) {
    super(payment);
    this.name = payment.name;
    this.type = payment.type;
    this.userId = payment.userId;
    this.accountName = payment.accountName || '';
    this.note = payment.note;

    if (payment.user) {
      this.user = payment.user.toDto();
    }

    if (payment.listPaymentAccountNumber) {
      this.listPaymentAccountNumber = payment.listPaymentAccountNumber.map(
        (paymentAccountNumber) => paymentAccountNumber.toDto(),
      );
    }
  }
}
