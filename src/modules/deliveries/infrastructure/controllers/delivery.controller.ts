import { Controller, Get, Param } from '@nestjs/common';
import { GetDeliveryByIdUseCase } from '../../application/use-cases/get-delivery-by-id.usecase';

@Controller('deliveries')
export class DeliveryController {
  constructor(
    private readonly getDeliveryByIdUseCase: GetDeliveryByIdUseCase,
  ) {}

  @Get(':id')
  async getDeliveryById(@Param('id') id: string) {
    return await this.getDeliveryByIdUseCase.execute(id);
  }
}
