import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ContractModule } from './contract/contract.module';
import { NftModule } from './nft/nft.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    AccountModule,
    ConfigModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        database: configService.get('database.name'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        entities: [path.join(__dirname, '/**/entity{.ts,.js}')],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    WalletModule,
    NftModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
