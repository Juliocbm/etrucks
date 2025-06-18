import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  forwardRef,
  Renderer2
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FormatNumberService } from './../services/formatNumber.Service';


@Directive({
  selector: '[onlyDigit]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OnlyDigitDirective),
      multi: true
    }
  ]
})
export class OnlyDigitDirective implements OnInit, OnChanges, ControlValueAccessor {
  private _format: string = '';
  private _showZero: boolean = true;

  @Input('onlyDigit')
  set format(value: string) {
    this._format = value?.toLowerCase() || '';
  }

  get format(): string {
    return this._format;
  }

  @Input()
  set showZero(value: string) {
    this._showZero =  (value == 'true') ? true : false;
  }

  get showZero(): boolean {
    return this._showZero;
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2, private formatNumberService: FormatNumberService) {
    this.renderer.addClass(this.el.nativeElement, 'text-end');
  }

  ngOnInit() {
    this.writeValue(this.el.nativeElement.value); // Establecer el valor inicial con el formato
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['format']) {
      this.writeValue(this.el.nativeElement.value); // Actualizar el valor con el nuevo formato
    }
  }

  writeValue(value: any): void {
    if (value == null || isNaN(value) || value === "") return;

    let formattedValue = value;
   
    if (this.format != 'id') {
 
      formattedValue = this.formatNumberService.formatNumber(value, this.format);
    } 

    this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue); // Asignar el valor formateado al campo
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {

    if (value == null) return;

    let formattedValue = value;

    if (this.format != 'id') {
      formattedValue = this.formatNumberService.formatNumber(formattedValue, this.format);
    }else{
      formattedValue = formattedValue.replace(/[^0-9-]*/g, '');
    }

    this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);

    if (this.onChange) {
      const numericValue = parseFloat(formattedValue.replace(/[^0-9.-]*/g, ''));
      this.onChange(isNaN(numericValue) ? null : numericValue);
    }
  }

  @HostListener('blur')
  onBlur() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

}