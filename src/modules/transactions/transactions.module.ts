import { Module } from '@nestjs/common';
import { TransactionController } from './infraestructure/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.usecase';

// Temporary in-memory repo before DB
const transactionRepoProvider = {
  provide: 'TransactionRepositoryPort',
  useClass: class InMemoryTransactionRepo {
    private store = new Map<string, any>();

    save(transaction: { id: string; [key: string]: any }): any {
      if (!transaction || !transaction.id) {
        throw new Error('Transaction must have an id');
      }
      this.store.set(transaction.id, transaction);
      return transaction;
    }

    updateStatus(id: string, status: string): any {
      if (!id || !status) {
        throw new Error('ID and status are required');
      }
      const transaction = this.store.get(id) as unknown;
      if (
        transaction &&
        typeof transaction === 'object' &&
        transaction !== null &&
        'status' in transaction
      ) {
        (transaction as Record<string, any>).status = status;
        return transaction;
      }
      return null;
    }

    findById(id: string): any {
      return this.store.get(id) ?? null;
    }
  },
};

@Module({
  controllers: [TransactionController],
  providers: [CreateTransactionUseCase, transactionRepoProvider],
})
export class TransactionsModule {}
