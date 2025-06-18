import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Date'
})
export class DatePipe implements PipeTransform {
  transform(value: string, format: string): string {
    return value;
  }
}
