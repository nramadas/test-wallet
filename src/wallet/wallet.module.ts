import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from 'src/config/config.module';
import { NftModule } from 'src/nft/nft.module';

import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';
import { WalletsController } from './wallets.controller';

/**
 * Manage Wallets on behalf of Accounts
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Wallet]),
    forwardRef(() => NftModule),
  ],
  providers: [WalletService],
  controllers: [WalletsController, WalletController],
  exports: [WalletService],
})
export class WalletModule {}
