import { Injectable } from '@nestjs/common';
import { StockSeeder } from './stock.seeder';
import { CustomerSeeder } from './customer.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(
    private readonly stockSeeder: StockSeeder,
    private readonly customerSeeder: CustomerSeeder,
  ) {}

  async run(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      await this.stockSeeder.seed();
      await this.customerSeeder.seed();
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}
