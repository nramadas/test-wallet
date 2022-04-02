export class Account {
  /**
   * This is the ID we use to identify your Account
   */
  id: string;
  /**
   * Wallet address for your organization. The wallet associated with this
   * address will be used to pay for fees
   */
  address: string;
  /**
   * The amount of funds available in your Account
   */
  balance: string;
}

export class AccountRegistered {
  /**
   * This is the ID we use to identify your Account
   */
  id: string;
  /**
   * Wallet address for your organization. The wallet associated with this
   * address will be used to pay for fees
   */
  address: string;
  /**
   * Authorization token. Use this to interact with the API.
   */
  token: string;
}

export class AccountRegistrationParams {
  /**
   * Name of the Account
   */
  name: string;
  /**
   * Password to enable token recovery
   */
  password: string;
}
