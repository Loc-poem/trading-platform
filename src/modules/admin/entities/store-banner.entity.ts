import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { BannerDto } from '../dto/banner.dto';

@Entity({ name: 'store_banner' })
@UseDto(BannerDto)
export class StoreBannerEntity extends AbstractEntity<BannerDto> {
  @Column({ name: 'banner_url' })
  bannerUrl: string;
}
