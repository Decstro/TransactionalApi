import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryColumn()
  customerId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
