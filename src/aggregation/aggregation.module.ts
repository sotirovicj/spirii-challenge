import { Module } from '@nestjs/common';
import { AggregationService } from './aggregation.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { AggregationController } from './aggregation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aggregation } from './aggregation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aggregation])],
  controllers: [AggregationController],
  providers: [AggregationService, TransactionService],
})
export class AggregationModule {}
