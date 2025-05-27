import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { TransactionStatus } from '../../domain/entities/transaction.entity';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column('decimal')
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}
