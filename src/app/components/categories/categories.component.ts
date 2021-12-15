import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categories: any = [];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/categories').subscribe((res) => {
      this.categories = res;
    });
  }

  onDelete(id: string): void {
    if (
      confirm('Ви дійсно хочете видалити категорію та всі транзакції у ній?')
    ) {
      this.http.delete(`/categories/${id}`).subscribe(() => {
        this.categories = this.categories.filter(
          (category: any) => category._id !== id
        );
      });
    }
  }

  openAddDialog(): void {
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

  openUpdateDialog(
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
      });
  }
}
