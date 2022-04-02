import { Body, Controller, Post } from '@nestjs/common';

import * as dto from './account.dto';
import { AccountService } from './account.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Register your organization with Wally
   */
  @Post('/register')
  register(
    @Body() body: dto.AccountRegistrationParams,
  ): Promise<dto.AccountRegistered> {
    return this.accountService.register({ name: body.name }, body.password);
  }
}
