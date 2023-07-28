import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { PaymentAccountNumberEntity } from '../entities/payment-account-number.entity';

export class PaymentAccountNumberDto extends AbstractDto {
  @ApiPropertyOptional()
  accountNumber: string;

  constructor(paymentAccountNumber: PaymentAccountNumberEntity) {
    super(paymentAccountNumber);
    this.accountNumber = paymentAccountNumber.accountNumber;
  }
}
