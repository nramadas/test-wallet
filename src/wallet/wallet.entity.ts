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
  email?: string;
  walletStr: string;
  tags: string[];
}

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  accountId: string;

  @Column('jsonb')
  data: Data;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deleted: Date;

  @UpdateDateColumn()
  updated: Date;
}
