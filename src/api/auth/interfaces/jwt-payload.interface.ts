/**
 * Input for creating JWT
 */
export interface IJwtPayloadCreate {
  /**
   * User or ApiToken Identifier
   */
  id: string;
  /**
   * Key of JWT. Must match the jwtKey in the UserEntity.
   */
  key?: string;
}

/**
 * Payload of JWT
 */
export type IJwtPayload = IJwtPayloadCreate & {
  /**
   * Issued At Time.
   */
  iat: number;
  /**
   * Expiration date of JWT in seconds.
   */
  exp: number;
};
