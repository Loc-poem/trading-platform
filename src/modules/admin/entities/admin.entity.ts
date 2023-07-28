import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { AdminDto } from '../dto/admin.dto';
import { AdminRole } from '../enums/admin.enums';

@Entity({ name: 'admin' })
@UseDto(AdminDto)
export class AdminEntity extends AbstractEntity<AdminDto> {
  @Column({ name: 'user_name', unique: true })
  userName: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'role', enum: AdminRole, default: AdminRole.SuperAdmin })
  role: AdminRole;
}
