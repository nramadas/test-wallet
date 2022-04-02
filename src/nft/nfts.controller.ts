import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/jwt.guard';

import * as dto from './nft.dto';
import { NftService } from './nft.service';

@Controller('nfts')
export class NftsController {
  constructor(private readonly nftService: NftService) {}

  /**
   * Create an NFT from a uri and assign it to a Wallet
   */
  @Post('/create/from-uri')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async fromUri(
    @Body() body: dto.CreateNFTFromUriParams,
    @Request() req: any,
  ): Promise<dto.NFTCreated> {
    const { accountBalance, nft } = await this.nftService.createFromUri(
      req.user,
      body.uri,
      body.walletId,
    );

    return {
      accountBalance,
      id: nft.id,
      contractAddress: nft.data.address,
      uri: nft.data.uri,
      txHash: nft.data.transactionHash,
      walletId: body.walletId,
    };
  }
}
