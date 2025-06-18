import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[selectorReadOnly]'
})
export class ReadOnlySelectorDirective implements OnInit {

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Desactivar el mat-select
    this.el.nativeElement.disabled = true;
  }
}