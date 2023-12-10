import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ICurrentAuth } from '../interfaces/current-auth.interface';

/**
 * Decorator injects current authorization context, returned from strategy.
 */
export const CurrentAuth = createParamDecorator(
  (key: keyof ICurrentAuth | undefined, context: ExecutionContext) => {
    const user = GqlExecutionContext.create(context).getContext().req.user as ICurrentAuth | undefined;
    if (!user) {
      throw new InternalServerErrorException('CurrentAuth decorator used without JwtGuard');
    }
    return key ? user[key] : user;
  },
);
