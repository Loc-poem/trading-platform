import type { ExecutionContext } from '@nestjs/common';
import {
  applyDecorators,
  createParamDecorator,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUserInterceptor } from '../interceptors/auth-user-interceptor.service';
import type { AdminRole } from '../modules/admin/enums/admin.enums';

export function Admin(
  roles: AdminRole[] = [],
  options?: Partial<{ public: boolean }>,
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard({ public: isPublicRoute }), AdminGuard),
    ApiBearerAuth(),
    UseInterceptors(AuthUserInterceptor),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export const currentAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.adminData;
  },
);
