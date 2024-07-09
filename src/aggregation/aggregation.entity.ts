import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Aggregation')
export class Aggregation {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  id: string;

  @Column({ type: 'integer', nullable: true, default: 0 })
  balance: number;

  @Column({ type: 'integer', nullable: true, default: 0 })
  earned: number;

  @Column({ type: 'integer', nullable: true, default: 0 })
  spent: number;

  @Column({ type: 'integer', nullable: true, default: 0 })
  payout: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
