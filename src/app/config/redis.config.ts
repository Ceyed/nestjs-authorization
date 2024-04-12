import { registerConfig } from '@libs/utils/register.config';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum REDIS_CONFIG_ENUM {
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
}

export class RedisConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;

  constructor(obj: Partial<RedisConfig>) {
    Object.assign(this, obj);
  }
}

export const redisConfig = registerConfig(RedisConfig, () => {
  return new RedisConfig({
    host: process.env[REDIS_CONFIG_ENUM.REDIS_HOST],
    port: parseInt(process.env[REDIS_CONFIG_ENUM.REDIS_PORT] ?? '6379', 10),
  });
});
