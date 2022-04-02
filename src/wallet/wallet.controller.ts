import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/jwt.guard';
import * as nftDto from 'src/nft/nft.dto';
import { NftService } from 'src/nft/nft.service';

import * as dto from './wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly nftService: NftService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * Get Wallet details
   */
  @Get('/:id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @UseGuards(JwtGuard)
  async get(@Param('id') id: string, @Request() req: any): Promise<dto.Wallet> {
    const wallet = await this.walletService.getDetails(req.user.id, id);

    if (!wallet) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return wallet;
  }

  /**
   * Get all the NFTs in a Wallet
   */
  @Get('/:id/nfts')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @UseGuards(JwtGuard)
  async getNfts(
    @Param('id') id: string,
    @Request() req: any,
  ): Promise<nftDto.NFT[]> {
    const wallet = await this.walletService.getDetails(req.user.id, id);

    if (!wallet) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    const nfts = await this.nftService.getAllInWalletDetails(req.user.id, id);

    return nfts;
  }
}
