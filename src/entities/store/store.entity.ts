import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { Account } from '../account/account.entity';
import { StoreProduct } from '../storeproduct/storeproduct.entity';

@Entity('Store')
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
    ShortName: string;

    @Column()
    WarehouseId: number;

    @OneToMany(() => Account, Account => Account.Store)
    Accounts: Account[];

    @OneToMany(() => StoreProduct, StoreProduct => StoreProduct.Store)
    StoreProducts: StoreProduct[];

}
