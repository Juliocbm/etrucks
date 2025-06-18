/* 

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[PhoneNumber]'
})
export class PhoneNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const trimmedValue = input.value.replace(/\D/g, '').slice(0, 10); // Solo se permiten números y hasta 10 caracteres
    const formattedValue = this.formatPhoneNumber(trimmedValue);
    input.value = formattedValue;
  }

  private formatPhoneNumber(value: string): string {
    const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return formattedValue;
  }
}
 */

import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[PhoneNumber]'
})
export class PhoneNumberDirective implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.formatInputValue();
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    this.formatInputValue();
  }

  private formatInputValue() {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 10); // Solo se permiten números y hasta 10 caracteres
    const formattedValue = this.formatPhoneNumber(value);
    input.value = formattedValue;
  }

  private formatPhoneNumber(value: string): string {
    const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    return formattedValue;
  }
}
