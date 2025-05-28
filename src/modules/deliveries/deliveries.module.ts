import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryController } from './infrastructure/controllers/delivery.controller';
import { GetDeliveryByIdUseCase } from './application/use-cases/get-delivery-by-id.usecase';
import { DeliveryRepository } from './infrastructure/repositories/delivery.repository';
import { DeliveryOrmEntity } from './infrastructure/entities/delivery.orm-entity';

const deliveryRepoProvider = {
  provide: 'DeliveryRepositoryPort',
  useClass: DeliveryRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrmEntity])],
  controllers: [DeliveryController],
  providers: [GetDeliveryByIdUseCase, deliveryRepoProvider],
  exports: [deliveryRepoProvider],
})
export class DeliveriesModule {}
