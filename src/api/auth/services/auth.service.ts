import crypto from 'crypto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import jwt from 'jsonwebtoken';
import { IJwtPayloadCreate } from '../interfaces/jwt-payload.interface';
import { UserEntity } from '../../user/entities/user.entity';
import { ConfigService } from '../../../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  /**
   * Generate JWT.
   * @param input - Payload for JWT.
   * @returns Encoded JWT.
   */
  public async generateAccessToken(input: IJwtPayloadCreate): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(input, this.configService.config.jwtToken.secret, {
        expiresIn: this.configService.config.jwtToken.userTokenExpiresIn,
      }, (error, encoded) => (encoded ? resolve(encoded) : reject(error)));
    });
  }

  /**
   * Generate random string for user's JWT generation.
   * This string saves into user's entity, and it's change performs user's logout.
   */
  public async generateJwtKey(): Promise<string> {
    return crypto.randomBytes(8).toString('hex');
  }

  /**
   * Check user though database. Also try handle remote auth error.
   * @param login - User login.
   * @param password - User password.
   * @returns UserEntity.
   * @throws NotFoundException - User not found.
   * @throws UnauthorizedException - Invalid password.
   */
  public async checkUserThoughDatabase(
    { login, password }: { login: string, password: string },
  ): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOneByOrFail({ email: login }).catch(() => {
      throw new NotFoundException('User not found');
    });
    if (!await bcrypt.compare(password, userEntity.password)) {
      // If login or password not match -> Unauthorized
      throw new UnauthorizedException();
    }
    if (!userEntity.jwtKey) {
      // If user don't have jwtKey -> generate it
      userEntity.jwtKey = await this.generateJwtKey();
      await userEntity.save();
    }
    return userEntity;
  }

  public async userLogout(userId: string) {
    const updateResult = await this.userRepository.update({ id: userId }, { jwtKey: await this.generateJwtKey() });
    if (!updateResult.affected) {
      throw new NotFoundException('User not found');
    }
  }
}
