import { Injectable } from '@nestjs/common';
import { StockSeeder } from './stock.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(private readonly stockSeeder: StockSeeder) {}

  async run(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      await this.stockSeeder.seed();
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}
