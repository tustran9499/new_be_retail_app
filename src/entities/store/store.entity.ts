import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  PrimaryColumn,
  OneToMany,
} from "typeorm";
import { Account } from "../account/account.entity";
import { StoreProduct } from "../storeproduct/storeproduct.entity";
import { CargoRequest } from "../warehouse/cargorequest.entity";

@Entity("Store")
export class Store {
  @PrimaryColumn()
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
  Size: string;

  @Column()
  Price: number;

  @Column()
  ShortName: string;

  @Column()
  WarehouseId: number;

  @OneToMany(() => Account, (Account) => Account.Store)
  Accounts: Account[];

  @OneToMany(() => StoreProduct, (StoreProduct) => StoreProduct.Store)
  StoreProducts: StoreProduct[];

  @Column({ type: "float" })
  AddressCoorLat: number;

  @Column({ type: "float" })
  AddressCoorLong: number;

  @DeleteDateColumn()
  DeletedAt?: Date;

  @OneToMany(() => CargoRequest, (order) => order.Store)
  orders: CargoRequest[];
}
