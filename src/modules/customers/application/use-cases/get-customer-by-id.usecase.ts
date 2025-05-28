import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../ports/out/customer-repository.port';
import { Customer } from '../../domain/entities/customer.entity';

@Injectable()
export class GetCustomerByIdUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepo: CustomerRepositoryPort,
  ) {}

  async execute(customerId: string): Promise<Customer> {
    const customer = await this.customerRepo.findById(customerId);

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    return customer;
  }
}
