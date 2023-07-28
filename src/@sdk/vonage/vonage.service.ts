import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { AuthInterface } from '@vonage/auth/dist/interfaces/AuthInterface';
import { Vonage } from '@vonage/server-sdk';
import { TypeEnum } from '@vonage/sms';
import { Repository } from 'typeorm';

import { ApiError } from '../../common/response/api-error';
import { convertPhoneNumber } from '../../common/utils';
import { NationalityEntity } from '../../modules/user/entities/nationality.entity';
import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class VonageService {
  private readonly vonage;

  private readonly fromNumber;

  constructor(
    private readonly configService: ApiConfigService,
    @InjectRepository(NationalityEntity)
    private readonly nationalityRepository: Repository<NationalityEntity>,
  ) {
    this.vonage = new Vonage({
      apiKey: configService.vonageConfig.apiKey,
      apiSecret: configService.vonageConfig.privateKey,
    } as AuthInterface);
    this.fromNumber = configService.vonageConfig.brandName;
  }

  async sendMessage(toNumber: string, text: string) {
    // await this.vonage.sms
    //   .send({
    //     to: toNumber,
    //     from: this.fromNumber,
    //     text,
    //     type: TypeEnum.TEXT,
    //   })
    //   .then((resp) => resp)
    //   .catch((error) => error);
  }

  async sendSmsMessage(phone: string, phoneCode: string, message: string) {
    // const nationality = await this.nationalityRepository.findOne({
    //   where: {
    //     phoneCode,
    //   },
    //   select: {
    //     phoneCode: true,
    //     twoLetterCode: true,
    //   },
    // });
    //
    // if (!nationality) {
    //   throw new ApiError('Invalid phone number', 'E12');
    // }
    //
    // const toNumber = convertPhoneNumber(phone, nationality.twoLetterCode);
    // await this.sendMessage(toNumber, message);
  }
}
