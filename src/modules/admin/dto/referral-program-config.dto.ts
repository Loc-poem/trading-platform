import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { ReferralProgramConfigEntity } from '../entities/referral-program-config.entity';

export class ReferralProgramConfigDto extends AbstractDto {
  level: number;

  rewardPercent: number;

  constructor(referralProgramConfig: ReferralProgramConfigEntity) {
    super(referralProgramConfig);

    this.level = referralProgramConfig.level;

    this.rewardPercent = referralProgramConfig.rewardPercent;
  }
}
