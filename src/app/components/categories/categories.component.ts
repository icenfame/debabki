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

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/categories').subscribe((res) => {
      this.categories = res;
    });

    this.http.get('/summary').subscribe((res) => {
      this.summary = res;
    });
  }

  openAddCategoryDialog(): void {
    this.dialog
      .open(CategoryDialogComponent, {
        data: { dialogTitle: 'Додавання категорії', dialogAction: 'ДОДАТИ' },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          this.http
            .post('/categories', {
              name: dialog.name,
              description: dialog.description,
            })
            .subscribe((document) => {
              // Add to categories array
              this.categories = [...this.categories, document];
            });
        }
      });
  }

  openUpdateCategoryDialog(
    name: string,
    description: string,
    id: string,
    index: number
  ): void {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          dialogTitle: 'Редагування категорії',
          dialogAction: 'РЕДАГУВАТИ',
          id,
          name,
          description,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          // If delete
          if (dialog.deleteId) {
            if (
              confirm(
                'Ви дійсно хочете видалити категорію та всі транзакції у ній?'
              )
            ) {
              this.http
                .delete(`/categories/${dialog.deleteId}`)
                .subscribe(() => {
                  this.categories = this.categories.filter(
                    (category: any) => category._id !== dialog.deleteId
                  );
                });
            }
          } // If update
          else {
            this.http
              .put(`/categories/${id}`, {
                name: dialog.name,
                description: dialog.description,
              })
              .subscribe(() => {
                // Update categories array
                this.categories[index].name = dialog.name;
                this.categories[index].description = dialog.description;
              });
          }
        }
      });
  }

  openAddTransactionDialog(): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: { dialogTitle: 'Додавання запису', dialogAction: 'ДОДАТИ' },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          this.http
            .post('/transactions', {
              categoryId: dialog.categoryId,
              type: dialog.type,
              amount: dialog.amount,
              date: dialog.date,
              description: dialog.description,
            })
            .subscribe((document) => {
              // Add to transactions array
              // this.transactions = [...this.transactions, document];
            });
        }
      });
  }
}
