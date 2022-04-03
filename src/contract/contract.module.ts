import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contract } from './contract.entity';
import { ContractService } from './contract.service';

/**
 * Maintain Contracts for Accounts
 */
@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
