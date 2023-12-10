/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/consistent-type-definitions */
// noinspection JSUnusedGlobalSymbols

/**
 * Global environment variables of process.env.*
 */
namespace NodeJS {
  import { NodeEnv } from './config/node-env.enum';

  type ProcessEnv = {
    /**
     * Location of the config file
     */
    CONFIG_PATH?: string;
    /**
     * Current environment
     */
    NODE_ENV: NodeEnv;
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    /**
     * JWT secret
     */
    JWT_TOKEN_SECRET: string;
    /**
     * IAS API key
     */
    IAS_API_KEY: string;
    /**
     * S3 access key (login)
     */
    S3_ACCESS_KEY: string;
    /**
     * S3 secret key (password)
     */
    S3_SECRET_KEY: string;
  };
}
