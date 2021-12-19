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
                { ...document, transactions: [], income: 0, outcome: 0 },
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
            this.http.delete(`/categories/${dialog.deleteId}`).subscribe(() => {
              this.categories = this.categories.filter(
                (category: any) => category._id !== dialog.deleteId
              );
            });
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
    type: boolean
  ): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: {
          dialogTitle: 'Додавання запису',
          dialogAction: 'ДОДАТИ',
          category,
          transaction: { type },
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
            .subscribe((document) => {
              // Add to transactions array
              this.categories[categoryIndex].transactions = [
                ...this.categories[categoryIndex].transactions,
                document,
              ];

              // Update category summary
              if (amount > 0) {
                this.categories[categoryIndex].income += amount;
              } else {
                this.categories[categoryIndex].outcome += amount;
              }

              // Update overall summary
              if (amount > 0) {
                this.summary.income += amount;
              } else {
                this.summary.outcome += amount;
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
          transaction: {
            ...transaction,
            amount: Math.abs(transaction.amount).toFixed(2),
            type: transaction.amount > 0,
          },
          prevAmount: transaction.amount,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          // If delete
          if (dialog.deleteId) {
            const amount =
              transaction.amount * (transaction.amount > 0 ? 1 : -1);

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
                if (amount > 0) {
                  this.categories[categoryIndex].income -= amount;
                } else {
                  this.categories[categoryIndex].outcome -= amount;
                }

                // Update overall summary
                if (amount > 0) {
                  this.summary.income -= amount;
                } else {
                  this.summary.outcome -= amount;
                }
              });
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
              .subscribe(() => {
                // Update transactions array
                this.categories[categoryIndex].transactions[transactionIndex] =
                  { ...dialog.transaction, amount };
                this.categories[categoryIndex].transactions[
                  transactionIndex
                ].categoryId = dialog.category._id;

                // TODO
                // updates

                // Update category summary
                // if (amount) {
                //   this.categories[categoryIndex].income +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // } else {
                //   this.categories[categoryIndex].outcome +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // }

                // // Update overall summary
                // if (amount) {
                //   this.summary.income +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // } else {
                //   this.summary.outcome +=
                //     dialog.transaction.amount - dialog.prevAmount;
                // }
              });
          }
        }
      });
  }
}
