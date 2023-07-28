import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { PaymentDto } from '../../payment/dto/payment.dto';
import type { PutOnSaleDto } from '../../put-on-sale/dto/put-on-sale.dto';
import type { UserDto } from '../../user/dtos/user.dto';
import type { ProofTransferredMoneyEntity } from '../entities/proof-transferred-money.entity';
import type { PurchaseEntity } from '../entities/purchase.entity';

export class PurchaseDto extends AbstractDto {
  buyAmount: string;

  status: number;

  payment: PaymentDto;

  buyFiatAmount: string;

  exchangeRate: string;

  chainId: number;

  paymentId: Uuid;

  fiatExchangeRate: string;

  putOnSaleId: Uuid;

  putOnSale: PutOnSaleDto;

  buyer: UserDto;

  seller: UserDto;

  listProofTransferredMoney: ProofTransferredMoneyEntity[];

  constructor(purchase: PurchaseEntity) {
    super(purchase);
    this.buyAmount = purchase.buyAmount;
    this.status = purchase.status;
    this.buyFiatAmount = purchase.buyFiatAmount;
    this.exchangeRate = purchase.exchangeRate;
    this.paymentId = purchase.paymentId;
    this.chainId = purchase.chainId;
    this.exchangeRate = purchase.exchangeRate;
    this.putOnSaleId = purchase.putOnSaleId;
    this.fiatExchangeRate = purchase.fiatExchangeRate;

    if (purchase.buyer) {
      this.buyer = purchase.buyer.toDto();
    }

    if (purchase.seller) {
      this.seller = purchase.seller.toDto();
    }

    if (purchase.payment) {
      this.payment = purchase.payment.toDto();
    }

    if (purchase.putOnSale) {
      this.putOnSale = purchase.putOnSale.toDto();
    }

    if (purchase.listProofTransferredMoney) {
      this.listProofTransferredMoney = purchase.listProofTransferredMoney;
    }
  }
}
