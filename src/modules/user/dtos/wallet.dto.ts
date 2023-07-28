import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { CurrencyDto } from '../../currency/dto/currency.dto';
import type { WalletEntity } from '../entities/wallet.entity';
import type { UserDto } from './user.dto';

export class WalletDto extends AbstractDto {
  totalAmount: string;

  chainId: number;

  owner: UserDto;

  ownerId: Uuid;

  currency: CurrencyDto;

  currencyId: Uuid;

  constructor(wallet: WalletEntity) {
    super(wallet);
    this.totalAmount = wallet.totalAmount;
    this.chainId = wallet.chainId;
    this.ownerId = wallet.ownerId;
    this.currencyId = wallet.currencyId;

    if (wallet.owner) {
      this.owner = wallet.owner.toDto();
    }

    if (wallet.currency) {
      this.currency = wallet.currency.toDto();
    }
  }
}
