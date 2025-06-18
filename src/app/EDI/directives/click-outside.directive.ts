import { Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  @Input() clickOutsideEnabled = true;
  private wasInside = false;

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:mousedown', ['$event.target'])
  public onMouseDown(target: any) {
    this.wasInside = this.elementRef.nativeElement.contains(target);
  }

  @HostListener('document:mouseup', ['$event.target'])
  public onClick(target: any) {
    if (!this.clickOutsideEnabled) {
      return;
    }
    
    const clickedInside = this.elementRef.nativeElement.contains(target);
    
    // Solo emitir el evento si el clic comenzó y terminó fuera del elemento
    if (!clickedInside && !this.wasInside) {
      this.clickOutside.emit();
    }
  }
}
