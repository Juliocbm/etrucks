import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validarCurp'
})
export class ValidarCurpPipe implements PipeTransform {
  transform(value: string): boolean {
    const curpPattern = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/;
    return curpPattern.test(value.toUpperCase());
  }
}
