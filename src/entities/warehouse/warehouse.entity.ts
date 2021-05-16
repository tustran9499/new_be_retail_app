import { DeleteDateColumn } from 'typeorm';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Account } from '../account/account.entity';
import { Product } from '../product/product.entity';
import { CargoRequest } from './cargorequest.entity';

@Entity('Warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Phone: string;

  @Column()
  Fax: string;

  @Column()
  Email: string;

  @Column()
  Address: string;

  @Column()
  City: string;

  @Column()
  Region: string;

  @Column()
  Country: string;

  @Column()
  PostalCode: string;

  @Column()
  WarehouseSize: string;

  @Column()
  SpaceAvailable: number;

  @Column()
  ShortName: string;

  @Column({ type: 'float' })
  AddressCoorLat: number;

  @Column({ type: 'float' })
  AddressCoorLong: number;

  @DeleteDateColumn()
  DeletedAt?: Date;

  @OneToMany(() => CargoRequest, order => order.Warehouse)
  orders: CargoRequest[];
}
