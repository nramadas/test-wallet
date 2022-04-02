import { ContractInterface } from 'ethers';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Type {
  Mint = 'Mint',
}

export interface Data {
  abi: ContractInterface;
  address: string;
  transactionHash: string;
}

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  accountId: string;

  @Column('varchar')
  type: Type;

  @Column('jsonb')
  data: Data;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deleted: Date;

  @UpdateDateColumn()
  updated: Date;
}
