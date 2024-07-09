import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { AggregationService } from './aggregation.service';

@Controller('aggregation')
export class AggregationController {
  constructor(
    private readonly aggregationService: AggregationService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get(':id')
  getAggregationByUserId(@Param('id') id: string) {
    this.aggregationService.getAggregationByUserId(id);
  }
}

export default AggregationController;
