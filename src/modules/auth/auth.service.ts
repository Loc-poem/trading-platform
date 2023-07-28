import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiError } from '../../common/response/api-error';
import { validateHash } from '../../common/utils';
import type { RoleType } from '../../constants';
import { TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { AdminRole } from '../admin/enums/admin.enums';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import type { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createAccessToken(data: {
    role: RoleType | AdminRole;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async loginUser(data: UserLoginDto) {
    const existedUser = await this.userRepository.findOne({
      where: [
        {
          email: data.email.toLowerCase().trim(),
        },
        {
          userName: data.email,
        },
      ],
    });

    if (
      !existedUser ||
      !(await validateHash(data.password, existedUser.password))
    ) {
      throw new ApiError('Phone or password is invalid', 'E7');
    }

    if (!existedUser.isActive) {
      throw new ApiError(
        'Your account was disabled. You should contact with admin for more information',
        'E-1',
      );
    }

    return existedUser.toDto();
  }
}
