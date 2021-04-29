import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('CargoRequest')
export class CargoRequest {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  RequestId: string;

  @Column()
  WarehouseId: number;

  @Column()
  StoreId: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @Column()
  CancelledAt: Date;

  @UpdateDateColumn()
  UpdatedAt: Date;

  @Column()
  Notes: string;

  @Column()
  CreatedBy: number;

  @Column()
  CancelledBy: number;

  @Column()
  UpdatedBy: number;
}
