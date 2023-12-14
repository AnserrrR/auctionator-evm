import { Column, Entity } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/user-role.enum';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity extends AppBaseEntity {
  /**
   * User email.
   */
  @Column('text', { unique: true })
  email: string;

  /**
   * User role.
   * @enum UserRoleEnum
   */
  @Column('enum', { enum: UserRoleEnum })
  role: UserRoleEnum;

  @ApiHideProperty()
  @Column('text')
  @Exclude()
  password: string;

  /**
   * Key for JWT. It is possible to log out of the account from all devices by changing this line.
   */
  @Column('text', { nullable: true })
  jwtKey?: string;

  /**
   * User balance.
   */
  @Column('float', { default: 0 })
  balance: number;
}
