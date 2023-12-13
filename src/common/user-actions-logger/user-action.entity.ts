import {
  BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { UserEntity } from '../../api/user/entities/user.entity';

/**
 * Entity used for logging user mutation calls by special interceptor.
 */
@ObjectType()
@Entity()
export class UserActionEntity extends BaseEntity {
  @Field(() => GraphQLUUID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => GraphQLUUID, { description: 'User who made the action' })
  @Column('uuid')
  userId: string;

  @Field(() => UserEntity, { description: 'User who made the action' })
  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Field(() => String, { description: 'String in format: {Resolver}.{method}' })
  @Column('text')
  endpoint: string;

  @Field(() => String, { description: 'Arguments received by the endpoint' })
  @Column('simple-json')
  args: any;

  @Field(() => Number, { description: 'Execution time in ms' })
  @Column('int')
  executedInMs: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
