import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartData } from 'chart.js';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

interface ChartObject {
  data: ChartData;
  options: ChartOptions;
  show: boolean;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  categories: any = [];
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

  // Summary chart
  summaryChart: ChartObject = {
    data: {
      labels: ['Доходи, грн.', 'Витрати, грн.'],
      datasets: [
        {
          data: [],
          backgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
          hoverBackgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
          hoverBorderColor: '#000',
        },
      ],
    },
    options: {
      color: '#fff',
      plugins: {
        title: {
          display: true,
          text: 'Відношення доходів до витрат',
          color: '#fff',
        },
      },
    },
    show: false,
  };

  // Categories income chart
  categoriesIncomeChart: ChartObject = {
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          hoverBorderColor: '#000',
        },
      ],
    },
    options: {
      color: '#fff',
      plugins: {
        title: {
          display: true,
          text: 'Доходи по категоріях',
          color: '#fff',
        },
      },
    },
    show: false,
  };

  // Categories outcome chart
  categoriesOutcomeChart: ChartObject = {
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          hoverBorderColor: '#000',
        },
      ],
    },
    options: {
      color: '#fff',
      plugins: {
        title: {
          display: true,
          text: 'Витрати по категоріях',
          color: '#fff',
        },
      },
    },
    show: false,
  };

  // Income/outcome chart
  // incomeOutcomeChart: ChartObject = {
  //   data: {
  //     labels: [
  //       '15.12.2021',
  //       '16.12.2021',
  //       '17.12.2021',
  //       '18.12.2021',
  //       '19.12.2021',
  //       '20.12.2021',
  //     ],
  //     datasets: [
  //       {
  //         label: 'Доходи',
  //         data: [100, 200, 300, 400, 50, 15],
  //         // backgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
  //         // hoverBackgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
  //         // hoverBorderColor: '#000',
  //         tension: 0.3,
  //         // fill: false,
  //       },
  //       // {
  //       //   data: [],
  //       //   backgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
  //       //   hoverBackgroundColor: ['rgb(105, 240, 174)', 'rgb(244, 67, 54)'],
  //       //   hoverBorderColor: '#000',
  //       // },
  //     ],
  //   },
  //   options: {
  //     color: '#fff',
  //     plugins: {
  //       title: {
  //         display: true,
  //         text: 'Витрати та доходи',
  //         color: '#fff',
  //       },
  //     },
  //     scales: {
  //       x: {
  //         ticks: {
  //           color: '#fff',
  //         },
  //       },
  //       y: {
  //         ticks: {
  //           color: '#fff',
  //         },
  //       },
  //     },
  //   },
  //   show: false,
  // };

  constructor(private http: HttpClient) {}

  // Init
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

      this.summaryChart.data.datasets[0].data = [
        this.summary.income,
        this.summary.outcome,
      ];

      this.summaryChart.show = true;
    });

    // Get categories
    this.http.get(`/categories/${start}/${end}`).subscribe((res) => {
      this.categories = res;

      // Income
      const categoriesIncome = this.categories.filter(
        (category: any) => category.income > 0
      );

      // Labels
      this.categoriesIncomeChart.data.labels = categoriesIncome.map(
        (category: any) => category.name
      );
      // Dataset
      this.categoriesIncomeChart.data.datasets[0].data = categoriesIncome.map(
        (category: any) => category.income
      );

      // Outcome
      const categoriesOutcome = this.categories.filter(
        (category: any) => category.outcome < 0
      );

      // Labels
      this.categoriesOutcomeChart.data.labels = categoriesOutcome.map(
        (category: any) => category.name
      );
      // Dataset
      this.categoriesOutcomeChart.data.datasets[0].data = categoriesOutcome.map(
        (category: any) => category.outcome
      );

      this.categoriesIncomeChart.show = true;
      this.categoriesOutcomeChart.show = true;
    });

    // Get transactions
    // this.http.get('/transactions').subscribe((res: any) => {
    // this.incomeOutcomeChart.data.datasets[0].data = [100, 200, 300];
    // this.incomeOutcomeChart.data.datasets[1].data = [10, 20, 30, 40, 60];
    // this.incomeOutcomeChart.data.datasets[1].data = [
    // this.summary.income,
    // this.summary.outcome,
    // ];

    // this.incomeOutcomeChart.show = true;
    // });
  }

  // Date range change
  dateRangeChange(event: any = null): void {
    if (!event.value) return;

    this.summaryChart.show = false;
    this.categoriesIncomeChart.show = false;
    this.categoriesOutcomeChart.show = false;

    // this.incomeOutcomeChart.show = false;

    this.getData();
  }
}
