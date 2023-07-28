import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { StoreConfigEntity } from '../entities/store-config.entity';

export class StoreConfigDto extends AbstractDto {
  logo: string;

  backgroundColor: string;

  primaryColor: string;

  facebookLink: string;

  twitterLink: string;

  whatsappLink: string;

  instagramLink: string;

  youtubeLink: string;

  telegramLink: string;

  backgroundBodyColor: string;

  headerColor: string;

  footerColor: string;

  constructor(storeConfig: StoreConfigEntity) {
    super(storeConfig);
    this.logo = storeConfig.logo;
    this.backgroundColor = storeConfig.backgroundColor;
    this.primaryColor = storeConfig.primaryColor;
    this.facebookLink = storeConfig.facebookLink;
    this.twitterLink = storeConfig.twitterLink;
    this.whatsappLink = storeConfig.whatsappLink;
    this.instagramLink = storeConfig.instagramLink;
    this.youtubeLink = storeConfig.youtubeLink;
    this.telegramLink = storeConfig.telegramLink;
    this.backgroundBodyColor = storeConfig.backgroundBodyColor;
    this.headerColor = storeConfig.headerColor;
    this.footerColor = storeConfig.footerColor;
  }
}
