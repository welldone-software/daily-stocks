import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Metric, IdItem } from '../../shared/types';

const METRIC_NAMES = Object.keys(Metric);

@Component({
  selector: 'app-metric-option',
  templateUrl: './metric-option.component.html',
  styleUrls: ['./metric-option.component.css']
})
export class MetricOptionComponent implements OnInit {
  @Input() value: Metric;
  @Output() changed = new EventEmitter<Metric>();

  options: IdItem[] = METRIC_NAMES.map(id => ({ id }));

  selected: IdItem[] = [];

  constructor() {}

  ngOnInit() {
    if (!this.value) {
      console.warn('"value" is a required protperty.');
    }
    this.selected = [{ id: this.value || METRIC_NAMES[0] }];
  }

  onMetricDeSelect(item: IdItem) {
    this.selected = [item];
  }

  onMetricSelect({ id }: IdItem) {
    this.changed.emit(id as Metric);
  }
}
