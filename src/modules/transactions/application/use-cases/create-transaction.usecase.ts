import { Inject } from '@nestjs/common';
import { CreateTransactionPort } from '../../ports/in/create-transaction.port';
import { TransactionRepositoryPort } from '../../ports/out/transaction-repository.port';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { randomUUID } from 'crypto';

export class CreateTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,
  ) {}

  async execute(data: CreateTransactionPort): Promise<Transaction> {
    const transaction = new Transaction(
      randomUUID(),
      data.customerId,
      TransactionStatus.PENDING,
      data.amount,
    );
    return await this.transactionRepo.save(transaction);
  }
}
