import fs from 'fs';
import path from 'path';
import * as process from 'process';
import type { ReadonlyDeep } from 'type-fest';
import { Injectable, Logger } from '@nestjs/common';
import { set, values } from 'lodash';
import ms from 'ms';
import { joi, vercelMsValidator } from '../common/joi-configured';
import { NodeEnv } from './node-env.enum';

/**
 * Interface for typing the application startup configuration.
 * Provides connection data to various services.
 */
export interface IJsonConfig {
  /**
   * App environment mode enum.
   */
  nodeEnv: NodeEnv;
  /**
   * Application port.
   */
  port: number;
  /**
   * Relative path to folder where stores uploaded files.
   */
  filesUrl: string;
  /**
   * Absolute path to folder where stores uploaded images.
   */
  imagesUrl: string;
  /**
   * JWT auth options
   */
  jwtToken: {
    /**
     * Secret for token signing
     */
    secret: string;
    /**
     * User token expiration time
     */
    userTokenExpiresIn: string;
    /**
     * API token expiration time
     */
    apiTokenExpiresIn: string;
  }
  /**
   * Database connection configuration
   */
  database: {
    type: 'postgres';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  /**
   * S3 connection configuration
   */
  s3: {
    bucketName: string;
    endPoint: string;
    port?: number;
    accessKey: string;
    secretKey: string;
    presignedUrlExpiration: number;
  };
}

/**
 * Service that receives startup configuration of the whole application
 */
@Injectable()
export class ConfigService {
  private readonly validatedConfig: IJsonConfig;

  public readonly isMode: ReadonlyDeep<Record<NodeEnv, boolean>> = values(NodeEnv)
    .reduce<any>((acc, key) => set(acc, key, key === process.env.NODE_ENV), {});

  private logger = new Logger(ConfigService.name);

  /**
   * Config Constructor: tries to read env.CONFIG_PATH or 'config.${NODE_ENV}.json'.
   * Performs initialization for use of the getConfig() method.
   */
  constructor() {
    this.validateEnvironment();

    const configPathDefault = `config.${process.env.NODE_ENV}.json`;
    const configPath = path.resolve(process.env.CONFIG_PATH || configPathDefault);
    let fileText: string;
    let deserializedConfig: unknown;

    try {
      fileText = fs.readFileSync(configPath).toString();
    } catch (e) {
      this.throwConfigLoadingError(
        process.env.CONFIG_PATH
          ? `file "${configPath}" not exist`
          : `please create a "${configPathDefault}" or provide a "CONFIG_PATH" env variable`,
      );
    }

    try {
      deserializedConfig = JSON.parse(fileText);
    } catch (e) {
      this.throwConfigLoadingError(`failed to parse file ${configPath} as JSON`);
    }

    this.logger.log(`Configuration loaded from ${configPath}`);
    this.validatedConfig = this.validateConfig(deserializedConfig);
  }

  /**
   * Method for getting the loaded application configuration
   */
  public get config(): ReadonlyDeep<IJsonConfig> {
    return this.validatedConfig;
  }

  /**
   * Template Method for throwing an error of loading the application configuration
   */
  private throwConfigLoadingError(errorMessage: string): never {
    throw new Error(`Failed to load configuration: ${errorMessage}`);
  }

  /**
   * Method for validation of environment variables.
   */
  private validateEnvironment() {
    const { error } = this.environmentSchema.validate(process.env);
    if (error) {
      throw new Error(`Environment validation error: ${error.message})`);
    }
  }

  /**
   * Method for validation of loaded config.
   * Must be called after validating environment variables.
   */
  private validateConfig(config: unknown): IJsonConfig {
    const { error, value } = this.configSchema.validate(config);
    if (error) {
      throw new Error(`Config validation error: ${error.message})`);
    }
    return value;
  }

  /**
   * Joi schema for environment validation
   */
  private readonly environmentSchema = joi.object<NodeJS.ProcessEnv>({
    CONFIG_PATH: joi.string().optional(),
    NODE_ENV: joi.string().valid(...values(NodeEnv)).required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().port().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    JWT_TOKEN_SECRET: joi.string().required(),
    IAS_API_KEY: joi.string().required(),
    S3_ACCESS_KEY: joi.string().required(),
    S3_SECRET_KEY: joi.string().required(),
  }).required();

  /**
   * Joi schema for config validation
   */
  private readonly configSchema = joi.object<IJsonConfig>({
    nodeEnv: joi.string().forbidden().default(process.env.NODE_ENV),
    port: joi.number().port().required(),
    filesUrl: joi.string().optional().default('/files/'),
    imagesUrl: joi.string().optional().default('/images/'),
    jwtToken: joi.object<IJsonConfig['jwtToken']>({
      secret: joi.string().forbidden().default(process.env.JWT_TOKEN_SECRET),
      userTokenExpiresIn: joi.string().required().custom(vercelMsValidator),
      apiTokenExpiresIn: joi.string().optional().custom(vercelMsValidator).default('500y'),
    }).required(),
    database: joi.forbidden().default({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    } satisfies IJsonConfig['database']),
    s3: joi.object<IJsonConfig['s3']>({
      bucketName: joi.string().required(),
      endPoint: joi.string().required(),
      port: joi.number().port().optional(),
      accessKey: joi.string().forbidden().default(process.env.S3_ACCESS_KEY),
      secretKey: joi.string().forbidden().default(process.env.S3_SECRET_KEY),
      presignedUrlExpiration: joi.optional().default(ms('1d') / 1000),
    }),
  });
}
