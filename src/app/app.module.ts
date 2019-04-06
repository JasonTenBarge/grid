import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './grid/grid.component';
import {CdkTableModule} from '@angular/cdk/table';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FilterPipe } from './grid/filter.pipe';
import { SortPipe } from './grid/sort.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { GridTesterComponent } from './grid-tester/grid-tester.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {GridFilterDialogComponent} from './grid/grid-filter-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    FilterPipe,
    SortPipe,
    GridTesterComponent,
    GridFilterDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CdkTableModule,
    ScrollDispatchModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    DragDropModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule
  ],
  entryComponents: [GridFilterDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
