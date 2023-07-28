import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { StoreBannerEntity } from '../entities/store-banner.entity';

export class BannerDto extends AbstractDto {
  bannerUrl: string;

  constructor(banner: StoreBannerEntity) {
    super(banner);

    this.bannerUrl = banner.bannerUrl;
  }
}
