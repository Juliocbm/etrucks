import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxLength]'
})
export class MaxLengthDirective {

  @Input('appMaxLength') maxLength!: number; 

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const trimmedValue = input.value.slice(0, this.maxLength);
    if (trimmedValue !== input.value) {
      input.value = trimmedValue;
      input.dispatchEvent(new Event('input'));
    }
  }
}
