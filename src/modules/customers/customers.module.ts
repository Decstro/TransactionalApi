import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.usecase';
import { CustomerRepository } from './infrastructure/repositories/customer.repository';
import { CustomerOrmEntity } from './infrastructure/entities/customer.orm-entity';

const customerRepoProvider = {
  provide: 'CustomerRepositoryPort',
  useClass: CustomerRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomerController],
  providers: [GetCustomerByIdUseCase, customerRepoProvider],
  exports: [customerRepoProvider],
})
export class CustomersModule {}
