import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import type { UpdateResult } from 'typeorm';
import { Repository } from 'typeorm';

import { CoingeckoService } from '../../@sdk/coingecko/coingecko.service';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { ApiError } from '../../common/response/api-error';
import { convertStringToBoolean } from '../../common/utils';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { CurrencyPageOptionDto } from './dto/currency-page-option.dto';
import type { FiatCurrencyPageOptionDto } from './dto/fiat-currency-page-option.dto';
import type { QueryCurrencyDto } from './dto/query-currency.dto';
import { CurrencyEntity } from './entities/currency.entity';
import { FiatCurrencyEntity } from './entities/fiat-currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
    @InjectRepository(FiatCurrencyEntity)
    private readonly fiatCurrencyRepository: Repository<FiatCurrencyEntity>,
    private readonly coingeckoService: CoingeckoService,
    private readonly configService: ApiConfigService,
  ) {}

  async getListCurrencies(filter: CurrencyPageOptionDto) {
    const where = {} as QueryCurrencyDto;

    if (filter.chainId) {
      where.chainId = filter.chainId;
    }

    if (filter.isActive) {
      where.isActive = convertStringToBoolean(filter.isActive);
    }

    const [listCurrency, total] = await this.currencyRepository.findAndCount({
      where,
      select: [
        'id',
        'name',
        'key',
        'iconUrl',
        'exchangeRate',
        'chainId',
        'chainName',
        'tokenId',
        'decimal',
        'isActive',
      ],
      order: {
        name: filter.order,
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: filter,
      itemCount: total,
    });

    return listCurrency.toPageDto(pageMetaDto);
  }

  async syncCryptoExchangeRate() {
    const listCoin = await this.currencyRepository.find({
      select: ['id', 'name', 'key', 'tokenId'],
    });

    if (listCoin.length > 0) {
      const data = await this.coingeckoService.getCurrencyExchangeRateDev(
        listCoin,
      );
      const promiseAll = [] as Array<Promise<UpdateResult>>;

      for (const coin of Object.keys(data)) {
        const rate = data[coin].usd;
        promiseAll.push(
          this.currencyRepository.update(
            {
              key: coin,
            },
            {
              exchangeRate: rate,
            },
          ),
        );
      }

      await Promise.all(promiseAll);
    }
  }

  async syncFiatCurrencyExchangeRate() {
    const listFiat = await this.fiatCurrencyRepository.find({
      select: ['id', 'code'],
    });
    let uri = this.configService.apiLayerConfig.apiGetExchangeRateUri;
    uri = uri.replace(
      'LIST_FIAT_CURRENCY',
      listFiat.map((coin) => coin.code).join(','),
    );

    try {
      const data = await axios.get(uri);
      const listRates = data.data.rates;

      const promiseAll = [] as Array<Promise<UpdateResult>>;

      for (const fiatCurrencyCode of Object.keys(listRates)) {
        promiseAll.push(
          this.fiatCurrencyRepository.update(
            {
              code: fiatCurrencyCode,
            },
            {
              exchangeRate: listRates[fiatCurrencyCode],
            },
          ),
        );
      }

      await Promise.all(promiseAll);
    } catch (e) {
      throw new ApiError(`error when get fiat currencies exchange ${e}`, 'E13');
    }
  }

  async getListFiatCurrencies(filter: FiatCurrencyPageOptionDto) {
    const { search } = filter;
    const queryBuilder =
      this.fiatCurrencyRepository.createQueryBuilder('fiatCurrencies');

    if (search) {
      queryBuilder.where(`LOWER(fiatCurrencies.code) LIKE LOWER(:searching)`, {
        searching: `%${search}%`,
      });
    }

    queryBuilder.select([
      'fiatCurrencies.code',
      'fiatCurrencies.id',
      'fiatCurrencies.name',
      'fiatCurrencies.exchangeRate',
      'fiatCurrencies.symbol',
      'fiatCurrencies.createdAt',
    ]);

    queryBuilder.orderBy('fiatCurrencies.name', filter.order);

    const [listFiatCurrencies, pageMetaDto] = await queryBuilder.paginate(
      filter,
    );

    return listFiatCurrencies.toPageDto(pageMetaDto);
  }
}
