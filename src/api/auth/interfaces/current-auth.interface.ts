import { UserEntity } from '../../user/entities/user.entity';
import { IJwtPayload } from './jwt-payload.interface';

/**
 * Type of «express.req.user»
 */
export interface ICurrentAuth {
  user: UserEntity;
  jwtPayload: IJwtPayload;
}
