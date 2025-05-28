import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.usecase';
import {
  ProcessPurchaseRequest,
  ProcessPurchaseTransactionUseCase,
} from '../../application/use-cases/process-purchase-transaction.usecase';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly processPurchaseUseCase: ProcessPurchaseTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({
    schema: {
      example: {
        customerId: 'customer-uuid',
        amount: 1000,
      },
    },
    description: 'Transaction creation payload',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction successfully created',
    schema: {
      example: {
        id: 'generated-uuid',
        customerId: 'customer-uuid',
        status: 'PENDING',
        amount: 1000,
        createdAt: '2024-05-27T12:00:00.000Z',
      },
    },
  })
  async create(@Body() body: { customerId: string; amount: number }) {
    return this.createTransactionUseCase.execute(body);
  }

  @Post('purchase')
  @ApiOperation({ summary: 'Process a purchase transaction' })
  @ApiBody({
    schema: {
      example: {
        customerId: 'customer-uuid',
        productId: 'product-uuid',
        quantity: 1,
        shippingAddress: '123 Main St, Anytown USA',
        amount: 1000,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Purchase transaction processed successfully',
    schema: {
      example: {
        transactionId: 'generated-uuid',
        status: 'COMPLETED',
        deliveryId: 'generated-uuid',
        message: 'Purchase completed successfully',
      },
    },
  })
  async processPurchase(@Body() request: ProcessPurchaseRequest) {
    return await this.processPurchaseUseCase.execute(request);
  }
}
