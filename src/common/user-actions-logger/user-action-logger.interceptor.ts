import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { UserActionEntity } from './user-action.entity';
import { ICurrentAuth } from '../../api/auth/interfaces/current-auth.interface';

/**
 * Interceptor for logging user api Mutations calls.
 * You need to simply decorate a handler or entire resolver with «@UseInterceptors(UserActionLoggerInterceptor)».
 */
@Injectable()
export class UserActionLoggerInterceptor implements NestInterceptor {
  private readonly userActionRepository: Repository<UserActionEntity>;

  constructor(
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {
    this.userActionRepository = this.dataSource.getRepository(UserActionEntity);
  }

  /**
   * https://docs.nestjs.com/interceptors#basics
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);
    if (gqlCtx.getInfo()?.operation?.operation !== 'mutation') {
      // If it's not a mutation, then skip logging.
      return next.handle();
    }
    const currentAuth = gqlCtx.getContext().req.user as ICurrentAuth | undefined;
    const now = Date.now();
    return next.handle().pipe(tap(() => currentAuth && this.saveUserAction.bind(this)(currentAuth, now, gqlCtx)));
  }

  /**
   * Write new user action to database.
   * @param currentAuth - Current auth data.
   * @param now - DateTime in pre-controller moment.
   * @param gqlCtx - GraphQL context.
   * @returns UserActionEntity
   */
  private async saveUserAction(
    currentAuth: ICurrentAuth,
    now: number,
    gqlCtx: GqlExecutionContext,
  ): Promise<UserActionEntity> {
    return this.userActionRepository.save(<UserActionEntity>{
      userId: currentAuth.user.id,
      executedInMs: Date.now() - now,
      endpoint: `${(gqlCtx.getClass().name)}.${(gqlCtx.getHandler().name)}`,
      args: gqlCtx.getArgs(),
    });
  }
}
