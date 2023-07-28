import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

import { AdminSubscribers } from '../../entity-subscribers/admin-subscribers';
import { UserSubscriber } from '../../entity-subscribers/user-subscriber';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get postgresConfig(): TypeOrmModuleOptions {
    let entities = [
      __dirname + '/../../modules/**/*.entity{.ts,.js}',
      __dirname + '/../../modules/**/*.view-entity{.ts,.js}',
    ];
    let migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    if (module.hot) {
      const entityContext = require.context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext<Record<string, unknown>>(id);
        const [entity] = Object.values(entityModule);

        return entity as string;
      });
      const migrationContext = require.context(
        './../../database/migrations',
        false,
        /\.ts$/,
      );

      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext<Record<string, unknown>>(id);
        const [migration] = Object.values(migrationModule);

        return migration as string;
      });
    }

    return {
      entities,
      migrations,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [UserSubscriber, AdminSubscribers],
      migrationsRun: false,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
      apiDomain: this.getString('API_DOMAIN'),
      domain: this.getString('APP_DOMAIN'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get vonageConfig() {
    return {
      apiKey: this.getString('VONAGE_API_KEY'),
      privateKey: this.getString('VONAGE_API_SECRET'),
      brandName: this.getString('VONAGE_BRAND_NAME'),
    };
  }

  get coingeckoConfig() {
    return {
      currencyExchangeUri: this.getString('CURRENCY_RATE_API'),
      currencyExchangeUriDev: this.getString('CURRENCY_RATE_API_DEV'),
      bscCoingeckoId: this.getString('BSC_ID_COINGECKO'),
      ethCoingeckoId: this.getString('ETH_ID_COINGECKO'),
      polygonCoingeckoId: this.getString('PO_ID_COINGECKO'),
    };
  }

  get apiLayerConfig() {
    return {
      apiGetExchangeRateUri: this.getString('FIAT_EXCHANGE_RATE_URI'),
    };
  }

  get chainIdConfig() {
    return {
      binanceChainId: this.getString('BSC_CHAIN_ID'),
      binanceProvider: this.getString('BSC_PROVIDER'),
      ethChainId: this.getString('ETH_CHAIN_ID'),
      ethProvider: this.getString('ETH_PROVIDER'),
      polygonChainId: this.getString('PO_CHAIN_ID'),
      poProvider: this.getString('PO_PROVIDER'),
      cvcChainId: this.getString('CVC_CHAIN_ID'),
      cvcProvider: this.getString('CVC_PROVIDER'),
    };
  }

  get sendGridConfig() {
    return {
      apiKey: this.getString('SENDGRID_TOKEN'),
      senderEmail: this.getString('SENDGRID_SENDER_EMAIL'),
      otpEmailTemplate: this.getString('SENDGRID_OTP_TEMPLATE_ID'),
    };
  }

  get adminWalletConfig() {
    return {
      adminWalletAddress: this.getString('ADMIN_WALLET_ADDRESS'),
      adminWalletPrivateKey: this.getString('ADMIN_WALLET_PRIVATE_KEY'),
      adminContractAddress: this.getString('ADMIN_CONTRACT_ADDRESS'),
    };
  }

  get redisConfig() {
    return {
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
    };
  }

  get smtpMailServerConfig() {
    return {
      smtpHost: this.getString('SMTP_HOST'),
      smtpPort: this.getString('SMTP_PORT'),
      smtpUser: this.getString('SMTP_USER'),
      smtpPassword: this.getString('SMTP_PASSWORD'),
      senderEmail: this.getString('SMTP_SENDER_EMAIL'),
    };
  }
}
