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
    Title: string;

    @Column()
    TitleOfCourtesy: string;

    @Column()
    ReportsTo: number;

    @Column()
    UserName: string;

    @Column()
    Password: string;

    @Column()
    Type: string;
}