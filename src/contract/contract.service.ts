import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractFactory } from 'ethers';
import * as solc from 'solc';
import { Repository } from 'typeorm';

import { Account } from 'src/account/account.service';

import { Contract, Type } from './contract.entity';
import { contructContract, makeNames } from './contracts';

export { Type };

/**
 * Convert file dependencies to their location
 */
const getDependency = (dep: string) => {
  return { contents: fs.readFileSync(path.resolve('./', dep), 'utf-8') };
};

/**
 * Setup the config passed to the solidity compiler
 */
const createConfig = (account: Account, type: Type) => {
  const contract = contructContract(type)(account);

  return JSON.stringify({
    language: 'Solidity',
    sources: {
      [`${type}.sol`]: {
        content: contract,
      },
    },
    settings: {
      outputSelection: {
        // return everything
        '*': {
          '*': ['*'],
        },
      },
    },
  });
};

/**
 * Create a new contract of the given type for the Account
 */
const createContract = (account: Account, type: Type) => {
  const compiled = JSON.parse(
    solc.compile(createConfig(account, type), {
      import: getDependency,
    }),
  );

  const names = makeNames(account);
  const data = compiled.contracts[`${type}.sol`];
  const method = data[`${names.klass}${type}`];

  return {
    abi: method.abi,
    bytecode: method.evm.bytecode,
  };
};

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
  ) {}

  /**
   * Get a contract of a given Type for a Account
   */
  async get(account: Account, type: Type) {
    let contract = await this.contractRepository.findOne({
      where: { accountId: account.id, type: Type.Mint },
    });

    if (!contract) {
      // Compile the contract for the Account
      const compiled = createContract(account, type);

      // Create a new ContractFactory. A factory can be used to deploy the
      // transaction using a wallet;
      const factory = new ContractFactory(
        compiled.abi,
        compiled.bytecode,
        // Since we pass in the Account's wallet while creating the factory,
        // the transaction will automatically get signed with this wallet when
        // run, and gas fees will be collected automatically as well.
        account.wallet,
      );

      // In order to estimate the total gas costs, we need to first grab the
      // transaction that will be used to deploy the contract.
      const deployTransaction = factory.getDeployTransaction();

      // Using the deploy transaction, we can estimate the gas fees.
      const gasFees = await account.wallet.estimateGas(deployTransaction);

      // Now that we have an idea of how much it will cost, we can depoly the
      // transaction.
      const result = await factory.deploy({ gasLimit: gasFees });

      // To get the actual transaction, we need to wait on the contract's
      // deploy transaction.
      const transaction = await result.deployTransaction.wait();

      // At this stage, the contract has been successfully deployed. We can now
      // create the contract in our db so that we don't have to do this again.
      contract = this.contractRepository.create({
        accountId: account.id,
        type,
        data: {
          abi: compiled.abi,
          address: result.address,
          transactionHash: transaction.transactionHash,
        },
      });

      await this.contractRepository.save(contract);
    }

    return contract;
  }
}
