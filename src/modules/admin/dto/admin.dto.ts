import { AbstractDto } from '../../../common/dto/abstract.dto';
import type { AdminEntity } from '../entities/admin.entity';
import type { AdminRole } from '../enums/admin.enums';

export class AdminDto extends AbstractDto {
  userName: string;

  role: AdminRole;

  constructor(admin: AdminEntity) {
    super(admin);
    this.userName = admin.userName;
    this.role = admin.role;
  }
}
