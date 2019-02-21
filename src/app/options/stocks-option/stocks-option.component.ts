import { Component, ViewChild, Output, EventEmitter } from '@angular/core';

import { defaultStocksSymbols } from './stocks-option.mock';
import { IdItem, StockDateValue, StockInfo } from '../../shared/types';
import { AlphavantageApiService } from '../../shared/alphavantage-api.service';

@Component({
  selector: 'app-stocks-option',
  templateUrl: './stocks-option.component.html',
  styleUrls: ['./stocks-option.component.css']
})
export class StocksOptionComponent {
  @Output() added = new EventEmitter<StockInfo>();
  @Output() removed = new EventEmitter<string>();

  @ViewChild('stocksSelectRef') stocksSelectRef;

  options: IdItem[] = defaultStocksSymbols.map(id => ({ id }));

  selected: IdItem[] = [];

  constructor(private alphavantageApi: AlphavantageApiService) {}

  onAdd(id: string) {
    const item: IdItem = { id };
    this.options.push(item);
    this.selected.push(item);
    this.onSelect(item);
  }

  onSelect({ id }: IdItem) {
    this.stocksSelectRef.closeDropdown();
    this.alphavantageApi.fetchStock(id).subscribe(
      (dateValues: StockDateValue[]) => {
        this.added.emit({ symbol: id, dateValues });
      },
      error => {
        this.selected = this.selected.slice(0, this.selected.length - 1);
        alert(`${error.message} - The symbol will be deselected.`);
      }
    );
  }

  onDeSelect({ id }: IdItem) {
    this.stocksSelectRef.closeDropdown();
    this.removed.emit(id);
  }
}
