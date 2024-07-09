import { Entity, Column, PrimaryColumn } from 'typeorm';

export const transactionTypes = ['earned', 'spent', 'payout'] as const;
export type TransactionType = (typeof transactionTypes)[number];

@Entity('Transaction')
export class Transaction {
  @PrimaryColumn({ type: 'varchar', nullable: false })
  id: string;

  @PrimaryColumn({ type: 'varchar', nullable: false })
  userId: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: false })
  type: TransactionType;

  @Column({ type: 'integer', nullable: false })
  amount: number;
}
