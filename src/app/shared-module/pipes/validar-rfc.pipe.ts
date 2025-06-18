import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validarRfc'
})
export class ValidarRfcPipe implements PipeTransform {
  transform(value: string): boolean {
    const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}(?:[A-Z\d]{3})?$/;
    return rfcPattern.test(value.toUpperCase());
  }
}
