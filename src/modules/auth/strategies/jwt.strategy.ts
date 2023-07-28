import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { TokenType } from '../../../constants';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { AdminEntity } from '../../admin/entities/admin.entity';
import { AdminRole } from '../../admin/enums/admin.enums';
import type { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ApiConfigService,
    private userService: UserService,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: {
    userId: Uuid;
    role;
    type: TokenType;
  }): Promise<UserEntity | AdminEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    if ([AdminRole.SubAdmin, AdminRole.SuperAdmin].includes(args.role)) {
      const admin = await this.adminRepository.findOne({
        where: {
          id: args.userId,
        },
      });

      if (!admin) {
        throw new UnauthorizedException();
      }

      return admin;
    }

    const user = await this.userService.findOne({
      // FIXME: issue with type casts
      id: args.userId as never,
      role: args.role,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account was disabled. Please contact with admin to enable account',
      );
    }

    return user;
  }
}
