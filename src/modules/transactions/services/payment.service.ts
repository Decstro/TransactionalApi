import axios from 'axios';
import * as crypto from 'crypto';

// Interfaces
interface CardData {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  holderName: string;
}

interface TokenizeCardResponse {
  data: {
    id: string;
  };
}

interface WompiTransactionResponse {
  data: {
    id: string;
    status: string;
  };
}

type PaymentMethod = 'CARD' | 'NEQUI' | 'PSE' | 'BANCOLOMBIA_TRANSFER';

export class PaymentService {
  private readonly apiUrl = process.env.WOMPI_API_URL;
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY;
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY;
  private readonly integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

  async processWompiPayment(
    transactionId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    cardData?: CardData,
  ): Promise<{ success: boolean; error?: string; transactionResponse?: any }> {
    try {
      // 1. Tokenizar tarjeta si es pago con tarjeta
      let paymentSourceId;
      if (paymentMethod === 'CARD' && cardData) {
        const tokenResponse = await this.tokenizeCard(cardData);
        paymentSourceId = tokenResponse.token;
      }

      // 2. Crear la transacción en Wompi
      const transactionResponse = await this.createWompiTransaction(
        transactionId,
        amount,
        paymentMethod,
        paymentSourceId,
      );

      return {
        success: transactionResponse.data.status === 'APPROVED',
        transactionResponse: transactionResponse.data,
      };
    } catch (error: any) {
      return {
        success: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          error.response?.data?.error?.message || 'Error desconocido en Wompi',
      };
    }
  }

  private generateWompiSignature(
    reference: string,
    amount: number,
    currency: string,
  ): string {
    const concatenated = `${reference}${amount}${currency}${this.integritySecret}`;
    return crypto.createHash('sha256').update(concatenated).digest('hex');
  }

  private async getAcceptanceToken(): Promise<string> {
    interface AcceptanceTokenResponse {
      data: {
        presigned_acceptance: {
          acceptance_token: string;
        };
      };
    }

    const response = await axios.get<AcceptanceTokenResponse>(
      `${this.apiUrl}/merchants/${this.publicKey}`,
    );
    return response.data.data.presigned_acceptance.acceptance_token;
  }

  private async tokenizeCard(cardData: CardData): Promise<{ token: string }> {
    const response = await axios.post<TokenizeCardResponse>(
      `${this.apiUrl}/tokens/cards`,
      {
        number: cardData.cardNumber,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        cvc: cardData.cvc,
        card_holder: cardData.holderName,
      },
      {
        headers: {
          Authorization: `Bearer ${this.publicKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return { token: response.data.data.id };
  }

  private async createWompiTransaction(
    transactionId: string,
    amount: number,
    paymentMethod: string,
    paymentSourceId?: string,
  ): Promise<WompiTransactionResponse> {
    // Obtenemos el acceptance token
    const acceptanceToken = await this.getAcceptanceToken();

    const currency = 'COP';
    const signature = this.generateWompiSignature(
      transactionId,
      amount,
      currency,
    );

    // Construimos los datos de la transacción
    const transactionData = {
      acceptance_token: acceptanceToken,
      amount_in_cents: amount,
      currency,
      customer_email: 'juanpuello@prueba.com',
      reference: transactionId,
      payment_method: {
        type: 'CARD',
        installments: 1,
        token: paymentSourceId,
      },
      signature,
    };

    const response = await axios.post<WompiTransactionResponse>(
      `${this.apiUrl}/transactions`,
      transactionData,
      {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }
}
