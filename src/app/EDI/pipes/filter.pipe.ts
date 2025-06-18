import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property?: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (property) {
        return item[property] && item[property].toLowerCase().includes(searchText);
      } else {
        // If no property specified, search in all string properties
        return Object.keys(item).some(key => {
          return typeof item[key] === 'string' && item[key].toLowerCase().includes(searchText);
        });
      }
    });
  }
}
