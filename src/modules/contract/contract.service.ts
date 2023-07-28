import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import Web3 from 'web3';

import { convertStringToHex } from '../../common/utils';
import { Web3Util } from '../../common/web3/web3.util';
import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class ContractService {
  private readonly tokenAbiPath: string;

  private readonly contractAbiPath: string;

  constructor(private readonly apiConfigService: ApiConfigService) {
    this.contractAbiPath = './abi/trading-platform.json';
    this.tokenAbiPath = './abi/MyToken.json';
  }

  async getNonceOfUser(params: { chainId: number; userId: Uuid }) {
    const { chainId, userId } = params;
    const contract = this.contractConfig(
      this.apiConfigService.adminWalletConfig.adminContractAddress,
      this.contractAbiPath,
      chainId,
    );

    const userIdHex = convertStringToHex(userId);

    const nonce = await contract.methods.getNonce(userIdHex).call();

    return nonce || 0;
  }

  async getDecimalOfToken(params: { tokenId: string; chainId: number }) {
    const { tokenId, chainId } = params;
    const contract = this.contractConfig(tokenId, this.tokenAbiPath, chainId);

    const decimal = await contract.methods.decimals().call();

    return decimal || 18;
  }

  async checkValidOrder(params: {
    id: string;
    chainId: number;
  }): Promise<boolean> {
    const { id, chainId } = params;
    const contract = this.contractConfig(
      this.apiConfigService.adminWalletConfig.adminContractAddress,
      this.contractAbiPath,
      chainId,
    );

    const idHex = convertStringToHex(id);
    const isValidOrder = await contract.methods.isValidOrder(idHex).call();

    return isValidOrder || true;
  }

  private contractConfig(
    contractAddress: string,
    abiFilePath: string,
    chainId: number,
  ) {
    const rpc = Web3Util.getRpc(chainId);
    const web3 = new Web3(rpc);
    const abiJson = fs.readFileSync(path.join(__dirname, abiFilePath), {
      encoding: 'utf8',
    });
    const abi = JSON.parse(abiJson).abi;

    return new web3.eth.Contract(abi, contractAddress);
  }
}
