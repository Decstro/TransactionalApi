import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepositoryPort } from '../../ports/out/transaction-repository.port';
import { StockRepositoryPort } from '../../../stock/ports/out/stock-repository.port';
import { CustomerRepositoryPort } from '../../../customers/ports/out/customer-repository.port';
import { DeliveryRepositoryPort } from '../../../deliveries/ports/out/delivery-repository.port';
import {
  Transaction,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { Delivery } from '../../../deliveries/domain/entities/delivery.entity';
import { PaymentService } from '../../services/payment.service';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessPurchaseRequest {
  customerId: string;
  productId: string;
  quantity: number;
  shippingAddress: string;
  amount: number;
  cardData: {
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvc: string;
    holderName: string;
  };
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
      throw new NotFoundException(`Customer not found`);
    }

    // 2. Check stock availability
    const stock = await this.stockRepo.findById(request.productId);
    if (!stock) {
      throw new NotFoundException('Product not found');
    }

    if (stock.quantity < request.quantity) {
      throw new NotFoundException('Insufficient stock available');
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
      const paymentResult = await this.processWompiPayment(
        transactionId,
        request.amount,
        request.cardData,
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

  private async processWompiPayment(
    transactionId: string,
    amount: number,
    cardData: {
      cardNumber: string;
      expMonth: string;
      expYear: string;
      cvc: string;
      holderName: string;
    },
  ): Promise<{ success: boolean; error?: string }> {
    const paymentService = new PaymentService();
    const result = await paymentService.processWompiPayment(
      transactionId,
      amount,
      'CARD',
      {
        cardNumber: cardData.cardNumber,
        expMonth: cardData.expMonth,
        expYear: cardData.expYear,
        cvc: cardData.cvc,
        holderName: cardData.holderName,
      },
    );

    return result;
  }
}
