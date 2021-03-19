import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
    UserName: string;

    @Column()
    Password: string;

    /*Comment this because it take too long to get data*/
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
}