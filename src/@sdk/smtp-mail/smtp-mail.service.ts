import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class SmtpMailService {
  private readonly transporter;

  constructor(private readonly apiConfigService: ApiConfigService) {
    const smtpHost = this.apiConfigService.smtpMailServerConfig.smtpHost;
    const smtpPort = this.apiConfigService.smtpMailServerConfig.smtpPort;
    const smtpUser = this.apiConfigService.smtpMailServerConfig.smtpUser;
    const smtpPassword =
      this.apiConfigService.smtpMailServerConfig.smtpPassword;
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
  }

  async sendEmail(
    toEmail,
    subject: string,
    dir: string,
    template: string,
    context,
  ) {
    const options = {
      from: this.apiConfigService.smtpMailServerConfig.senderEmail,
      to: toEmail,
      subject,
      template,
      context,
    };
    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          partialsDir: 'src/mail-templates',
          layoutsDir: process.cwd() + `/src/mail-templates/${dir}`,
          defaultLayout: false,
        },
        viewPath: 'src/mail-templates/' + dir,
        extName: '.hbs',
      }),
    );

    await this.transporter.sendMail(options);

    return true;
  }

  async sendRawEmail(toEmail: string, subject: string, context: string) {
    const options = {
      from: this.apiConfigService.smtpMailServerConfig.senderEmail,
      to: toEmail,
      subject,
      html: context,
    };
    await this.transporter.sendMail(options);

    return true;
  }
}
