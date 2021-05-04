import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('Account')
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
  StoreId: number;

  @DeleteDateColumn()
  DeletedAt?: Date;
}
