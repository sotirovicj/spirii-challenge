import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionType,
  transactionTypes,
} from './transaction.entity';
import { Cron } from '@nestjs/schedule';
import { EventEmitter } from 'events';

export type TransactionMetadata = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

export type TransactionsResponse = {
  items: Transaction[];
  metadata: TransactionMetadata;
};

interface ITransactionService {
  getTransactionsFromApi(
    startDate: string,
    endDate: string,
  ): Promise<TransactionsResponse>;
}

const mockUsers = ['user1', 'user2', 'user3'];

export class TransactionService implements ITransactionService {
  private eventEmitter = new EventEmitter();

  getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findTransactionById(id: string): Promise<Transaction | undefined> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async findTransactionsByUserIdAndType(
    userId: string,
    type: TransactionType,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { id: userId, type } });
  }

  async createTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }

  @Cron('*/15 * * * * *')
  async fetchTransactions() {
    const now = new Date();
    const transactions = await this.getTransactionsFromApi(
      now.toISOString(),
      new Date(now.getTime() - 30 * 1000).toISOString(),
    );
    if (transactions.items.length === 0) {
      console.log('No transactions found');
      return;
    }
    transactions.items.map((transaction) => {
      this.handleTransaction(transaction);
    });
  }

  async handleTransaction(transaction: Transaction) {
    const existingTransaction = await this.findTransactionById(transaction.id);
    if (existingTransaction) {
      console.log('Transaction already exists:', transaction);
      return;
    }
    await this.createTransaction(transaction);
    this.eventEmitter.emit('transaction.created', transaction);

    console.log('New transaction created:', transaction);
  }

  // Returns mocked data
  async getTransactionsFromApi(
    startDate: string,
    endDate: string,
  ): Promise<TransactionsResponse> {
    return {
      items: Array.from({ length: 10 }, () => ({
        id: faker.string.uuid(),
        userId: mockUsers[Math.floor(Math.random() * 3)],
        createdAt: faker.date.between({ from: startDate, to: endDate }),
        type: transactionTypes[
          Math.floor(Math.random() * 3)
        ] as TransactionType,
        amount: faker.number.int({ min: 1, max: 1000 }),
      })),
      metadata: {
        totalItems: 10,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
}
