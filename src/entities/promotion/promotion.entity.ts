import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity('Promotion')
export class Promotion {
    @PrimaryGeneratedColumn()
    Coupon: number;

    @Column()
    StartTime: Date;

    @Column()
    EndTime: Date;

    @Column({ nullable: true, default: null })
    Description: string;

    @Column()
    PercentOff: number;

}
