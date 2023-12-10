import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './entities/user-.entity';
import { UserResolver } from './user.resolver';
import { UserRepository } from './user.repository';

@Module({
  providers: [
    UserService,
    UserResolver,
    UserRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class UserModule {}
