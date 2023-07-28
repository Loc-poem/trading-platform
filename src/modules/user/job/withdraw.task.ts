import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { UserService } from '../user.service';

@Injectable()
export class WithdrawTask {
  constructor(private readonly userService: UserService) {}

  @Cron('*/30 * * * * *')
  getCurrencyExchangeRate() {
    this.userService
      .syncDataWithdraw()
      .then((res) => res)
      .catch((error) => error);
  }
}
