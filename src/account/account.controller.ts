import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/jwt.guard';
import * as walletDto from 'src/wallet/wallet.dto';
import { WalletService } from 'src/wallet/wallet.service';

import * as dto from './account.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly walletService: WalletService,
  ) {}

  /**
   * Get your account details
   */
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  get(@Request() req: any): Promise<dto.Account> {
    return this.accountService.getDetails(req.user.id);
  }

  @Get('/wallets')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async getWallets(@Request() req: any): Promise<walletDto.Wallet[]> {
    return this.walletService.getAllDetails(req.user.id);
  }
}
