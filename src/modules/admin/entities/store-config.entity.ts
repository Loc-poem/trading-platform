import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { StoreConfigDto } from '../dto/store-config.dto';

@Entity({ name: 'store_config' })
@UseDto(StoreConfigDto)
export class StoreConfigEntity extends AbstractEntity<StoreConfigDto> {
  @Column({ name: 'logo', nullable: true })
  logo: string;

  @Column({ name: 'background_body_color', nullable: true })
  backgroundBodyColor: string;

  @Column({ name: 'background_color', nullable: true })
  backgroundColor: string;

  @Column({ name: 'header_color', nullable: true })
  headerColor: string;

  @Column({ name: 'footer_color', nullable: true })
  footerColor: string;

  @Column({ name: 'primary_color', nullable: true })
  primaryColor: string;

  @Column({ name: 'facebook_link', nullable: true })
  facebookLink: string;

  @Column({ name: 'twitter_link', nullable: true })
  twitterLink: string;

  @Column({ name: 'whatsapp_link', nullable: true })
  whatsappLink: string;

  @Column({ name: 'instagram_link', nullable: true })
  instagramLink: string;

  @Column({ name: 'youtube_link', nullable: true })
  youtubeLink: string;

  @Column({ name: 'telegram_link', nullable: true })
  telegramLink: string;
}
