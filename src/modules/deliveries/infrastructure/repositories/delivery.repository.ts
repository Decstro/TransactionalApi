import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryRepositoryPort } from '../../ports/out/delivery-repository.port';
import { Delivery } from '../../domain/entities/delivery.entity';
import { DeliveryOrmEntity } from '../entities/delivery.orm-entity';

@Injectable()
export class DeliveryRepository implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly repo: Repository<DeliveryOrmEntity>,
  ) {}

  async findById(id: string): Promise<Delivery | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;

    return new Delivery(
      entity.id,
      entity.transactionId,
      entity.customerName,
      entity.customerId,
      entity.shippingAddress,
    );
  }

  async save(delivery: Delivery): Promise<Delivery> {
    await this.repo.save(delivery);
    return delivery;
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const entity = await this.repo.findOne({ where: { transactionId } });
    if (!entity) return null;

    return new Delivery(
      entity.id,
      entity.transactionId,
      entity.customerName,
      entity.customerId,
      entity.shippingAddress,
    );
  }

  async findByCustomerId(customerId: string): Promise<Delivery[]> {
    const entities = await this.repo.find({ where: { customerId } });
    return entities.map(
      (entity) =>
        new Delivery(
          entity.id,
          entity.transactionId,
          entity.customerName,
          entity.customerId,
          entity.shippingAddress,
        ),
    );
  }

  async findAll(): Promise<Delivery[]> {
    const entities = await this.repo.find();
    return entities.map(
      (entity) =>
        new Delivery(
          entity.id,
          entity.transactionId,
          entity.customerName,
          entity.customerId,
          entity.shippingAddress,
        ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
