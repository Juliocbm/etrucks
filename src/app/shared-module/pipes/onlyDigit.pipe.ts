import { Pipe, PipeTransform } from '@angular/core';
import { FormatNumberService } from '../../shared-module/services/formatNumber.Service';
@Pipe({
  name: 'onlyDigit',
})
export class OnlyDigitPipe implements PipeTransform {

  constructor(private numServ: FormatNumberService) {}

  transform(value: number, char?: string): string {
    
    char = char ?? '';
    let stringValue = '';
    if (value == null || value == undefined) value = 0;

    // Convertir a string si es un número
    if (typeof value === 'number') {
      stringValue = value.toString();
    }

    if (char.toLowerCase() != 'id') {
      if (!stringValue || stringValue === '') {
        stringValue = '0';
      } else if (char == '%') {
        stringValue = stringValue + char;
      } else {

        stringValue = this.numServ.formatNumber(stringValue, char);
        
      }
    }

    return stringValue;
  }
}
