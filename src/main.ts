import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { config: { port, nodeEnv } } = await app.resolve(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Auctionator EVM')
    .setDescription('The Auctionator EVM API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    origin: true,
    credentials: true,
  });
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`App successfully launched in ${nodeEnv.toUpperCase()} mode on port ${port}`);
}
bootstrap();
