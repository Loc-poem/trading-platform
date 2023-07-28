import { ApiProperty } from '@nestjs/swagger';

import type { AdminDto } from '../../admin/dto/admin.dto';
import type { UserDto } from '../../user/dtos/user.dto';
import { TokenPayloadDto } from './TokenPayloadDto';

export class LoginPayloadDto {
  @ApiProperty()
  user: UserDto | AdminDto;

  @ApiProperty({ type: TokenPayloadDto })
  token: TokenPayloadDto;

  constructor(user: UserDto | AdminDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}
