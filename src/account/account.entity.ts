import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface Data {
  name: string;
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  auth: string;

  @Column('jsonb')
  data: Data;

  @Column()
  walletStr: string;

  @CreateDateColumn()
  created: Date;

  @DeleteDateColumn()
  deleted: Date;

  @UpdateDateColumn()
  updated: Date;
}
