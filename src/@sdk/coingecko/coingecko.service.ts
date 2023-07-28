import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import type { CurrencyEntity } from '../../modules/currency/entities/currency.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class CoingeckoService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly httpService: HttpService,
  ) {}

  // async getCurrencyExchangeRate(listCoin: CurrencyEntity[], chainId: number) {
  //     let platformId;
  //
  //     switch (chainId.toString()) {
  //       case this.configService.chainIdConfig.binanceChainId: {
  //         platformId = this.configService.coingeckoConfig.bscCoingeckoId;
  //         break;
  //       }
  //
  //       case this.configService.chainIdConfig.ethChainId: {
  //         platformId = this.configService.coingeckoConfig.ethCoingeckoId;
  //         break;
  //       }
  //
  //       case this.configService.chainIdConfig.polygonChainId: {
  //         platformId = this.configService.coingeckoConfig.polygonCoingeckoId;
  //         break;
  //       }
  //     }
  //
  //     let uri = this.configService.coingeckoConfig.currencyExchangeUri;
  //     uri = uri
  //       .replace('LISTTOKEN', listCoin.map((coin) => coin.tokenId).join(','))
  //       .replace('PLATFORMID', platformId);
  //
  //     const data = await this.httpService.get(uri);
  //
  //     // @ts-ignore
  //     return data.data;
  // }

  async getCurrencyExchangeRateDev(listCoin: CurrencyEntity[]) {
    let uri = this.configService.coingeckoConfig.currencyExchangeUriDev;
    uri = uri.replace('LISTCOIN', listCoin.map((coin) => coin.key).join(','));
    const data = await lastValueFrom(this.httpService.get(uri));

    return data.data;
  }
}
