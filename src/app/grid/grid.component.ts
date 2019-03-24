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
  rows = 5000;
  dataForm: FormArray;
  @Input() columns = [
    {name: 'id', title: 'ID', type: 'number'},
    {name: 'username', title: 'Username', type: 'string'},
    {name: 'title', title: 'Title', type: 'string'},
    {name: 'age', title: 'Age', type: 'number'},
    {name: 'condition', title: 'Condition', type: 'string'},
    {name: 'description', title: 'Description', type: 'string'},
    {name: 'level', title: 'Level', type: 'number'},
    {name: 'zone', title: 'Zone', type: 'number'},
    {name: 'checkbox', title: 'Checkbox', type: 'boolean'}
  ];
  @Input()
  set data(input: any[]) {
    this.populateForms(input);
  }
  edit = false;
  searchForm = new FormControl('');
  displayForm = this.fb.array([]);
  sortColumn: string;

  constructor(private fb: FormBuilder) {
    this.populateForms(generateTestData(this.rows));
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
    }).slice(); // slice needed to let angular know array changed
  }

  sortClick(column: string) {
    this.sortColumn = column;
    this.displayData();
  }

  groupData() {
  }
}

export function generateTestData(rows: number = 5000) {

  const usernames = [
    'test',
    'idk',
    'wut',
    'zzz',
    'boring',
    'sleep',
    'does this work',
    'huh',
    'wut',
    'ok',
  ];

  const titles = [
    'qqq',
    'aaa',
    'ccc',
    'zzzzzzzzz',
    'eeeeeeeeeee',
    'sssssssssssss',
    'qqqqqqqqqqqq this work',
    'f',
    'xxx',
    'vvv',
  ];

  return Array.from({length: rows}).map((_, i) => {
    return {
      id: i,
      username: usernames[Math.floor(Math.random() * 10)],
      title: titles[Math.floor(Math.random() * 10)],
      age: Math.floor(Math.random() * 100) + 1,
      zone: i,
      description: usernames[Math.floor(Math.random() * 10)],
      condition: titles[Math.floor(Math.random() * 10)],
      level: Math.floor(Math.random() * 100) + 1,
      checkbox: false
    };
  });
}
