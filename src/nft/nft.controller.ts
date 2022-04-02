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

import * as dto from './nft.dto';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  /**
   * Get details about an NFT created with Wally
   */
  @Get('/:id')
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @UseGuards(JwtGuard)
  async fromUri(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<dto.NFT> {
    const nft = await this.nftService.getDetails(req.user.id, id);

    if (!nft) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return nft;
  }
}
