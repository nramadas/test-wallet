import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from 'src/config/config.module';
import { ContractModule } from 'src/contract/contract.module';

import { WalletModule } from 'src/wallet/wallet.module';

import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountsController } from './accounts.controller';

/**
 * Allow Accounts to set up accounts, and manage Accounts
 */
@Module({
  imports: [
    ConfigModule,
    ContractModule,
    WalletModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Account]),
  ],
  providers: [AccountController, AccountService],
  controllers: [AccountController, AccountsController],
  exports: [AccountService],
})
export class AccountModule {}
