import { FormBuilder, FormControl, FormArray } from '@angular/forms';

export interface GridRow {
    data: FormControl;
    group: boolean;
    opened: boolean;
}
