import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './role-protected.decorators';
import { UserRolesGuard } from '../guards/user-roles/user-roles.guard';

export function Auth(...roles: ['user', 'admin']) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRolesGuard),
  );
}
