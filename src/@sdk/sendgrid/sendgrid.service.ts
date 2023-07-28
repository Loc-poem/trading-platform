import { Injectable } from '@nestjs/common';
import sendGridEmail from '@sendgrid/mail';

import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class SendGridService {
  constructor(private readonly configService: ApiConfigService) {
    sendGridEmail.setApiKey(configService.sendGridConfig.apiKey);
  }

  async sendEmailWithTemplate<T extends Record<string, unknown>>(
    to: string,
    templateId: string,
    data: T,
    fromEmail?: string,
  ) {
    await sendGridEmail.send({
      to,
      templateId,
      from: fromEmail || this.configService.sendGridConfig.senderEmail,
      dynamicTemplateData: data,
    });
  }

  async sendMultipleEmailWithTemplate<T extends Record<string, unknown>>(
    to: string[],
    templateId: string,
    data: T,
    fromEmail?: string,
  ) {
    await sendGridEmail.sendMultiple({
      to,
      templateId,
      from: fromEmail || this.configService.sendGridConfig.senderEmail,
      dynamicTemplateData: data,
    });
  }
}
