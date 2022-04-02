import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { providers, Wallet } from 'ethers';
import { Repository } from 'typeorm';

import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from 'src/config/config.service';
import { ContractService } from 'src/contract/contract.service';

import { Account as AccountEntity, Data } from './account.entity';

export class Account extends AccountEntity {
  wallet: Wallet;
}

@Injectable()
export class AccountService {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly contractService: ContractService,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  /**
   * Returns a Account. The Account will include a Wallet property
   */
  async get(id: AccountEntity['id']) {
    const account = (await this.accountRepository.findOneOrFail({
      where: { id },
    })) as Account;

    // Ethers allows us to convert a wallet into a seralized format. We save
    // this on the Account. When we re-create the Account, we can use this
    // serialized version of the Wallet to re-create the Wallet as well.
    account.wallet = await Wallet.fromEncryptedJson(
      account.walletStr,
      this.configService.get('wallet.encryptionSecret'),
    );

    // Wallets must be connected to a Provider to be of any use
    const provider = new providers.JsonRpcProvider(
      this.configService.get('network.alchemy'),
    );

    // Wallets are immutable, so when we connect the existing Wallet, we get a
    // new one. We'll assign this connected Wallet to the Account.
    account.wallet = account.wallet.connect(provider);

    return account;
  }

  /**
   * Return Account details
   */
  async getDetails(id: AccountEntity['id']) {
    const account = await this.get(id);
    return this.buildDetails(account);
  }

  /**
   * Create a new Account
   */
  async register(data: Data, password: string) {
    // Save the password and get a link to it.
    const auth = await this.authService.create(password);

    // Create a new Wallet frot he Account
    const wallet = Wallet.createRandom();

    // Serialize the Wallet so that we can save it to the db
    const walletStr = await wallet.encrypt(
      this.configService.get('wallet.encryptionSecret'),
    );

    // We have everything we need to create a Account.
    const account = this.accountRepository.create({
      auth,
      data,
      walletStr,
    }) as Account;

    await this.accountRepository.save(account);

    // Wallets must be connected to a Provider to be of any use
    const provider = new providers.JsonRpcProvider(
      this.configService.get('network.alchemy'),
    );

    account.wallet = wallet.connect(provider);

    const details = await this.buildDetails(account);

    return {
      ...details,
      token: this.authService.getToken(account),
    };
  }

  private async buildDetails(account: Account) {
    const balance = await account.wallet.getBalance();

    return {
      id: account.id,
      address: account.wallet.address,
      balance: balance.toString(),
    };
  }
}
