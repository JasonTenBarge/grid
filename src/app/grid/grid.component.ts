import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime } from 'rxjs/operators';
import { GridColumn } from './grid-column';
import { Sort } from './sort';
import { CdkVirtualScrollViewport, CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialog } from '@angular/material/dialog';
import { GridFilterDialogComponent } from './grid-filter-dialog.component';
import { GridRow } from './grid-row';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {

  @ViewChild('grid', { static: true })
  viewport: CdkVirtualScrollViewport;

  @ViewChild('stickyColumn', { static: false })
  stickyColumn: CdkVirtualScrollViewport;

  @ViewChild('header', { static: false })
  header: CdkScrollable;

  dataForm: GridRow[] = [];
  stick = false;
  @Input() height: string;
  @Input() columns: GridColumn[];
  @Input()
  set data(input: any[]) {
    this.populateForms(input);
  }
  edit = false;
  searchForm = new FormControl('');
  displayForm: GridRow[] = [];
  sortList: Sort[] = [];
  groupList: any[] = [];
  groupForm: GridRow[] = [];
  itemSize = 80;
  _template: string;
  filterList: any[] = [];
  @Input()
  set template(input: string) {
    this._template = input;
    switch (input) {
      case 'compact': {
        this.itemSize = 60;
        break;
      }
      case 'inventory': {
        this.itemSize = 36;
        break;
      }
      case 'inventory-box': {
        this.itemSize = 36;
        break;
      }
      default: {
        this.itemSize = 80;
        break;
      }
    }
  }
  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.searchForm.valueChanges.pipe(
      debounceTime(100)
    ).subscribe(text => {
      this.displayData();
    });
  }

  ngOnInit() {
    this.viewport.elementScrolled().subscribe(x => {
      // console.log(this.viewport);
      // console.log(this.header);
      // this.header.scrollTo({right: this.viewport.measureScrollOffset('left')});
      if (this.stickyColumn) {
        this.stickyColumn.scrollTo({top: this.viewport.measureScrollOffset('top')});
      }
    });
  }

  populateForms(input: any[]) {
    this.dataForm = [];
    input.forEach(row => {
      this.dataForm.push({
        data: this.fb.group(row),
        group: false,
        opened: false,
      });
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
    this.displayForm = this.dataForm.filter(x => x.group === false);
    this.filterData();
    this.sortData();
    this.groupData();
    this.displayForm = this.displayForm.slice(); // slice needed to let angular know array changed
  }

  filterData() {
    if (!this.displayForm || (!this.searchForm.value && this.filterList.length === 0)) {
      return null;
    }
    this.displayForm = this.displayForm.filter(row =>
      Object.values(row.data.value)
      .map(value => String(value).indexOf(this.searchForm.value) >= 0)
      .filter(x => x === true)
      .length > 0);
    for (const filter of this.filterList) {
      if (filter.type === 'Contains') {
        this.displayForm = this.displayForm.filter(row =>
          String(row.data.get(filter.name).value).indexOf(filter.value) >= 0);
      }
    }
  }

  sortData() {
    if (this.sortList.length === 0) {
      return null;
    }
    this.displayForm = this.displayForm.sort((row1, row2) => {
      for (const sorter of this.sortList) {
        if (row1.data.get(sorter.name).value > row2.data.get(sorter.name).value) {
          return sorter.direction === 'asc' ? 1 : -1;
        } else if (row1.data.get(sorter.name).value < row2.data.get(sorter.name).value) {
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
      for (const row of this.displayForm) {
        if (row.data.get(group).value !== oldValue && row.group === false) {
          oldValue = row.data.get(group).value;
          const groupValue = row.data.value;
          const groupRow: GridRow = {
            data: this.fb.group(groupValue),
            group: true,
            opened: true,
            level: groupIndex,
            children: []
          };
          const foundGroup = this.groupForm.find(x => x.data.value === groupRow.data.value);
          if (foundGroup) {
            this.displayForm.splice(index, 0, foundGroup);
          } else {
            this.displayForm.splice(index, 0, groupRow);
            this.groupForm.push(groupRow);
          }
        }
        index++;
      }
      groupIndex++;
    }
    groupIndex = 0;
    for (const group of this.groupList) {
      let oldGroup: GridRow = null;
      let oldGroupIndex = 0;
      let index = 0;
      for (const row of this.displayForm) {
        if (row.group === true && row.level === groupIndex) {
          if (oldGroup) {
            oldGroup.children = this.displayForm
              .slice(oldGroupIndex + 1, index)
              .filter(x => !(x.group === true && x.level < groupIndex));
          }
          oldGroup = row;
          oldGroupIndex = index;
        }
        index++;
      }
      if (oldGroup) {
        oldGroup.children = this.displayForm
        .slice(oldGroupIndex + 1, index)
        .filter(x => !(x.group === true && x.level < groupIndex));
      }
      groupIndex++;
    }
  }

  openGroup(group: any, column: any, row: any) {
    let index = this.displayForm.indexOf(row);
    for (const control of row.children) {
      index++;
      this.displayForm.splice(index, 0, control);
    }
    this.displayForm = this.displayForm.slice();
    row.opened = true;
    this.displayData();
  }

  closeGroup(group: any, column: any, row: any) {
    console.log(row);
    row.children.forEach(x => {
      this.displayForm = this.displayForm.filter(y => x !== y);
    });
    row.opened = false;
  }

  trackByIdx(i) {
    return i;
  }

  openFilter(columnName: string, columnTitle: string) {
    const dialogRef = this.dialog.open(GridFilterDialogComponent, {
      height: '310px',
      width: '300px',
      data: {columnName: columnName, columnTitle: columnTitle}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newFilter = {
          name: result.columnName,
          type: result.filter,
          value: result.value
        };
        this.filterList.push(newFilter);
        const column = this.columns.find(x => x.name === newFilter.name);
        column.filter = true;
      }
      this.displayData();
    });
  }
}
