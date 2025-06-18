import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validarIne'
})
export class ValidarInePipe implements PipeTransform {
  transform(value: string): boolean {
    const inePattern = /^\d{13}$/; // Ajusta este patrón según el formato específico del INE
    return inePattern.test(value);
  }
}
