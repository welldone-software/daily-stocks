import { Component, OnInit } from '@angular/core';
import { formatNumber } from '@angular/common';
import { Chart } from 'angular-highcharts';
import { StocksDataService } from '../shared/stocks-data.service';
import { StockDataChanges } from '../shared/types';

const DUMMY_SERIES: any = {
  type: 'spline',
  name: 'dummy',
  showInLegend: false,
  enableMouseTracking: false,
  marker: {
    enabled: false
  }
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  chart = new Chart({
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Daily values chart'
    },
    lang: {
      noData: 'No data.'
    },
    noData: {
      style: {
        fontSize: '13px',
        fontWeight: 'normal',
        color: 'rgb(74, 74, 74)'
      }
    },
    xAxis: {
      showEmpty: true,
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%d %b %Y'
      },
      title: {
        text: 'Date'
      }
    } as any,
    tooltip: {
      headerFormat: '<b>{point.y:.2f}</b><br/>',
      pointFormat: '<i>{series.name}</i>, {point.x:%d %b %Y}'
    },
    credits: {
      enabled: false
    },
    yAxis: {
      showEmpty: true,
      title: {
        text: 'Value'
      },
      min: 0
    },
    series: []
  });

  private nativeChart = null;

  constructor(private stocksDataService: StocksDataService) {}

  ngOnInit() {
    this.chart.ref$.subscribe(nativeChart => {
      this.nativeChart = nativeChart;
      this.updateThreshold(this.stocksDataService.threshold);
      this.addDummySeriesIfNeeded();
      this.nativeChart.redraw(false);
    });

    this.stocksDataService.changes$.subscribe(({ change, data }) => {
      switch (change) {
        case StockDataChanges.addSeries:
          this.addSeries(data);
          break;
        case StockDataChanges.removeSeries:
          this.removeSeries(data);
          break;
        case StockDataChanges.replaceAllSeries:
          this.replaceAllSeries(data);
          break;
        case StockDataChanges.updateThreshold:
          this.updateThreshold(data);
          break;
      }
    });
  }

  private updateThreshold(threshold: number) {
    this.nativeChart.update(
      {
        plotOptions: {
          series: {
            threshold
          }
        },
        yAxis: {
          minRange: threshold * 1.5,
          plotLines: [
            {
              value: threshold,
              color: 'darkred',
              dashStyle: 'shortdash',
              width: 2,
              label: {
                text: `<b>Threshold</b> (${formatNumber(threshold, 'en')})`
              }
            }
          ]
        }
      },
      false
    );
    this.removeFirstDummyIfNeeded();
    this.addDummySeriesIfNeeded();
    this.nativeChart.redraw(false);
  }

  private replaceAllSeries(data) {
    while (this.nativeChart.series.length > 0) {
      this.nativeChart.series[0].remove(false);
    }
    data.forEach(dataItem => {
      this.addSeries(dataItem, false);
    });
    this.addDummySeriesIfNeeded();
    this.nativeChart.redraw(false);
  }

  private removeSeries(symbol: string) {
    this.nativeChart.get(symbol).remove(false);
    this.addDummySeriesIfNeeded();
    this.nativeChart.redraw(false);
  }

  private addSeries({ symbol, values }, redraw = true) {
    this.removeFirstDummyIfNeeded();
    this.nativeChart.addSeries(
      {
        type: 'spline',
        name: symbol,
        id: symbol,
        data: values,
        negativeColor: 'darkred'
      },
      redraw
    );
  }

  private removeFirstDummyIfNeeded() {
    const first = this.nativeChart.series[0];
    if (first && first.name === 'dummy') {
      first.remove(false);
    }
  }

  private addDummySeriesIfNeeded() {
    if (this.nativeChart.series.length === 0) {
      this.nativeChart.addSeries(
        {
          ...DUMMY_SERIES,
          data: [{ y: this.stocksDataService.threshold * 2 }]
        },
        false
      );
    }
  }
}
