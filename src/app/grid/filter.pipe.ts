import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], text: string): any {
        if (!items || !text) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(row =>
            Object.values(row.value)
            .map(value => String(value)
            .indexOf(text) >= 0)
            .filter(x => x === true)
            .length > 0);
    }
}
