import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { NationalityDto } from '../dtos/nationality.dto';
import { UserEntity } from './user.entity';

@Entity('nationalities')
@UseDto(NationalityDto)
export class NationalityEntity extends AbstractEntity<NationalityDto> {
  @Column({ unique: true })
  name: string;

  @Column()
  code: string;

  @Column({ name: 'phone_code' })
  phoneCode: string;

  @Column({ name: 'two_letter_code', nullable: false })
  twoLetterCode: string;

  @Column({ name: 'three_letter_code', nullable: false })
  threeLetterCode: string;

  @OneToMany(() => UserEntity, (user) => user.nationality, { nullable: true })
  user: UserEntity[];

  @Column({ name: 'country_name', nullable: true, unique: true })
  countryName: string;
}
