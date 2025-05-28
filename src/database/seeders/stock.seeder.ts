import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockOrmEntity } from 'src/modules/stock/infrastructure/entities/stock.orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockSeeder {
  constructor(
    @InjectRepository(StockOrmEntity)
    private readonly stockRepo: Repository<StockOrmEntity>,
  ) {}

  async seed(): Promise<void> {
    const existingProducts = await this.stockRepo.count();

    if (existingProducts > 0) {
      console.log('Products already exist, skipping seed...');
      return;
    }

    const dummyProducts = [
      {
        id: 'PROD-001',
        name: 'Xbox Series X',
        quantity: 100,
        description: 'Experience next-gen 4K gaming at 120 FPS',
        price: 499.99,
      },
      {
        id: 'PROD-002',
        name: 'Xbox Series S',
        quantity: 40,
        price: 299.99,
        description: 'All-digital 1440p gaming',
      },
    ];

    await this.stockRepo.save(dummyProducts);
    console.log(`✅ Seeded ${dummyProducts.length} products successfully!`);
    console.log(`🔑 Postman productId to use: PROD-001`);
  }
}
