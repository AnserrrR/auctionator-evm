import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
    UserRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class UserModule {}
