import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartOptions, ChartData } from 'chart.js';

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
  dateRange: string = '1 month';

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
  chartOptions: ChartOptions = {
    color: '#fff',

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
  };

  constructor(private http: HttpClient) {}

  // Init
  ngOnInit(): void {
    this.getData();
  }

  // Get data
  getData(): void {
    // Get summary
    this.http.get(`/summary/${this.dateRange}`).subscribe((res) => {
      this.summary = res;

      this.summaryChart.data.datasets[0].data = [
        this.summary.income,
        this.summary.outcome,
      ];

      this.summaryChart.show = true;
    });

    // Get categories
    this.http.get(`/categories/${this.dateRange}`).subscribe((res) => {
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
  }

  // Set date range
  setDateRange(): void {
    this.summaryChart.show = false;
    this.categoriesIncomeChart.show = false;
    this.categoriesOutcomeChart.show = false;

    // this.incomeOutcomeChart.show = false;

    this.getData();
  }
}
