import { Injectable } from '@nestjs/common';
import { ConfigService as _ConfigService, Path } from '@nestjs/config';

export interface Config {
  database: {
    host: string;
    name: string;
    password: string | undefined;
    port: number;
    username: string | undefined;
  };
  jwt: {
    secret: string;
  };
  network: {
    alchemy: string;
    ethereumNetwork: string;
  };
  wallet: {
    encryptionSecret: string;
  };
}

@Injectable()
export class ConfigService extends _ConfigService<Config, true> {
  get<P extends Path<Config>>(path: P) {
    const value = super.get(path, { infer: true });
    return value;
  }
}
