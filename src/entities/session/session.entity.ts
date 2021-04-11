import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';

@Entity('Shift')
export class Session {
    @PrimaryGeneratedColumn("uuid")
    SessionId: string;

    @Column()
    Start: Date;

    @Column({ nullable: true, default: null })
    End: Date;

    @Column({ nullable: true, default: null })
    Type: string;

    @Column()
    SaleclerkId: number;

}
