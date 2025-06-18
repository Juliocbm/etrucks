import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyDecimal]'
})
export class OnlyDecimalDirective {
  private maxEnteros = 2;
  private maxDecimales = 6;

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/[^0-9]/g, ''); // Solo números

    // Agregar el punto automáticamente si ya tiene 2 dígitos enteros y aún no hay punto
    if (rawValue.length > this.maxEnteros) {
      const enteros = rawValue.substring(0, this.maxEnteros);
      const decimales = rawValue.substring(this.maxEnteros, this.maxEnteros + this.maxDecimales);
      rawValue = `${enteros}.${decimales}`;
    }

    // Si solo hay 1 o 2 dígitos, dejarlo como está o agregar punto
    else if (rawValue.length === this.maxEnteros) {
      rawValue = `${rawValue}.`;
    }

    input.value = rawValue;
    this.control.control?.setValue(+rawValue); // Actualiza el form control
  }
}
