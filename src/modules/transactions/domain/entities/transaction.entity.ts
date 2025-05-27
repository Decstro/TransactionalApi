export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public status: TransactionStatus = TransactionStatus.PENDING,
    public readonly amount: number,
    public readonly createdAt: Date = new Date(),
  ) {}

  complete(): void {
    this.status = TransactionStatus.COMPLETED;
  }

  fail(): void {
    this.status = TransactionStatus.FAILED;
  }
}
