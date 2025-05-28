export class Delivery {
  constructor(
    public readonly id: string,
    public readonly transactionId: string,
    public readonly customerName: string,
    public readonly customerId: string,
    public readonly shippingAddress: string,
  ) {}
}
