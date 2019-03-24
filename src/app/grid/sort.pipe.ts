import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort',
    pure: false
})
export class SortPipe implements PipeTransform {
    transform(items: any[], column: string): any {
        if (!items || !column) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.sort((row1, row2) => {
            if (row1.get(column).value > row2.get(column).value) {
              return 1;
            } else if (row1.get(column).value < row2.get(column).value) {
              return -1;
            } else {
              return 0;
            }
          });
    }
}
