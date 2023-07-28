import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import type { CurrencyEntity } from '../../modules/currency/entities/currency.entity';
import type { PutOnSaleEntity } from '../../modules/put-on-sale/entities/put-on-sale.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ApiError } from '../response/api-error';
import { convertStringToHex } from '../utils';

const apiConfigService = new ApiConfigService(new ConfigService());

export class Web3Util {
  public static signDataPutOnSale(
    dataPutOnSale: PutOnSaleEntity,
    currency: CurrencyEntity,
  ) {
    const rpc = this.getRpc(dataPutOnSale.chainId);
    const web3 = new Web3(rpc);
    const amount = new BigNumber(dataPutOnSale.amount);
    const decimal = new BigNumber(Math.pow(10, currency.decimal));
    const amountDecimal = amount.multipliedBy(decimal).toString();
    const idHex = convertStringToHex(dataPutOnSale.id);
    const data = web3.utils.soliditySha3(
      { type: 'address', value: dataPutOnSale.fromWalletAddress || '' },
      {
        type: 'address',
        value: apiConfigService.adminWalletConfig.adminContractAddress,
      },
      { type: 'address', value: currency.tokenId },
      {
        type: 'uint256',
        value: amountDecimal,
      },
      { type: 'bytes', value: idHex },
    );

    if (!data) {
      throw new ApiError('Invalid signature', 'E-1');
    }

    const decrypt = apiConfigService.adminWalletConfig.adminWalletPrivateKey;
    const signature = web3.eth.accounts.sign(data, decrypt);

    return signature.signature || '';
  }

  public static signDataCancelPutOnSale(params: {
    toAddress: string;
    tokenId: string;
    amount: string;
    nonce;
    userId: string;
    id: string;
    chainId: number;
    decimal: number;
  }) {
    // struct CancelOrder {
    //   address from;
    //   address to;
    //   address token;
    //   uint256 amount;
    //   uint256 nonce;
    //   bytes userId;
    //   bytes _id;
    // }

    const rpc = this.getRpc(params.chainId);
    const web3 = new Web3(rpc);
    const idHex = convertStringToHex(params.id);
    const userIdHex = convertStringToHex(params.userId);
    const amount = new BigNumber(params.amount);
    const decimal = new BigNumber(Math.pow(10, params.decimal));
    const amountDecimal = amount.multipliedBy(decimal).toString();

    const data = web3.utils.soliditySha3(
      {
        type: 'address',
        value: apiConfigService.adminWalletConfig.adminContractAddress,
      },
      { type: 'address', value: params.toAddress },
      { type: 'address', value: params.tokenId },
      { type: 'uint256', value: amountDecimal },
      { type: 'uint256', value: params.nonce },
      { type: 'bytes', value: userIdHex },
      { type: 'bytes', value: idHex },
    );

    if (!data) {
      throw new ApiError('Invalid signature', 'E-1');
    }

    const decrypt = apiConfigService.adminWalletConfig.adminWalletPrivateKey;
    const signature = web3.eth.accounts.sign(data, decrypt);

    return {
      dataSign: {
        from: apiConfigService.adminWalletConfig.adminContractAddress,
        to: params.toAddress,
        token: params.tokenId,
        amount: amountDecimal,
        nonce: params.nonce,
        userId: userIdHex,
        _id: idHex,
        id: params.id,
      },
      signature: signature.signature || '',
    };
  }

  public static signDataWithdraw(params: {
    toAddress: string;
    nonce;
    tokenIds;
    amountsDecimal;
    amounts: number[];
    userId: string;
    id: string;
    chainId: number;
    decimal: number[];
    serviceFeeAmount;
  }) {
    // struct Withdraw {
    //   address from;
    //   address to;
    //   uint256 nonce;
    //   address[] tokens;
    //   uint256[] amounts;
    //   bytes userId;
    //   bytes _id;
    // }
    const rpc = this.getRpc(params.chainId);
    const web3 = new Web3(rpc);
    const idHex = convertStringToHex(params.id);
    const userIdHex = convertStringToHex(params.userId);
    const fromWalletAddress =
      apiConfigService.adminWalletConfig.adminContractAddress;

    const data = web3.utils.soliditySha3(
      { type: 'address', value: fromWalletAddress },
      {
        type: 'address',
        value: params.toAddress,
      },
      { type: 'uint256', value: params.nonce },
      { type: 'uint256', value: params.serviceFeeAmount },
      {
        type: 'address[]',
        value: params.tokenIds,
      },
      {
        type: 'uint256[]',
        value: params.amountsDecimal,
      },
      { type: 'bytes', value: userIdHex },
      { type: 'bytes', value: idHex },
    );

    if (!data) {
      throw new ApiError('Invalid signature', 'E-1');
    }

    const decrypt = apiConfigService.adminWalletConfig.adminWalletPrivateKey;
    const signature = web3.eth.accounts.sign(data, decrypt);

    return {
      dataSign: {
        from: fromWalletAddress,
        to: params.toAddress,
        nonce: params.nonce,
        tokens: params.tokenIds,
        amounts: params.amounts,
        amountsDecimal: params.amountsDecimal,
        userId: userIdHex,
        _id: idHex,
        id: params.id,
        serviceFeeAmount: params.serviceFeeAmount,
      },
      signature: signature.signature || '',
    };
  }

  public static getRpc(chainId: number) {
    switch (chainId.toString()) {
      case apiConfigService.chainIdConfig.binanceChainId:
        return apiConfigService.chainIdConfig.binanceProvider;
      case apiConfigService.chainIdConfig.ethChainId:
        return apiConfigService.chainIdConfig.ethProvider;
      case apiConfigService.chainIdConfig.polygonChainId:
        return apiConfigService.chainIdConfig.poProvider;
      default:
        return '';
    }
  }

  public static getProvider(chainId: number) {
    const rpc = this.getRpc(chainId);

    return new Web3(new Web3.providers.HttpProvider(rpc));
  }
}
