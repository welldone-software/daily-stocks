import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StockDateValue } from './types';

const API_KEY = 'P7XMUYLJO0GX8PFD';

@Injectable({
  providedIn: 'root'
})
export class AlphavantageApiService {
  constructor(private http: HttpClient) {}

  fetchStock(symbol: string): Observable<StockDateValue[]> {
    return this.http
      .get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      )
      .pipe(
        map(data => {
          // if (data['Error Message']) {
          //   console.warn(data);
          //   throw new Error('Api Error');
          // }
          const dates = data[`Time Series (Daily)`];
          if (!dates) {
            throw new Error('Unexpected response without data.');
          }
          return dates;
        }),
        map(dates => {
          return Object.keys(dates)
            .sort()
            .map(date => ({
              date: new Date(date),
              metrics: {
                open: Number(dates[date]['1. open']),
                high: Number(dates[date]['2. high']),
                low: Number(dates[date]['3. low']),
                close: Number(dates[date]['4. close']),
                volume: Number(dates[date]['5. volume'])
              }
            }));
        })
      );
  }
}
