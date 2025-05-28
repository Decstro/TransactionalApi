import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../ports/out/transaction-repository.port';
import { StockRepositoryPort } from '../../../stock/ports/out/stock-repository.port';
import { CustomerRepositoryPort } from '../../../customers/ports/out/customer-repository.port';
import { DeliveryRepositoryPort } from '../../../deliveries/ports/out/delivery-repository.port';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { Delivery } from '../../../deliveries/domain/entities/delivery.entity';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessPurchaseRequest {
  customerId: string;
  productId: string;
  quantity: number;
  shippingAddress: string;
  amount: number;
}

export interface ProcessPurchaseResponse {
  transactionId: string;
  status: TransactionStatus;
  deliveryId?: string;
  message: string;
}

@Injectable()
export class ProcessPurchaseTransactionUseCase {
  constructor(
    @Inject('TransactionRepositoryPort')
    private readonly transactionRepo: TransactionRepositoryPort,
    @Inject('StockRepositoryPort')
    private readonly stockRepo: StockRepositoryPort,
    @Inject('CustomerRepositoryPort')
    private readonly customerRepo: CustomerRepositoryPort,
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,
  ) {}

  async execute(
    request: ProcessPurchaseRequest,
  ): Promise<ProcessPurchaseResponse> {
    // 1. Validate customer exists
    const customer = await this.customerRepo.findById(request.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // 2. Check stock availability
    const stock = await this.stockRepo.findById(request.productId);
    if (!stock) {
      throw new Error('Product not found');
    }

    if (stock.quantity < request.quantity) {
      throw new Error('Insufficient stock available');
    }

    // 3. Create transaction in PENDING status
    const transactionId = uuidv4();
    const transaction = new Transaction(
      transactionId,
      request.customerId,
      TransactionStatus.PENDING,
      request.amount,
      new Date(),
    );

    await this.transactionRepo.save(transaction);

    try {
      // 4. Call external payment API (mocked)
      const paymentResult = await this.mockExternalPaymentAPI(
        transactionId,
        request.amount,
      );

      if (paymentResult.success) {
        // 5. Payment successful - update transaction
        await this.transactionRepo.updateStatus(
          transactionId,
          TransactionStatus.COMPLETED,
        );

        // 6. Create delivery record
        const deliveryId = uuidv4();
        const delivery = new Delivery(
          deliveryId,
          transactionId,
          customer.name,
          customer.customerId,
          request.shippingAddress,
        );
        await this.deliveryRepo.save(delivery);

        // 7. Update stock
        await this.stockRepo.decrementStock(
          request.productId,
          request.quantity,
        );

        return {
          transactionId,
          status: TransactionStatus.COMPLETED,
          deliveryId,
          message: 'Purchase completed successfully',
        };
      } else {
        // 8. Payment failed - update transaction
        await this.transactionRepo.updateStatus(
          transactionId,
          TransactionStatus.FAILED,
        );

        return {
          transactionId,
          status: TransactionStatus.FAILED,
          message: 'Payment failed: ' + paymentResult.error,
        };
      }
    } catch (error: unknown) {
      // 9. Handle any errors - update transaction to failed
      await this.transactionRepo.updateStatus(
        transactionId,
        TransactionStatus.FAILED,
      );

      const message =
        error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        transactionId,
        status: TransactionStatus.FAILED,
        message: `Transaction processing failed: ${message}`,
      };
    }
  }

  private async mockExternalPaymentAPI(
    transactionId: string,
    amount: number,
  ): Promise<{ success: boolean; error?: string }> {
    // Mock external API call with random success/failure
    return new Promise((resolve) => {
      setTimeout(() => {
        // 80% success rate for demo purposes
        const isSuccess = Math.random() > 0.2;

        if (isSuccess) {
          console.log(
            `✅ Payment successful for transaction ${transactionId}, amount: $${amount}`,
          );
          resolve({ success: true });
        } else {
          console.log(`❌ Payment failed for transaction ${transactionId}`);
          resolve({
            success: false,
            error: 'Payment gateway declined the transaction',
          });
        }
      }, 1000); // Simulate 1 second API call delay
    });
  }
}
