import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { ReferralProgramConfigDto } from '../dto/referral-program-config.dto';

@Entity('referral_program_config')
@UseDto(ReferralProgramConfigDto)
export class ReferralProgramConfigEntity extends AbstractEntity<ReferralProgramConfigDto> {
  @Column({ name: 'level', type: 'int' })
  level: number;

  @Column({ name: 'reward_percent', type: 'float' })
  rewardPercent: number;
}
