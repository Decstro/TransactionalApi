import { Inject } from '@nestjs/common';
import { StockRepositoryPort } from '../../ports/out/stock-repository.port';
import { Stock } from '../../domain/entities/stock.entity';

export class GetProductStockUseCase {
  constructor(
    @Inject('StockRepositoryPort')
    private readonly stockRepo: StockRepositoryPort,
  ) {}

  async execute(productId: string): Promise<{ stock: Stock }> {
    const stock = await this.stockRepo.findById(productId);

    if (!stock) {
      throw new Error('Stock not found');
    }

    return { stock };
  }
}
