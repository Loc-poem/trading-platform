import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'referral_program' })
export class ReferralProgramEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.listReferralProgramOfUser)
  @JoinColumn({ name: 'source_user_id' })
  sourceUser: UserEntity;

  @Column({ name: 'source_user_id' })
  sourceUserId: Uuid;

  @ManyToOne(() => UserEntity, (user) => user.listReferralProgramOfOwner)
  @JoinColumn({ name: 'referral_owner_id' })
  referralOwner: UserEntity;

  @Column({ name: 'referral_owner_id' })
  referralOwnerId: Uuid;

  @Column({ name: 'level', type: 'int' })
  level: number;
}
