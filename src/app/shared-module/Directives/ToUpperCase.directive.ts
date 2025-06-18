import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[toUpperCase]'
})
export class ToUpperCaseDirective {

  constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event.target.value']) onInputChange(value: string) {
    this.ngControl?.control?.setValue(value.toUpperCase(), { emitEvent: false });
  }

  // @HostListener('input', ['$event']) onInput(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   const valorMayusculas = input.value.toUpperCase();
  //   input.value = valorMayusculas; // Convierte el valor del input a mayúsculas
  // }
}