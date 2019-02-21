import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-threshold-option',
  templateUrl: './threshold-option.component.html',
  styleUrls: ['./threshold-option.component.css']
})
export class ThresholdOptionComponent implements OnInit {
  @Input() value;
  @Output() changed = new EventEmitter<number>();
  private thresholdSubject = new Subject<number>();

  ngOnInit() {
    this.thresholdSubject
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(v => v != null && v >= 0)
      )
      .subscribe(v => {
        this.changed.emit(v);
      });
  }

  onThresholdChange() {
    this.thresholdSubject.next(this.value);
  }
}
