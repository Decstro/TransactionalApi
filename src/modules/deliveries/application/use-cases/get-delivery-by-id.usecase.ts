import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryRepositoryPort } from '../../ports/out/delivery-repository.port';
import { Delivery } from '../../domain/entities/delivery.entity';

@Injectable()
export class GetDeliveryByIdUseCase {
  constructor(
    @Inject('DeliveryRepositoryPort')
    private readonly deliveryRepo: DeliveryRepositoryPort,
  ) {}

  async execute(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepo.findById(id);

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }
}
