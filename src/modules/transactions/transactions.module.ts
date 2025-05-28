import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './infraestructure/controllers/transaction.controller';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.usecase';
import { TransactionRepository } from './infraestructure/repositories/transaction.repository';
import { TransactionOrmEntity } from './infraestructure/entities/transaction.orm-entity';
import { StockModule } from '../stock/stocks.module';
import { CustomersModule } from '../customers/customers.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { ProcessPurchaseTransactionUseCase } from './application/use-cases/process-purchase-transaction.usecase';

const transactionRepoProvider = {
  provide: 'TransactionRepositoryPort',
  useClass: TransactionRepository,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    StockModule,
    CustomersModule,
    DeliveriesModule,
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    ProcessPurchaseTransactionUseCase,
    transactionRepoProvider,
  ],
  exports: [transactionRepoProvider],
})
export class TransactionsModule {}
