export interface IdItem {
  id: string;
}

export enum Metric {
  open = 'open',
  high = 'high',
  low = 'low',
  close = 'close',
  volume = 'volume'
}

// type Metrics = { [key in Metric]: number };

export interface StockDateValue {
  date: Date;
  metrics: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
}

export interface StockInfo {
  symbol: string;
  dateValues: StockDateValue[];
}

export enum StockDataChanges {
  updateThreshold = 'updateThreshold',
  addSeries = 'addSeries',
  removeSeries = 'removeSeries',
  replaceAllSeries = 'replaceAllSeries'
}
