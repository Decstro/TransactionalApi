import { Body, Controller, Post } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.usecase';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() body: { customerId: string; amount: number }) {
    return this.createTransactionUseCase.execute(body);
  }
}
