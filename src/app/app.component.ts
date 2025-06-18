import { Component, HostListener, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './security/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'HGPortalTools';
  permisosCargados: boolean = false;
  screenHeight: number = 0;
  contentHeight: number = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.screenHeight = window.innerHeight;
    this.calculateContentHeight();
  }

  ngOnInit(): void {
    this.spinner.show();

    if (this.authService.isLoggedIn()) {
      // Lógica para usuarios autenticados
    }

    this.spinner.hide();
  }

  onPermisosCargados() {
    if (this.authService.isLoggedIn()) {
      // Lógica adicional si es necesario
    }
    this.permisosCargados = true;
    this.spinner.hide();
  }

  /**
   * Detecta cambios en el tamaño de la ventana y recalcula alturas
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
    this.calculateContentHeight();
  }

  /**
   * Calcula la altura disponible para el contenido
   */
  private calculateContentHeight() {
    // Asumimos altura aproximada de header (70px) y footer (50px)
    const headerFooterHeight = 120;
    this.contentHeight = this.screenHeight - headerFooterHeight;
  }
}
