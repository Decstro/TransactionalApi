import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerOrmEntity } from '../../modules/customers/infrastructure/entities/customer.orm-entity';

@Injectable()
export class CustomerSeeder {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly customerRepo: Repository<CustomerOrmEntity>,
  ) {}

  async seed(): Promise<void> {
    const existingCustomers = await this.customerRepo.count();

    if (existingCustomers > 0) {
      console.log('Customers already exist, skipping seed...');
      return;
    }

    const dummyCustomers = [
      {
        customerId: 'CUST-001',
        name: 'Bartolomeo Kuma',
        email: 'barolomeo.thegoat@example.com',
        age: 28,
      },
      {
        customerId: 'CUST-002',
        name: 'Gold D. Roger',
        email: 'gold.d.roger@example.com',
        age: 34,
      },
    ];

    await this.customerRepo.save(dummyCustomers);
    console.log(`✅ Seeded ${dummyCustomers.length} customers successfully!`);
    console.log(`🔑 Frontend customer ID to use: CUST-001`);
  }
}
