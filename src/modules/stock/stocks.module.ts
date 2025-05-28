import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrmEntity } from './infrastructure/entities/stock.orm-entity';
import { StockController } from './infrastructure/controllers/stock.controller';
import { GetProductStockUseCase } from './application/use-cases/get-product-stock.usecase';
import { StockRepository } from './infrastructure/repositories/stock.repository';

const stockRepoProvider = {
  provide: 'StockRepositoryPort',
  useClass: StockRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([StockOrmEntity])],
  controllers: [StockController],
  providers: [GetProductStockUseCase, stockRepoProvider],
  exports: [stockRepoProvider],
})
export class StockModule {}
