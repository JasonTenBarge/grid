import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Sort} from '@angular/material';
import {filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GridColumn } from './grid-column';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {

  dataForm: FormArray;
  @Input() columns: GridColumn[];
  @Input()
  set data(input: any[]) {
    this.populateForms(input);
  }
  edit = false;
  searchForm = new FormControl('');
  displayForm = this.fb.array([]);
  sortColumn: string;

  constructor(private fb: FormBuilder) {
    this.searchForm.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(text => {
      this.displayData();
    });
  }

  ngOnInit() {
  }

  populateForms(input: any[]) {
    this.dataForm = this.fb.array([]);
    input.forEach(row => {
      this.dataForm.push(
        this.fb.group(
          row
        )
      );
    });
    this.displayData();
  }

  changeEdit(e: any) {
    this.edit = !this.edit;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  displayData() {
    this.displayForm.controls = this.dataForm.controls;
    this.filterData();
    this.sortData();
    this.groupData();
    this.displayForm.controls = this.displayForm.controls.slice(); // slice needed to let angular know array changed
  }

  filterData() {
    if (!this.displayForm.controls || !this.searchForm.value) {
      return null;
    }
    this.displayForm.controls = this.displayForm.controls.filter(row =>
      Object.values(row.value)
      .map(value => String(value)
      .indexOf(this.searchForm.value) >= 0)
      .filter(x => x === true)
      .length > 0);
  }

  sortData() {
    if (!this.sortColumn) {
      return null;
    }
    this.displayForm.controls = this.displayForm.controls.sort((row1, row2) => {
      if (row1.get(this.sortColumn).value > row2.get(this.sortColumn).value) {
        return 1;
      } else if (row1.get(this.sortColumn).value < row2.get(this.sortColumn).value) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  sortClick(column: string) {
    this.sortColumn = column;
    this.displayData();
  }

  groupData() {
  }
}
