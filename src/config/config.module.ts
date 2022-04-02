import { Module } from '@nestjs/common';
import { ConfigModule as _ConfigModule } from '@nestjs/config';

import { Config, ConfigService } from './config.service';

@Module({
  imports: [
    _ConfigModule.forRoot({
      envFilePath: '.env.local',
      load: [
        () => {
          const config: Config = {
            database: {
              host: process.env.DB_HOST || '',
              name: process.env.DB_NAME || '',
              password: process.env.DB_PASSWORD,
              port: parseInt(process.env.DB_PORT || ''),
              username: process.env.DB_USERNAME,
            },
            jwt: {
              secret: process.env.JWT_SECRET || '',
            },
            network: {
              alchemy: process.env.NETWORK_ALCHEMY || '',
              ethereumNetwork: process.env.NETWORK_ETHEREUM || '',
            },
            wallet: {
              encryptionSecret: process.env.WALLET_ENCRYPTION_SECRET || '',
            },
          };

          return config;
        },
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
