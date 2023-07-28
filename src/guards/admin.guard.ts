import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AdminRole } from '../modules/admin/enums/admin.enums';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const adminDataJwt = request.user;
    const adminRoles = this.reflector.get<number[]>(
      'roles',
      context.getHandler(),
    );

    if (adminDataJwt.role === AdminRole.SuperAdmin) {
      return true;
    }

    return adminRoles.includes(adminDataJwt.role);
  }
}
