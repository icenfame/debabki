import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    CategoryDialogComponent,
    TransactionDialogComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    NgChartsModule,

    MatToolbarModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatRippleModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'uk',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
