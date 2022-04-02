import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { providers, Wallet as EthersWallet } from 'ethers';
import { Repository } from 'typeorm';

import { ConfigService } from 'src/config/config.service';

import { Data, Wallet } from './wallet.entity';

/**
 * A WallyWallet extends the standard Ether's Ethereum Wallet with additional
 * properties that are relevant to the Wally API
 */
export class WallyWallet extends EthersWallet {
  id: string;
  email?: string;
  tags: string[];

  /**
   * Create a WallyWallet from a db entity
   */
  static fromDbWallet = async (
    wallet: Wallet,
    secret: string,
    providerUrl: string,
  ) => {
    // Without a provider, a Wallet isn't very useful
    const provider = new providers.JsonRpcProvider(providerUrl);

    // Convert the saved, serialized wallet into an Ethers Wallet, and connect
    // it to our provider.
    const rawWallet = await EthersWallet.fromEncryptedJsonSync(
      wallet.data.walletStr,
      secret,
    ).connect(provider);

    // Now, convert the EthersWallet into a WallyWallet
    const wallyWallet = new WallyWallet(
      rawWallet.privateKey,
      rawWallet.provider,
    );
    wallyWallet.id = wallet.id;
    wallyWallet.email = wallet.data.email;
    wallyWallet.tags = wallet.data.tags;

    return wallyWallet;
  };
}

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  /**
   * Create a new Wallet on behalf of a Account
   */
  async create(accountId: string, options: Omit<Data, 'walletStr'>) {
    // Ethers gives us an easy way to creat a new Wallet
    const etherWallet = EthersWallet.createRandom();

    // Serialize the Wallet so that we can easily save it to the db
    const walletStr = await etherWallet.encrypt(
      this.configService.get('wallet.encryptionSecret'),
    );

    // Create the Wallet in the db
    const wallet = this.walletRepository.create({
      accountId,
      data: {
        walletStr,
        email: options.email,
        tags: options.tags,
      },
    });

    await this.walletRepository.save(wallet);

    // Wallets must be connected to a Provider to be of any use
    const provider = new providers.JsonRpcProvider(
      this.configService.get('network.alchemy'),
    );

    // Grab the balance on the Wallet
    const balance = await etherWallet.connect(provider).getBalance();

    return {
      id: wallet.id,
      address: etherWallet.address,
      balance: balance.toString(),
      tags: options.tags,
    };
  }

  /**
   * Fetch a Wallet that belongs to a Account
   */
  async get(accountId: string, walletId: string) {
    // Get the Wallet from the db
    const dbWallet = await this.walletRepository.findOne({
      accountId,
      id: walletId,
    });

    // If it exists, convert it to a WallyWallet
    if (dbWallet) {
      return WallyWallet.fromDbWallet(
        dbWallet,
        this.configService.get('wallet.encryptionSecret'),
        this.configService.get('network.alchemy'),
      );
    }

    return null;
  }

  /**
   * Fetch all the Wallets associated with an Accout
   */
  async getAll(accountId: string) {
    // Grab all the Wallets
    const wallets = await this.walletRepository.find({
      where: { accountId },
    });

    const wallyWallets = await Promise.all(
      wallets.map((wallet) =>
        WallyWallet.fromDbWallet(
          wallet,
          this.configService.get('wallet.encryptionSecret'),
          this.configService.get('network.alchemy'),
        ),
      ),
    );

    return wallyWallets;
  }

  /**
   * Get details about the Wallet
   */
  async getDetails(accountId: string, walletId: string) {
    // Grab the wallet
    const wallet = await this.get(accountId, walletId);

    if (!wallet) {
      return null;
    }

    // Build the details
    const balance = await wallet.getBalance();

    return {
      id: wallet.id,
      address: wallet.address,
      balance: balance.toString(),
      tags: wallet.tags,
    };
  }

  /**
   * Get details for all the Wallets in an Account
   */
  async getAllDetails(accountId: string) {
    const wallets = await this.getAll(accountId);

    const details = await Promise.all(
      wallets.map((wallet) =>
        wallet.getBalance().then((balance) => ({
          id: wallet.id,
          address: wallet.address,
          balance: balance.toString(),
          tags: wallet.tags,
        })),
      ),
    );

    return details;
  }
}
