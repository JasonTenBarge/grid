import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-grid-filter-dialog',
    templateUrl: 'grid-filter-dialog.component.html',
    styleUrls: ['./grid-filter-dialog.component.scss']
  })

export class GridFilterDialogComponent {

    filterForm: FormGroup;
    filters = ['Equal To', 'Is Not Equal To', 'Contains', 'Does Not Contain', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'];

    constructor(
        public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder) {

        this.filterForm = this.fb.group({
            columnTitle: [data.columnTitle],
            columnName: [data.columnName],
            filter: ['Contains'],
            value: ['']
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
