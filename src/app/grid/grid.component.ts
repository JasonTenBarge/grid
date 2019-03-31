import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
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
  groupList: any[] = [];
  groupForm = this.fb.array([]);

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
        this.fb.group({
          data: this.fb.group(row),
          group: false,
        })
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
    this.displayForm.controls = this.dataForm.controls.filter(x => x.get('group').value === false);
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
      Object.values(row.get('data').value)
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
        if (row1.get('data').get(sorter.name).value > row2.get('data').get(sorter.name).value) {
          return sorter.direction === 'asc' ? 1 : -1;
        } else if (row1.get('data').get(sorter.name).value < row2.get('data').get(sorter.name).value) {
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

  addGroup(columnName: string) {
    const group = this.groupList.find(x => x === columnName);
    if (group) {
      this.removeGroup(columnName);
      return null;
    }
    const column = this.columns.find(x => x.name === columnName);
    const columnIndex = this.columns.findIndex(x => x.name === columnName);
    this.columns.splice(columnIndex, 1);
    this.columns.splice(this.groupList.length, 0, column);
    const selectedColumn = this.sortList.find(x => x.name === columnName);
    if (!selectedColumn) {
      this.groupList.push(columnName);
      this.sortClick(columnName);
    } else {
      const sort = this.sortList.find(x => x.name === columnName);
      const sortIndex = this.sortList.findIndex(x => x.name === columnName);
      this.sortList.splice(sortIndex, 1);
      this.sortList.splice(this.groupList.length, 0, sort);
      this.groupList.push(columnName);
      this.displayData();
    }
  }

  removeGroup(columnName: string) {
    const groupIndex = this.groupList.indexOf(columnName);
    this.groupList.splice(groupIndex, 1);
    for (let i = groupIndex; i < this.groupList.length ; i++) {
      moveItemInArray(this.columns, i, i + 1);
    }
    this.displayData();
  }

  groupData() {
    let groupIndex = 0;
    for (const group of this.groupList) {
      let oldValue: string = null;
      let index = 0;
      for (const row of this.displayForm.controls) {
        if (row.get('data').get(group).value !== oldValue && row.get('group').value === false) {
          oldValue = row.get('data').get(group).value;
          const groupValue = row.get('data').value;
          const groupRow = this.fb.group({
            data: this.fb.group(groupValue),
            group: true,
            opened: true,
            level: groupIndex,
            children: this.fb.array([])
          });
          const foundGroup = this.groupForm.controls.find(x => x.get('data').value === groupRow.get('data').value);
          if (foundGroup) {
            this.displayForm.controls.splice(index, 0, foundGroup);
          } else {
            this.displayForm.controls.splice(index, 0, groupRow);
            this.groupForm.controls.push(groupRow);
          }
        }
        index++;
      }
      groupIndex++;
    }
    // groupIndex = 0;
    // for (const group of this.groupList) {
    //   for (const row of this.displayForm.controls) {
    //     if (row.get('group').value === true) {
    //       const children = this.displayForm.controls.filter(x => {
    //         for (let i = 0 ; i <= groupIndex; i++) {
    //           if (x.get('data').get(this.columns[i].name).value !== row.get('data').get(this.columns[i].name).value ||
    //             (x.get('group').value === true && x.get('level').value <= groupIndex))  {
    //             return false;
    //           }
    //         }
    //         return true;
    //       });
    //       (row.get('children') as FormArray).controls = children;
    //     }
    //   }
    //   groupIndex++;
    // }
  }

  openGroup(group: any, column: any, row: any) {
    let index = this.displayForm.controls.indexOf(row);
    for (const control of row.get('children').controls) {
      index++;
      this.displayForm.controls.splice(index, 0, control);
    }
    this.displayForm.controls = this.displayForm.controls.slice();
    row.get('opened').setValue(true);
    // this.displayData();
  }

  closeGroup(group: any, column: any, row: any) {
    const groupIndex = this.groupList.indexOf(group);
    const children = this.displayForm.controls.filter(x => {
      for (let i = 0 ; i <= groupIndex; i++) {
        if (x.get('data').get(this.columns[i].name).value !== row.get('data').get(this.columns[i].name).value ||
         (x.get('group').value === true && x.get('level').value <= groupIndex))  {
          return false;
        }
      }
      return true;
    });
    row.get('children').controls = children;
    children.forEach(x => {
      this.displayForm.controls = this.displayForm.controls.filter(y => x !== y);
    });
    row.get('opened').setValue(false);
  }
}
