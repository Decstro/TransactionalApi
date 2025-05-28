import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrmEntity } from './infrastructure/entities/stock.orm-entity';
import { StockController } from './infrastructure/controllers/stock.controller';
import { GetProductStockUseCase } from './application/use-cases/get-product-stock.usecase';
import { StockRepository } from './infrastructure/repositories/stock.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StockOrmEntity])],
  controllers: [StockController],
  providers: [
    GetProductStockUseCase,
    {
      provide: 'StockRepositoryPort',
      useClass: StockRepository,
    },
  ],
})
export class StockModule {}
