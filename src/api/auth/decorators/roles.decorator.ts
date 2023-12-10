import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../../user/enums/user-role.enum';

/**
 * Metadata key for roles array
 */
export const METADATA_ROLES_KEY = 'roles';

/**
 * Decorator for setting specified roles in endpoints
 */
export const Roles = (...roles: UserRoleEnum[]) => SetMetadata(METADATA_ROLES_KEY, roles);
