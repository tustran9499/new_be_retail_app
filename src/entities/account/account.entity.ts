import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Order } from "../order/order.entity";
import { Store } from "../store/store.entity";
import { Session } from "../session/session.entity";
import { CargoRequest } from "../warehouse/cargorequest.entity";
import { UserNotification } from "../notification/notification.entity";

@Entity("Account")
export class Account {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  FName: string;

  @Column()
  LName: string;

  @Column()
  Email: string;

  @Column()
  Title: string;

  @Column()
  TitleOfCourtesy: string;

  @Column()
  ReportsTo: number;

  @Column()
  Username: string;

  @Column()
  Password: string;

  @Column()
  Birthday: string;

  @Column()
  HireDate: string;

  @Column()
  Homephone: string;

  @Column()
  Extension: string;

  @Column()
  PhotoURL: string;

  @Column()
  Notes: string;

  @Column()
  Type: string;

  @Column()
  Country: string;

  @Column()
  PostalCode: string;

  @Column()
  Region: string;

  @Column()
  City: string;

  @Column()
  Address: string;

  @Column()
  EmailVerified: boolean;

  @Column()
  AdminVerified: boolean;

  @Column()
  HashedPW: string;

  @DeleteDateColumn()
  DeletedAt?: Date;

  @OneToMany(() => Order, (Order) => Order.Account)
  Orders: Order[];

  @OneToMany(() => Session, (Session) => Session.Account)
  Sessions: Session[];

  @OneToMany(
    () => UserNotification,
    (UserNotification) => UserNotification.Account
  )
  UserNotifications: UserNotification[];

  @Column({ name: "StoreId" })
  StoreId: number;

  @Column({ name: "WarehouseId" })
  WarehouseId: number;

  @ManyToOne(() => Store, (Store) => Store.Accounts, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "StoreId", referencedColumnName: "Id" })
  Store: Store;

  @OneToMany(() => CargoRequest, (order) => order.CreatedByAccount)
  orders: CargoRequest[];
}
