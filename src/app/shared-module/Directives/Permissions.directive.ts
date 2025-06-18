import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../security/services/auth.service';

@Directive({
  selector: '[]'
})
export class PermissionsDirective {

  constructor(private authService: AuthService, private el: ElementRef, private renderer: Renderer2) { }

  @Input() set hasPermission([requiredPermission, nombreMenu]: ['Crear' | 'Editar' | 'Eliminar' | 'Imprimir'| 'Ver', string]) {
    
  }

  //saber si el componente donde se uso la directiva es un mat-slide-toggle
  private isMatSlideToggle(): boolean {
    return this.el.nativeElement.classList.contains('mat-mdc-slide-toggle');
  }
}
