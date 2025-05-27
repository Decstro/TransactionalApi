import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './infraestructure/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.usecase';
import { TransactionRepository } from './infraestructure/repositories/transaction.repository';
import { TransactionOrmEntity } from './infraestructure/entities/transaction.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionOrmEntity])],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: 'TransactionRepositoryPort',
      useClass: TransactionRepository,
    },
  ],
})
export class TransactionsModule {}
