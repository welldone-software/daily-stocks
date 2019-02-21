import { NgModule } from '@angular/core';
import {
  ChartModule as HighchartsChartModule,
  HIGHCHARTS_MODULES
} from 'angular-highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';

@NgModule({
  declarations: [ChartComponent],
  imports: [CommonModule, HighchartsChartModule],
  exports: [ChartComponent],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [NoDataToDisplay] }
  ]
})
export class ChartModule {}
