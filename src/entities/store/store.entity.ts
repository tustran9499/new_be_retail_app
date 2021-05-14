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
  
  @Entity('Store')
  export class Store {
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
    Size: string;

    @Column()
    Price: number;

    @Column()
    ShortName: string;

    @Column()
    WarehouseId: string;

    @Column({ type: 'float' })
    AddressCoorLat: number;

    @Column({ type: 'float' })
    AddressCoorLong: number;

    @DeleteDateColumn()
    DeletedAt?: Date;
  }
  