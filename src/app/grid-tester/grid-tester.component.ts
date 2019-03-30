import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-grid-tester',
  templateUrl: './grid-tester.component.html',
  styleUrls: ['./grid-tester.component.scss']
})
export class GridTesterComponent implements OnInit {

  rows = 5000;
  data = generateTestData(this.rows);
  columns = [
    {name: 'id', title: 'ID', type: 'number'},
    {name: 'username', title: 'Username', type: 'string'},
    {name: 'title', title: 'Title', type: 'string'},
    {name: 'age', title: 'Age', type: 'number'},
    {name: 'condition', title: 'Condition', type: 'string'},
    {name: 'description', title: 'Description', type: 'string'},
    // {name: 'level', title: 'Level', type: 'number'},
    {name: 'zone', title: 'Zone', type: 'number'},
    {name: 'checkbox', title: 'Checkbox', type: 'boolean'}
  ];
  settingsForm = this.fb.group({
    class: ['material']
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const test = this.settingsForm.get('class').value;
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
      // level: Math.floor(Math.random() * 100) + 1,
      checkbox: false
    };
  });
}
