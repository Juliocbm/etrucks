import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from '../../security/services/auth.service';
import { MenuItem } from '../../Interfaces/MenuItem';
import { Subscription } from 'rxjs';
import { PERMISOS } from '../../security/Permisos.constants';
@Directive({
  selector: '[hasPermission]',
})
export class PermissionsDirective {

    permisos:any[] = [];
    idCompania: number = 0;
    idUsuario: string = '';

    constructor(
    private authService: AuthService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
   
  }

  @Input() set hasPermission([permiso, idMenu]: [
    string,  
    number
  ]) {
    
    let idPermiso: number = 0;
    permiso = permiso.toUpperCase();
    idPermiso = PERMISOS[permiso].idPermiso;
   
     const valid = this.authService.hasPermission(idPermiso, idMenu);
   
    //logica para un mat-slide-toggle ya que añadir class disabled no funciona en este tipo de componente
    if (this.isMatSlideToggle()) {
      if (valid) {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'block !important');
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none !important');
      }
    } else {
      //lógica para botones y otros elementos
      if (valid) {
        this.renderer.removeClass(this.el.nativeElement, 'disabled');
        this.renderer.listen(this.el.nativeElement, 'click', (event) => {
          /* permitir acción */
        });
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none !important');
        this.renderer.listen(this.el.nativeElement, 'click', (event) => {
          event.preventDefault();
        });
      }
    }
  }

  //saber si el componente donde se uso la directiva es un mat-slide-toggle
  private isMatSlideToggle(): boolean {
    return this.el.nativeElement.classList.contains('mat-mdc-slide-toggle');
  }
}
