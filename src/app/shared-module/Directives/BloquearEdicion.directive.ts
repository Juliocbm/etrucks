import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBloquearEdicion]'
})
export class BloquearEdicionDirective {
  @Input() appBloquearEdicion: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.appBloquearEdicion) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (this.appBloquearEdicion) {
      event.preventDefault();
    }
  }

  @HostListener('cut', ['$event'])
  onCut(event: ClipboardEvent) {
    if (this.appBloquearEdicion) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    if (this.appBloquearEdicion) {
      event.preventDefault();
      this.renderer.setProperty(this.el.nativeElement, 'value', this.el.nativeElement.defaultValue);
    }
  }

  @HostListener('focus', ['$event'])
  onFocus() {
    if (this.appBloquearEdicion) {
      // Evita que aparezca el cursor o el teclado móvil
      this.el.nativeElement.blur();
    }
  }
}
