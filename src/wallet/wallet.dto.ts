export class CreateWalletParams {
  /**
   * User's email
   */
  email: string;
  /**
   * Tags you would like to associate with this user
   */
  tags?: string[];
}

export class Wallet {
  /**
   * Unique ID that can be used to reference this Wallet later
   */
  id: string;
  /**
   * Public address of the Wallet
   */
  address: string;
  /**
   * The amount of funds available in the Wallet
   */
  balance: string;
  /**
   * Tags associated with the Wallet
   */
  tags: string[];
}
