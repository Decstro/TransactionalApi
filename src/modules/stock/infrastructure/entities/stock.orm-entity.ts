import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class StockOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column('text')
  description: string;

  @Column('simple-array')
  images: string[];

  @Column('numeric')
  rating: number;
}
