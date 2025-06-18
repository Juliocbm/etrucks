import { Directive, ElementRef, HostListener, Renderer2, Input, OnInit  } from '@angular/core';
import { NgControl,ControlValueAccessor } from '@angular/forms';
import { formatDate } from '@angular/common';

@Directive({
  selector: '[dateFormat]'
})
export class DateTimeFormatDirective implements  OnInit {
  @Input('dateFormat') format?: string = '';

  constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) {}

  @HostListener('dateChange', ['$event']) onDateChange() {

    let string = this.formatDate();
    this.renderer.setProperty(this.el.nativeElement, 'value', string);
  }

  ngOnInit() {
    let string = this.formatDate();
    this.renderer.setProperty(this.el.nativeElement, 'value', string);
  }
 

  ngOnChanges() {
    let string = this.formatDate();

    console.log('CHANGES', string);
    this.renderer.setProperty(this.el.nativeElement, 'value', string);
  }
 
  formatDate(){

    if(this.format == 'date')
      return formatDate(this.control.value,'dd/MM/yyyy','en-US')
    else
      return formatDate(this.control.value,'dd/MM/yyyy hh:mm','en-US')
   }
  }



