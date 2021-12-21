import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any = [];
  summary: any = [];
  expanded: any = [];
  dateRange: string = '1 month';

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  // Init
  ngOnInit(): void {
    this.getData();
  }

  // Get data
  getData(): void {
    // Get summary
    this.http.get(`/summary/${this.dateRange}`).subscribe((res) => {
      this.summary = res;
    });

    // Get categories
    this.http.get(`/categories/${this.dateRange}`).subscribe((res) => {
      this.categories = res;
    });
  }

  // Set date range
  setDateRange(): void {
    this.getData();
  }

  // Add category
  openAddCategoryDialog(): void {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          dialogTitle: 'Додавання категорії',
          dialogAction: 'ДОДАТИ',
          category: {},
          dateRange: this.dateRange,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          this.http
            .post('/categories', {
              name: dialog.category.name,
              description: dialog.category.description,
            })
            .subscribe(() => this.getData());
        }
      });
  }

  // Update category
  openUpdateCategoryDialog(category: any): void {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          dialogTitle: 'Редагування категорії',
          dialogAction: 'РЕДАГУВАТИ',
          category: { ...category }, // Prevent copy by reference
          dateRange: this.dateRange,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          // If delete
          if (dialog.deleteId) {
            this.http
              .delete(`/categories/${dialog.deleteId}`)
              .subscribe(() => this.getData());
          } // If update
          else {
            this.http
              .put(`/categories/${category._id}`, {
                name: dialog.category.name,
                description: dialog.category.description,
              })
              .subscribe(() => this.getData());
          }
        }
      });
  }

  // Add transaction
  openAddTransactionDialog(category: any, type: boolean): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: {
          dialogTitle: 'Додавання запису',
          dialogAction: 'ДОДАТИ',
          category,
          transaction: { type },
          dateRange: this.dateRange,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          const amount =
            dialog.transaction.amount * (dialog.transaction.type > 0 ? 1 : -1);

          this.http
            .post('/transactions', {
              categoryId: dialog.category._id,
              amount: amount,
              date: dialog.transaction.date,
              name: dialog.transaction.name,
            })
            .subscribe(() => this.getData());
        }
      });
  }

  // Update transaction
  openUpdateTransactionDialog(category: any, transaction: any): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: {
          dialogTitle: 'Редагування запису',
          dialogAction: 'РЕДАГУВАТИ',
          category,
          transaction: {
            ...transaction,
            amount: Math.abs(transaction.amount).toFixed(2),
            type: transaction.amount > 0,
          },
          prevAmount: transaction.amount,
          dateRange: this.dateRange,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          // If delete
          if (dialog.deleteId) {
            this.http
              .delete(`/transactions/${dialog.deleteId}`)
              .subscribe(() => this.getData());
          } // If update
          else {
            const amount =
              dialog.transaction.amount *
              (dialog.transaction.type > 0 ? 1 : -1);

            this.http
              .put(`/transactions/${transaction._id}`, {
                categoryId: dialog.category._id,
                amount: amount,
                date: dialog.transaction.date,
                name: dialog.transaction.name,
              })
              .subscribe(() => this.getData());
          }
        }
      });
  }
}
