import { TransactionService } from 'src/transaction/transaction.service';
import { Repository } from 'typeorm';
import { Aggregation } from './aggregation.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class AggregationService {
  constructor(
    private readonly transactionService: TransactionService,

    @InjectRepository(Aggregation)
    private aggregationRepository: Repository<Aggregation>,
  ) {
    this.listenToTransactionEvents();
  }

  private listenToTransactionEvents(): void {
    this.transactionService
      .getEventEmitter()
      .on('transaction.created', (transaction) => {
        this.handleTransactionCreated(transaction);
      });
  }

  async handleTransactionCreated(transaction) {
    console.log('New transaction created, updating aggregations');
    await this.updateAggregation(transaction);
  }

  async updateAggregation(transaction) {
    const { userId, type, amount } = transaction;
    const formattedAmount = amount * 100;
    const aggregation = await this.aggregationRepository.findOne({
      where: { id: userId },
    });

    if (aggregation) {
      if (type === 'earn') {
        aggregation.earned += formattedAmount;
        aggregation.balance += formattedAmount;
      } else if (type === 'spend') {
        aggregation.spent += formattedAmount;
        aggregation.balance -= formattedAmount;
      } else if (type === 'payout') {
        aggregation.payout += formattedAmount;
        aggregation.balance -= formattedAmount;
      }

      return this.aggregationRepository.save(aggregation);
    } else {
      const newAggregation = this.aggregationRepository.create({
        id: userId,
        earned: type === 'earn' ? formattedAmount : 0,
        spent: type === 'spend' ? formattedAmount : 0,
        payout: type === 'payout' ? formattedAmount : 0,
      });

      console.log('New aggregation created:', newAggregation);
      return this.aggregationRepository.save(newAggregation);
    }
  }

  async getAggregationByUserId(userId: string) {
    return this.aggregationRepository.findOne({ where: { id: userId } });
  }

  async getPayoutsByUserId(userId: string): Promise<number> {
    const payouts =
      await this.transactionService.findTransactionsByUserIdAndType(
        userId,
        'payout',
      );
    const amount = payouts.reduce((acc, payout) => acc + payout.amount, 0);
    return amount / 100;
  }
}
