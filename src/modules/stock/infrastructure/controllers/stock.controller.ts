import { Get, Body, Controller } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetProductStockUseCase } from '../../application/use-cases/get-product-stock.usecase';

@ApiTags('stock')
@Controller('stock')
export class StockController {
  constructor(
    private readonly getProductStockUseCase: GetProductStockUseCase,
  ) {}

  @Get(':productId')
  @ApiOperation({ summary: 'Get product stock' })
  @ApiBody({
    schema: {
      example: {
        productId: 'product-uuid',
      },
    },
    description: 'Product ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product stock retrieved successfully',
    schema: {
      example: {
        productId: 'product-uuid',
        quantity: 100,
        reserved: 0,
      },
    },
  })
  async get(@Body() body: { productId: string }) {
    return this.getProductStockUseCase.execute(body.productId);
  }
}
