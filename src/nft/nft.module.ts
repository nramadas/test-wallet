import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractModule } from 'src/contract/contract.module';
import { WalletModule } from 'src/wallet/wallet.module';

import { NftController } from './nft.controller';
import { NFT } from './nft.entity';
import { NftService } from './nft.service';
import { NftsController } from './nfts.controller';

/**
 * Manage NFTs on behalf of Accounts and Wallets
 */
@Module({
  imports: [
    ContractModule,
    TypeOrmModule.forFeature([NFT]),
    forwardRef(() => WalletModule),
  ],
  providers: [NftService],
  controllers: [NftsController, NftController],
  exports: [NftService],
})
export class NftModule {}
