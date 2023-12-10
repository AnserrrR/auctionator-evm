import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRoleEnum } from '../../user/enums/user-role.enum';
import { METADATA_ROLES_KEY } from '../decorators/roles.decorator';
import { ICurrentAuth } from '../interfaces/current-auth.interface';

/**
 * Security guard for checking access of users with specific roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Automatically called method for checking roles of the current authorized user
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[] | undefined>(METADATA_ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    const currentAuth = GqlExecutionContext.create(context).getContext().req.user as ICurrentAuth | undefined;
    return !requiredRoles || (!!currentAuth?.user.role && requiredRoles.includes(currentAuth?.user.role));
  }
}
