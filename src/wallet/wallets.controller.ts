import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/jwt.guard';

import * as dto from './wallet.dto';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Create a new Wallet for a user in your organization
   */
  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  create(
    @Body() body: dto.CreateWalletParams,
    @Request() req: any,
  ): Promise<dto.Wallet> {
    return this.walletService.create(req.user.id, {
      email: body.email,
      tags: body.tags || [],
    });
  }
}
