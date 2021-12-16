import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  transactions: any = [];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/transactions').subscribe((res) => {
      this.transactions = res;
    });
  }

  onDelete(id: string): void {
    this.http.delete(`/transactions/${id}`).subscribe(() => {
      this.transactions = this.transactions.filter(
        (category: any) => category._id !== id
      );
    });
  }

  openAddDialog(): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: { dialogTitle: 'Додавання транзакції', dialogAction: 'Додати' },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          this.http
            .post('/transactions', {
              categoryId: dialog.categoryId,
              income: dialog.income,
              amount: dialog.amount,
              date: dialog.date,
              description: dialog.description,
            })
            .subscribe((document) => {
              // Add to transactions array
              this.transactions = [...this.transactions, document];
            });
        }
      });
  }

  openUpdateDialog(
    name: string,
    description: string,
    id: string,
    index: number
  ): void {
    this.dialog
      .open(TransactionDialogComponent, {
        data: {
          dialogTitle: 'Редагування категорії',
          dialogAction: 'Редагувати',
          id,
          name,
          description,
        },
      })
      .afterClosed()
      .subscribe((dialog) => {
        // Check if submitted
        if (dialog) {
          this.http
            .put(`/transactions/${id}`, {
              name: dialog.name,
              description: dialog.description,
            })
            .subscribe(() => {
              // Update transactions array
              this.transactions[index].name = dialog.name;
              this.transactions[index].description = dialog.description;
            });
        }
      });
  }
}
