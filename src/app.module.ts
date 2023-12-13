import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { BidModule } from './api/bid/bid.module';
import { LotModule } from './api/lot/lot.module';
import { AuctionModule } from './api/auction/auction.module';
import { UserModule } from './api/user/user.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { FilesModule } from './api/files/files.module';
import { RolesGuard } from './api/auth/guards/roles.guard';
import { JwtGuard } from './api/auth/guards/jwt.guard';
import { AuthModule } from './api/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    BidModule,
    LotModule,
    AuctionModule,
    UserModule,
    FilesModule,
    SwaggerModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.config.database,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
