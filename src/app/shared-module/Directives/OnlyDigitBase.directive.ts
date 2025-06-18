import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyDigitBase]'
})
export class OnlyDigitBaseDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    console.log(event.key);
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }
}