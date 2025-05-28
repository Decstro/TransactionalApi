import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './config/database.config';
import { StockModule } from './modules/stock/stocks.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { StockSeeder } from './database/seeders/stock.seeder';
import { DatabaseSeeder } from './database/seeders/database.seeder';
import { StockOrmEntity } from './modules/stock/infrastructure/entities/stock.orm-entity';
import { CustomersModule } from './modules/customers/customers.module';
import { DeliveriesModule } from './modules/deliveries/deliveries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ...configService.get('database'),
        entities: [__dirname + '/**/*.orm-entity.{js,ts}'],
      }),
    }),
    TypeOrmModule.forFeature([StockOrmEntity]),
    // Modules
    TransactionsModule,
    StockModule,
    CustomersModule,
    DeliveriesModule,
  ],
  providers: [StockSeeder, DatabaseSeeder],
})
export class AppModule {}
