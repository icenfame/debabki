import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  summary: any = [];
  dateRange = new FormGroup({
    start: new FormControl(
      JSON.parse(localStorage.getItem('dateRange') ?? '[]')?.start ??
        moment().subtract(2, 'week').toISOString()
    ),
    end: new FormControl(
      JSON.parse(localStorage.getItem('dateRange') ?? '[]')?.end ??
        moment().toISOString()
    ),
  });

  @Output() dateChange = new EventEmitter<Object>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getData();
  }

  // Get data
  getData(): void {
    const start = moment(this.dateRange.controls['start'].value).toISOString();
    const end = moment(this.dateRange.controls['end'].value).toISOString();

    // Get summary
    this.http.get(`/summary/${start}/${end}`).subscribe((res) => {
      this.summary = res;

      this.dateChange.emit({ start, end, summary: this.summary });
    });
  }

  // Date rage change
  dateRangeChange(event: any = null): void {
    if (!event.value) return;

    const start = moment(this.dateRange.controls['start'].value).toISOString();
    const end = moment(this.dateRange.controls['end'].value).toISOString();

    localStorage.setItem('dateRange', JSON.stringify({ start, end }));
    this.getData();
  }
}