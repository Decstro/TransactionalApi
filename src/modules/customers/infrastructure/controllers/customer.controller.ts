import { Controller, Get, Param } from '@nestjs/common';
import { GetCustomerByIdUseCase } from '../../application/use-cases/get-customer-by-id.usecase';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
  ) {}

  @Get(':customerId')
  async getCustomerById(@Param('customerId') customerId: string) {
    return await this.getCustomerByIdUseCase.execute(customerId);
  }
}
