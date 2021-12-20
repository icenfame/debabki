import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  categories: any = [];
  summary: any = [];
  dateRange: string = '1 month';

  chartData: ChartData = {
    labels: ['Доходи', 'Витрати'],
    datasets: [
      {
        data: [],
        backgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
        hoverBackgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
        hoverBorderColor: '#000',
      },
    ],
  };
  chartOptions: ChartOptions = {
    color: '#fff',
  };

  constructor(private http: HttpClient) {}

  // Init
  ngOnInit(): void {
    console.log('INIT');

    this.getData();
  }

  // Get data
  getData(): void {
    console.log('GET DATA');

    this.http.get(`/categories/${this.dateRange}`).subscribe((res) => {
      this.categories = res;
    });

    this.http.get(`/summary/${this.dateRange}`).subscribe((res) => {
      this.summary = res;

      this.chartData.datasets[0].data = [
        this.summary.income,
        this.summary.outcome,
      ];
    });
  }

  // Set date range
  setDateRange(): void {
    console.log('SET DATE');

    this.getData();
  }
}
