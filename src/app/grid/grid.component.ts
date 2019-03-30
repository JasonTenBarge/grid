import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GridColumn } from './grid-column';
import { Sort } from './sort';

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
  sortList: Sort[] = [];

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
    if (this.sortList.length === 0) {
      return null;
    }
    this.displayForm.controls = this.displayForm.controls.sort((row1, row2) => {
      for (const sorter of this.sortList) {
        if (row1.get(sorter.name).value > row2.get(sorter.name).value) {
          return sorter.direction === 'asc' ? 1 : -1;
        } else if (row1.get(sorter.name).value < row2.get(sorter.name).value) {
          return sorter.direction === 'asc' ? -1 : 1;
        }
      }
      return 0;
    });
  }

  sortClick(column: string) {
    let selectedColumn = this.sortList.find(x => x.name === column);
    if (!selectedColumn) {
      selectedColumn = {
        name: column,
        direction: ''
      };
      this.sortList.push(selectedColumn);
    }
    const columnFromColumns = this.columns.find(x => x.name === column);
    switch (selectedColumn.direction) {
      case 'asc': {
        selectedColumn.direction = 'desc';
        columnFromColumns.sort = 'desc';
        break;
      }
      case 'desc': {
        selectedColumn.direction = '';
        columnFromColumns.sort = '';
        const index = this.sortList.findIndex(x => x.name === column);
        this.sortList.splice(index, 1);
        break;
      }
      default : {
        selectedColumn.direction = 'asc';
        columnFromColumns.sort = 'asc';
        break;
      }
    }
    this.displayData();
  }

  groupData() {
  }
}
