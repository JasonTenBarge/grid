import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Sort} from '@angular/material';
import {filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {
  rows = 5000;
  dataForm: FormArray;
  @Input() columns = ['id', 'username', 'title', 'age', 'condition', 'description', 'level', 'zone'];
  _data: any = generateTestData(this.rows);
  @Input()
  set data(input: any[]) {
    this._data = input;
    this.populateForms(input);
  }
  edit = false;
  searchForm = new FormControl('');

  constructor(private fb: FormBuilder) {
    this.populateForms(this._data);
  }

  ngOnInit() {
  }

  populateForms(input: any[]) {
    this.dataForm = this.fb.array([]);
    input.forEach(x => {
      this.dataForm.push(
        this.fb.group(
          x
        )
      );
    });
  }

  changeEdit(e: any) {
    this.edit = !this.edit;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  sortData(sort: Sort) {
    // const data = this.desserts.slice();
    // if (!sort.active || sort.direction === '') {
    //   this.sortedData = data;
    //   return;
    // }

    // this.sortedData = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   switch (sort.active) {
    //     case 'name': return compare(a.name, b.name, isAsc);
    //     case 'calories': return compare(a.calories, b.calories, isAsc);
    //     case 'fat': return compare(a.fat, b.fat, isAsc);
    //     case 'carbs': return compare(a.carbs, b.carbs, isAsc);
    //     case 'protein': return compare(a.protein, b.protein, isAsc);
    //     default: return 0;
    //   }
    // });
  }
}

export interface GridRow {
  id: number;
  username: string;
  title: string;
  age: number;
  condition: string;
  description: string;
  level: number;
  zone: number;
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
      level: Math.floor(Math.random() * 100) + 1
    };
  });
}
