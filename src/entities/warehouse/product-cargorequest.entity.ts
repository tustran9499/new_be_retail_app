import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  @Entity('ProductCargoRequest')
  export class ProductCargoRequest {
    @Column()
    ProductId: number;
  
    @Column()
    CargoRequestId: number;
      
    @Column()
    Quantity: number;
  }
  