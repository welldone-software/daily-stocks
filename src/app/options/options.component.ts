import { Component, OnInit } from '@angular/core';
import { Metric, StockInfo } from '../shared/types';
import { StocksDataService } from '../shared/stocks-data.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {
  constructor(public stocksDataService: StocksDataService) {}

  onMetricChagned(value: Metric) {
    this.stocksDataService.metric = value;
  }
  onThresholdChagned(value: number) {
    this.stocksDataService.threshold = value;
  }
  onStockAdded(stockInfo: StockInfo) {
    this.stocksDataService.addStock(stockInfo);
  }
  onStockRemoved(symbol: string) {
    this.stocksDataService.removeStock(symbol);
  }
}
