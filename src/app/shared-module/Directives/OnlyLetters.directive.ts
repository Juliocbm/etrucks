import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[onlyLetters]'
})
export class OnlyLettersDirective {
  private regex: RegExp = new RegExp(/^[a-zA-Z\s]*$/); // Solo letras y espacios
  private specialKeys: string[] = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight'];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Permitir teclas especiales
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    // Verificar si la tecla presionada es válida
    if (!this.regex.test(event.key)) {
      event.preventDefault(); // Bloquear la entrada
    }
  }
}
