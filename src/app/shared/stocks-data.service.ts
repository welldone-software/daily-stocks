import { Injectable } from '@angular/core';
import { Metric, StockInfo, StockDataChanges } from './types';
import { Subject } from 'rxjs';

/**
 * Data changes broadcasting service.
 * Broadcast the changes in a format suitable for consumption by chart components.
 */
@Injectable({
  providedIn: 'root'
})
export class StocksDataService {
  private stockInfos: StockInfo[] = [];
  private _threshold = 100;
  private _metric: Metric = Metric.open;
  private changes = new Subject<{ change: StockDataChanges; data: any }>();

  changes$ = this.changes.asObservable();

  addStock(stockInfo: StockInfo) {
    const index = this.stockInfos.findIndex(i => i.symbol === stockInfo.symbol);
    if (index !== -1) {
      throw new Error(`Data for '${stockInfo.symbol}' already exists`);
    }
    this.stockInfos.push(stockInfo);
    const data = this.calcSeries(stockInfo);
    this.changes.next({ change: StockDataChanges.addSeries, data });
  }

  removeStock(symbol: string) {
    const index = this.stockInfos.findIndex(i => i.symbol === symbol);
    if (index === -1) {
      throw new Error(`Data for '${symbol}' does not exist`);
    }
    this.stockInfos.splice(index, 1);
    this.changes.next({ change: StockDataChanges.removeSeries, data: symbol });
  }

  set threshold(threshold: number) {
    this._threshold = threshold;
    this.changes.next({
      change: StockDataChanges.updateThreshold,
      data: threshold
    });
  }

  get threshold() {
    return this._threshold;
  }

  set metric(metric: Metric) {
    this._metric = metric;
    this.changes.next({
      change: StockDataChanges.replaceAllSeries,
      data: this.stockInfos.map(stockInfo => this.calcSeries(stockInfo))
    });
  }

  get metric(): Metric {
    return this._metric;
  }

  private calcSeries({ symbol, dateValues }: StockInfo) {
    return {
      symbol,
      values: dateValues.map(({ date, metrics }) => ({
        x: date,
        y: metrics[this.metric]
      }))
    };
  }
}
