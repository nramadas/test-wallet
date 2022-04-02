import { Type } from '../contract.entity';
import { Account } from 'src/account/account.service';

export const makeNames = (account: Account) => {
  const base = account.data.name.replace(/[^a-z0-9]/gi, '');
  const short = base
    .replace(/[aeiou]/gi, '')
    .toUpperCase()
    .slice(0, 5);
  const klass = base[0].toUpperCase() + base.slice(1);
  const full = base[0].toUpperCase() + base.slice(1);

  return { klass, full, short };
};

/**
 * Returns a function that takes a Account and produces a contract
 */
export function contructContract(type: Type) {
  switch (type) {
    case Type.Mint:
      return (account: Account) => {
        const names = makeNames(account);

        return `
          // Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
          // SPDX-License-Identifier: MIT
          pragma solidity ^0.7.3;
          import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
          import "node_modules/@openzeppelin/contracts/utils/Counters.sol";
          import "node_modules/@openzeppelin/contracts/access/Ownable.sol";

          contract ${names.klass}Mint is ERC721, Ownable {
            using Counters for Counters.Counter;
            Counters.Counter private _tokenIds;
            constructor() public ERC721("${names.full}", "${names.short}") {}

            function contractURI()
              public view
              returns (string memory)
            {
              return "https://www.wallylabs.xyz/demo-contract-metadata.json";
            }

            function mintNFT(address recipient, string memory tokenURI)
              public onlyOwner
              returns (uint256)
            {
              _tokenIds.increment();
              uint256 newItemId = _tokenIds.current();
              _mint(recipient, newItemId);
              _setTokenURI(newItemId, tokenURI);
              return newItemId;
            }
          }
        `;
      };
  }
}
