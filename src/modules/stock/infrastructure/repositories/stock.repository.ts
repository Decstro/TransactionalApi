import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockRepositoryPort } from '../../ports/out/stock-repository.port';
import { Stock } from '../../domain/entities/stock.entity';
import { StockOrmEntity } from '../entities/stock.orm-entity';

@Injectable()
export class StockRepository implements StockRepositoryPort {
  constructor(
    @InjectRepository(StockOrmEntity)
    private readonly repo: Repository<StockOrmEntity>,
  ) {}

  async findById(productId: string): Promise<Stock | null> {
    const entity = await this.repo.findOne({ where: { id: productId } });
    if (!entity) return null;
    return new Stock(
      entity.id,
      entity.name,
      entity.price,
      entity.quantity,
      entity.description,
    );
  }

  async decrementStock(productId: string, quantity: number): Promise<void> {
    await this.repo.decrement({ id: productId }, 'quantity', quantity);
  }
}
