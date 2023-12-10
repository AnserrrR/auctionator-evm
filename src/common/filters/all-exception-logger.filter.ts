import {
  ExceptionFilter, Catch, ArgumentsHost, Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionLoggerFilter');

  catch(exception: any, host: ArgumentsHost) {
    this.logger.error(`Unhandled exception caught: ${exception.message}`, exception.stack);
  }
}
