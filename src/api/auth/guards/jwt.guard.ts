import { AuthGuard } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { METADATA_PUBLIC_KEY } from '../decorators/public.decorator';
import { ICurrentAuth } from '../interfaces/current-auth.interface';
import { ConfigService } from '../../../config/config.service';
import { NodeEnv } from '../../../config/node-env.enum';

/**
 * Security guard for checking access of authorized users
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  /**
   * Method automatically callable for getting express request from graphql context
   */
  getRequest(context: ExecutionContextHost): any {
    return GqlExecutionContext.create(context).getContext().req;
  }

  /**
   * Method automatically callable after all guard and strategy validations
   */
  handleRequest(strategyErr?: Error, payload?: ICurrentAuth | false, jwtErr?: Error): any {
    const isError = !!(strategyErr || jwtErr || !payload);
    // For debug:
    if (isError && this.configService.config.nodeEnv === NodeEnv.Dev) {
      const errors = {
        strategyErr: strategyErr?.message,
        jwtErr: jwtErr?.message,
        payload,
      };
      this.logger.debug(`Authorization error: ${JSON.stringify(errors, null, 2)}`);
      throw new UnauthorizedException(JSON.stringify(errors));
    }
    if (isError) {
      throw new UnauthorizedException('Unauthorized');
    }
    return payload;
  }

  /**
   * Method automatically callable for check the current user's access to the endpoints
   */
  async canActivate(context: ExecutionContextHost): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(METADATA_PUBLIC_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    return isPublic || super.canActivate(context) as boolean;
  }
}
