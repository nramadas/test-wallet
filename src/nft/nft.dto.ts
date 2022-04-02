export class CreateNFTFromUriParams {
  /**
   * The location of the resource that will be converted to an NFT
   */
  uri: string;
  /**
   * The Wallet you want to assign the NFT to
   */
  walletId: string;
}

export class NFT {
  /**
   * ID for the nft
   */
  id: string;
  /**
   * The address of the contract that created the NFT
   */
  contractAddress: string;
  /**
   * The blockchain transaction that produced the NFT
   */
  txHash: string;
  /**
   * The location of the resource that hosts the NFT
   */
  uri: string;
  /**
   * The current owner of the NFT
   */
  walletId?: string;
}

export class NFTCreated {
  /**
   * ID for the nft
   */
  id: string;
  /**
   * How much is left in your account after minting
   */
  accountBalance: string;
  /**
   * The address of the contract that created the NFT
   */
  contractAddress: string;
  /**
   * The blockchain transaction that produced the NFT
   */
  txHash: string;
  /**
   * The location of the resource that hosts the NFT
   */
  uri: string;
  /**
   * The current owner of the NFT
   */
  walletId?: string;
}
