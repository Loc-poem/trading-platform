import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { CurrencyDto } from '../../currency/dto/currency.dto';
import type { FiatCurrencyDto } from '../../currency/dto/fiat-currency.dto';
import type { PaymentDto } from '../../payment/dto/payment.dto';
import type { UserDto } from '../../user/dtos/user.dto';
import type { PutOnSaleEntity } from '../entities/put-on-sale.entity';
import type { PutOnSaleStatus } from '../enums/put-on-sale.enum';

export class PutOnSaleDto extends AbstractDto {
  userId: Uuid;

  user: UserDto;

  txId: string;

  chainId: number;

  amount: string;

  fromWalletAddress: string;

  status: PutOnSaleStatus;

  signaturePutOnSale: string;

  listPaymentAccept: PaymentDto[];

  currencyId: Uuid;

  currency: CurrencyDto;

  fiatCurrencyId: Uuid;

  fiatCurrency: FiatCurrencyDto;

  availableAmount: string;

  constructor(putOnSale: PutOnSaleEntity) {
    super(putOnSale);
    this.userId = putOnSale.userId;

    if (putOnSale.user) {
      this.user = putOnSale.user.toDto();
    }

    this.txId = putOnSale.txId;
    this.chainId = putOnSale.chainId;
    this.amount = putOnSale.amount;

    if (putOnSale.fromWalletAddress) {
      this.fromWalletAddress = putOnSale.fromWalletAddress;
    }

    this.status = putOnSale.status;
    this.availableAmount = putOnSale.availableAmount;

    if (putOnSale.signaturePutOnSale) {
      this.signaturePutOnSale = putOnSale.signaturePutOnSale;
    }

    if (putOnSale.listPaymentAccept) {
      this.listPaymentAccept = putOnSale.listPaymentAccept.map((payment) =>
        payment.toDto(),
      );
    }

    this.currencyId = putOnSale.currencyId;
    this.fiatCurrencyId = putOnSale.fiatCurrencyId;

    if (putOnSale.currency) {
      this.currency = putOnSale.currency;
    }

    if (putOnSale.fiatCurrency) {
      this.fiatCurrency = putOnSale.fiatCurrency;
    }
  }
}
