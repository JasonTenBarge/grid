import { FormBuilder, FormControl, FormArray, FormGroup } from '@angular/forms';

export interface GridRow {
    data: FormGroup;
    group: boolean;
    opened?: boolean;
    level?: number;
    children?: GridRow[];
}
