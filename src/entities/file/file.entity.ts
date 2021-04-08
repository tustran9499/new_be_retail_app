import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { REFERENCE_TYPE } from './enums/referenceType.enum';
import { Min } from 'class-validator';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  Id: string;

  @UpdateDateColumn()
  UpdatedDate: Date;

  @CreateDateColumn()
  CreatedDate: Date;

  @Column({
    enum: REFERENCE_TYPE,
    nullable: true,
  })
  ReferenceType: REFERENCE_TYPE;

  @Column({
    nullable: false,
    default: 0,
  })
  @Min(0)
  ReferenceId: number;

  @Column({
    nullable: true,
  })
  Extension: string;

  @Column({
    nullable: true,
  })
  FileName: string;
}
