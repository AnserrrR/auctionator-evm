import { registerEnumType } from '@nestjs/graphql';

/**
 * User roles
 */
export enum UserRoleEnum {
  Admin = 'Admin',
  Manager = 'Manager',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRoleEnum',
  description: 'User roles',
});
