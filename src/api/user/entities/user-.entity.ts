import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLEmailAddress, GraphQLUUID } from 'graphql-scalars';
import { UserRoleEnum } from '../enums/user-role.enum';

@Entity()
@ObjectType()
export class UserEntity extends BaseEntity {
  @Field(() => GraphQLUUID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => GraphQLEmailAddress)
  @Column('text', { unique: true })
  email: string;

  @Field(() => UserRoleEnum)
  @Column('enum', { enum: UserRoleEnum })
  role: UserRoleEnum;

  @Column('text')
  password: string;

  /**
   * Key for JWT. It is possible to log out of the account from all devices by changing this line.
   */
  @Column('text', { nullable: true })
  jwtKey?: string;

  @Field(() => [String])
  @Column('simple-array')
  departments: string[];
}
