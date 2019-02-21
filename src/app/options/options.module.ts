import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { OptionsComponent } from './options.component';
import { StocksOptionComponent } from './stocks-option/stocks-option.component';
import { ThresholdOptionComponent } from './threshold-option/threshold-option.component';
import { MetricOptionComponent } from './metric-option/metric-option.component';

@NgModule({
  declarations: [
    OptionsComponent,
    StocksOptionComponent,
    ThresholdOptionComponent,
    MetricOptionComponent
  ],
  imports: [CommonModule, FormsModule, AngularMultiSelectModule],
  exports: [OptionsComponent]
})
export class OptionsModule {}
