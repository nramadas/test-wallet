import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface Data {
  address: string;
  transactionHash: string;
  uri: string;
}

@Entity()
export class NFT {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  accountId: string;

  @Column('jsonb')
  data: Data;

  @Column()
  walletId: string;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deleted: Date;

  @UpdateDateColumn()
  updated: Date;
}
