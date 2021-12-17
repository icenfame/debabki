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

  // Init
  ngOnInit(): void {
    this.http.get('/categories').subscribe((res) => {
      this.categories = res;
    });

    this.http.get('/summary').subscribe((res) => {
      this.summary = res;
    });
  }

  // Add category
  openAddCategoryDialog(): void {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          dialogTitle: 'Додавання категорії',
          dialogAction: 'ДОДАТИ',
          category: {},
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
            .subscribe((document) => {
              // Add to categories array
              this.categories = [
                ...this.categories,
                { ...document, transactions: [], income: 0, expanse: 0 },
              ];
            });
        }
      });
  }

  // Update category
  openUpdateCategoryDialog(category: any, categoryIndex: number): void {
    this.dialog
      .open(CategoryDialogComponent, {
        data: {
          dialogTitle: 'Редагування категорії',
          dialogAction: 'РЕДАГУВАТИ',
          category,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          // If delete
          if (dialog.deleteId) {
            // if (
            //   confirm(
            //     'Ви дійсно хочете видалити категорію та всі транзакції у ній?'
            //   )
            // ) {
            this.http.delete(`/categories/${dialog.deleteId}`).subscribe(() => {
              this.categories = this.categories.filter(
                (category: any) => category._id !== dialog.deleteId
              );
            });
            // }
          } // If update
          else {
            this.http
              .put(`/categories/${category._id}`, {
                name: dialog.category.name,
                description: dialog.category.description,
              })
              .subscribe(() => {
                // Update categories array
                this.categories[categoryIndex].name = dialog.category.name;
                this.categories[categoryIndex].description =
                  dialog.category.description;
              });
          }
        }
      });
  }

  // Add transaction
  openAddTransactionDialog(
    category: any,
    categoryIndex: number,
    income: boolean
  ): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: {
          dialogTitle: 'Додавання запису',
          dialogAction: 'ДОДАТИ',
          category,
          transaction: { income },
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          this.http
            .post('/transactions', {
              categoryId: dialog.category._id,
              income: dialog.transaction.income,
              amount: dialog.transaction.amount,
              date: dialog.transaction.date,
              name: dialog.transaction.name,
            })
            .subscribe((document) => {
              // Add to transactions array
              this.categories[categoryIndex].transactions = [
                ...this.categories[categoryIndex].transactions,
                document,
              ];

              // Update category summary
              if (dialog.transaction.income) {
                this.categories[categoryIndex].income +=
                  dialog.transaction.amount;
              } else {
                this.categories[categoryIndex].expanse +=
                  dialog.transaction.amount;
              }

              // Update overall summary
              if (dialog.transaction.income) {
                this.summary.income += dialog.transaction.amount;
              } else {
                this.summary.expanse += dialog.transaction.amount;
              }
            });
        }
      });
  }

  // Update transaction
  openUpdateTransactionDialog(
    category: any,
    categoryIndex: number,
    transaction: any,
    transactionIndex: number
  ): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: {
          dialogTitle: 'Редагування категорії',
          dialogAction: 'РЕДАГУВАТИ',
          category,
          transaction,
          prevAmount: transaction.amount,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          // If delete
          if (dialog.deleteId) {
            // if (confirm('Ви дійсно хочете видалити запис?')) {
            this.http
              .delete(`/transactions/${dialog.deleteId}`)
              .subscribe(() => {
                // Update transactions array
                this.categories[categoryIndex].transactions = this.categories[
                  categoryIndex
                ].transactions.filter(
                  (category: any) => category._id !== dialog.deleteId
                );

                // Update category summary
                if (transaction.income) {
                  this.categories[categoryIndex].income -= transaction.amount;
                } else {
                  this.categories[categoryIndex].expanse -= transaction.amount;
                }

                // Update overall summary
                if (transaction.income) {
                  this.summary.income -= transaction.amount;
                } else {
                  this.summary.expanse -= transaction.amount;
                }
              });
            // }
          } // If update
          else {
            this.http
              .put(`/transactions/${transaction._id}`, {
                categoryId: dialog.category._id,
                income: dialog.transaction.income,
                amount: dialog.transaction.amount,
                date: dialog.transaction.date,
                name: dialog.transaction.name,
              })
              .subscribe(() => {
                // Update transactions array
                this.categories[categoryIndex].transactions[transactionIndex] =
                  dialog.transaction;
                this.categories[categoryIndex].transactions[
                  transactionIndex
                ].categoryId = dialog.category._id;

                // TODO

                // Update category summary
                // if (dialog.transaction.income) {
                //   this.categories[categoryIndex].income +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // } else {
                //   this.categories[categoryIndex].expanse +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // }

                // Update overall summary
                // if (dialog.transaction.income) {
                //   this.summary.income +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // } else {
                //   this.summary.expanse +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // }
              });
          }
        }
      });
  }
}
