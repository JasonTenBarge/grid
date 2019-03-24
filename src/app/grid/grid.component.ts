import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  columns = ['id', 'username', 'title', 'age', 'condition', 'description', 'level', 'zone'];
  rows = 5000;
  usernames = [
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

  titles = [
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

  testData = [
    {id: 5, username: 'test', title: 'huh', age: 20},
    {id: 6, username: 'idk', title: 'qqq', age: 43},
    {id: 7, username: 'wut', title: 'aaa', age: 30},
    {id: 5, username: 'test', title: 'huh', age: 20},
    {id: 6, username: 'idk', title: 'qqq', age: 43},
    {id: 7, username: 'wut', title: 'aaa', age: 30},
    {id: 5, username: 'test', title: 'huh', age: 20},
    {id: 6, username: 'idk', title: 'qqq', age: 43},
    {id: 7, username: 'wut', title: 'aaa', age: 30},
    {id: 5, username: 'test', title: 'huh', age: 20},
    {id: 6, username: 'idk', title: 'qqq', age: 43},
    {id: 7, username: 'wut', title: 'aaa', age: 30},
    {id: 5, username: 'test', title: 'huh', age: 20},
    {id: 6, username: 'idk', title: 'qqq', age: 43},
    {id: 7, username: 'wut', title: 'aaa', age: 30},
    {id: 5, username: 'test', title: 'huh', age: 20},
    {id: 6, username: 'idk', title: 'qqq', age: 43},
    {id: 7, username: 'wut', title: 'aaa', age: 30},
  ];
  // items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  testItems = Array.from({length: this.rows}).map((_, i) => {
    return {
      id: i,
      username: this.usernames[Math.floor(Math.random() * 10)],
      title: this.titles[Math.floor(Math.random() * 10)],
      age: Math.floor(Math.random() * 100) + 1,
      zone: i,
      description: this.usernames[Math.floor(Math.random() * 10)],
      condition: this.titles[Math.floor(Math.random() * 10)],
      level: Math.floor(Math.random() * 100) + 1
    };
  });
  edit = false;
  itemForm = this.fb.array([]);
  test: any;

  constructor(private fb: FormBuilder) {
    this.testItems.forEach(x => {
      this.itemForm.push(
        this.fb.group({
          id: [x.id],
          username: [x.username],
          title: [x.title],
          age: [x.age],
          condition: [x.condition],
          description: [x.description],
          level: [x.level],
          zone: [x.zone],
        })
      );
    });
  }

  ngOnInit() {
  }

  changeEdit(e: any) {
    this.edit = !this.edit;
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
