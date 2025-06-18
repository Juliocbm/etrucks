import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
    name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

    transform(value: Date, format:string): string{
        if(format == 'date')
            return formatDate(value,'dd/MMM/yyyy','en-US')

        if(format == 'date-time')
            return formatDate(value,'dd/MMM/yyyy HH:mm','en-US')
        else
            return formatDate(value,'dd/MMM/yyyy','es-ES')
    }
}