import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepositoryPort } from '../../ports/out/transaction-repository.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { TransactionStatus } from '../../domain/entities/transaction.entity'; // Add this import

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repo: Repository<TransactionOrmEntity>,
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    await this.repo.save(transaction);
    return transaction;
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repo.update(id, { status });
  }

  async findById(id: string): Promise<Transaction | null> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) return null;

    return new Transaction(
      entity.id,
      entity.customerId,
      entity.status,
      entity.amount,
      entity.createdAt,
    );
  }

  async findByCustomerId(customerId: string): Promise<Transaction[]> {
    const entities = await this.repo.find({ where: { customerId } });
    return entities.map(
      (entity) =>
        new Transaction(
          entity.id,
          entity.customerId,
          entity.status,
          entity.amount,
          entity.createdAt,
        ),
    );
  }

  async findAll(): Promise<Transaction[]> {
    const entities = await this.repo.find();
    return entities.map(
      (entity) =>
        new Transaction(
          entity.id,
          entity.customerId,
          entity.status,
          entity.amount,
          entity.createdAt,
        ),
    );
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
