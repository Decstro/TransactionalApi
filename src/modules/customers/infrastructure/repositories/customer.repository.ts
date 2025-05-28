import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepositoryPort } from '../../ports/out/customer-repository.port';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repo: Repository<CustomerOrmEntity>,
  ) {}

  async findById(customerId: string): Promise<Customer | null> {
    const entity = await this.repo.findOne({ where: { customerId } });
    if (!entity) return null;

    return new Customer(
      entity.customerId,
      entity.name,
      entity.email,
      entity.age,
    );
  }

  async save(customer: Customer): Promise<Customer> {
    await this.repo.save(customer);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const entities = await this.repo.find();
    return entities.map(
      (entity) =>
        new Customer(entity.customerId, entity.name, entity.email, entity.age),
    );
  }

  async delete(customerId: string): Promise<void> {
    await this.repo.delete(customerId);
  }
}
