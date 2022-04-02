import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from 'ethers';
import { Repository } from 'typeorm';

import { Account } from 'src/account/account.service';
import { ContractService, Type } from 'src/contract/contract.service';
import { WalletService } from 'src/wallet/wallet.service';

import { NFT } from './nft.entity';

@Injectable()
export class NftService {
  constructor(
    private readonly contractService: ContractService,
    private readonly walletService: WalletService,
    @InjectRepository(NFT)
    private readonly nftRepository: Repository<NFT>,
  ) {}

  /**
   * Get details about an NFT
   */
  async getDetails(accountId: Account['id'], id: NFT['id']) {
    const nft = await this.nftRepository.findOne({ where: { id, accountId } });

    if (!nft) {
      return null;
    }

    return this.buildDetails(nft);
  }

  /**
   * Get details for all the NFTs associated with a Wallet
   */
  async getAllInWalletDetails(accountId: Account['id'], walletId: string) {
    const nfts = await this.getAllInWallet(accountId, walletId);
    return nfts.map(this.buildDetails);
  }

  /**
   * Get all the NFT in a Wallet
   */
  async getAllInWallet(accountId: Account['id'], walletId: string) {
    return this.nftRepository.find({ where: { accountId, walletId } });
  }

  /**
   * Create a new NFT from a uri, and assign it to a Wallet
   */
  async createFromUri(account: Account, uri: string, walletId: string) {
    // Get the Wallet instance
    const wallet = await this.walletService.get(account.id, walletId);

    if (!wallet) {
      throw new Error('Not a real wallet');
    }

    // Grab contract to Mint the NFT
    const dbContract = await this.contractService.get(account, Type.Mint);

    // Create the contract
    const contract = new Contract(
      dbContract.data.address,
      dbContract.data.abi,
      // By passing in the Account's wallet, signing the transaction will
      // happen automatically.
      account.wallet,
    );

    // Get a TransactionResponse for calling the mint method on the contract
    const response = await contract.mintNFT(wallet.address, uri);

    // To get additional details from the minting, we need to wait for the
    // transaction to complete
    const receipt = await response.wait();

    // After the transaction completes, check the balance of the Account
    const balance = await account.wallet.getBalance();

    // At this point, the NFT has been successfully created, so save the result
    // to the database
    const nft = this.nftRepository.create({
      accountId: account.id,
      data: {
        uri,
        address: receipt.contractAddress,
        transactionHash: receipt.transactionHash,
      },
      walletId: wallet.id,
    });

    await this.nftRepository.save(nft);

    return {
      nft,
      accountBalance: balance.toString(),
    };
  }

  /**
   * Convert an NFT from the db to details
   */
  private buildDetails(nft: NFT) {
    return {
      id: nft.id,
      contractAddress: nft.data.address,
      txHash: nft.data.transactionHash,
      uri: nft.data.uri,
      walletId: nft.walletId,
    };
  }
}
