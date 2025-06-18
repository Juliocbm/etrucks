import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { GeneralParametersService } from '../../services/general-parameters.service';
import { AuthService } from '../../../security/services/auth.service';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/Interfaces/MenuItem';
import { ApiSecurityService } from '../../../DataAccess/api-security.service';
import { Menu } from 'src/app/security/models/Menu';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy  {
  @ViewChild('menuContainer') menuContainer: ElementRef | undefined;
  
  public username: string | null = null;
  public menuItems: any[] = [];
  public companias: any[] = [];
  public companiaSelect: number = 0;
  public isLogin: boolean = false;
  public hasMenuOverflow: boolean = false;
  @Output() permisosCargados = new EventEmitter<void>();

  public companyLogos: { [key: number]: string } = {
    1: 'assets/icons/Empresas/hgTransportaciones.svg',
    2: 'assets/icons/Empresas/chTransportaciones.svg',
    3: 'assets/icons/Empresas/rlTransportaciones.svg',
    4: 'assets/icons/Empresas/lindaTransportaciones.svg',
    5: 'assets/icons/Empresas/absolute.svg'
  };

  // Observer para detectar cambios de tamaño en la ventana
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private generalParametersService: GeneralParametersService,
    public authService: AuthService,
    private router: Router,
    private seguridad: ApiSecurityService
  ) {
    this.isLogin = this.authService.isLoggedIn();
  }

  private buildMenuTree(menuItems: Menu[]): Menu[] {
    const itemsWithParents = menuItems.filter((item) => item.idPadre !== null);
    const topLevelItems = menuItems.filter((item) => item.idPadre === null);

    const findChildren = (parentItem: Menu): Menu[] => {
      let items = itemsWithParents
        .filter((item) => item.idPadre === parentItem.idMenu)
        .map((item) => ({
          ...item,
          children: findChildren(item) || [], // Inicializa children como un arreglo vacío si es necesario
        }));

      return items;
    };

    return topLevelItems.map((item) => ({
      ...item,
      children: findChildren(item) || [], // Inicializa children como un arreglo vacío si es necesario
    }));
  }


  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.usuario;
     
      this.seguridad.getPermisosByUsuario().subscribe((data) => {
        this.authService.setMenuCompania(data.item);
        this.cargarMenuCompanias();
        this.permisosCargados.emit();
      });
    }
  }

  ngAfterViewInit() {
    // Inicializar el ResizeObserver para detectar cambios en el tamaño
    this.initResizeObserver();
    
    // Verificamos el overflow inicialmente después de que el DOM esté listo
    setTimeout(() => {
      this.checkForOverflow();
    }, 500);
  }

  ngOnDestroy() {
    // Desconectar el ResizeObserver al destruir el componente
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    // Eliminamos el event listener de resize
    window.removeEventListener('resize', this.checkForOverflow.bind(this));

    const container = this.menuContainer?.nativeElement;
    if (container) {
      container.removeEventListener('scroll', this.handleScroll);
    }
  }

  /**
   * Inicializa el ResizeObserver para detectar cambios en el tamaño del contenedor
   */
  private initResizeObserver() {
    // Comprobamos si el navegador soporta ResizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkForOverflow();
      });
      
      const menuContainer = document.querySelector('.menu-scroll-container');
      if (menuContainer) {
        this.resizeObserver.observe(menuContainer);
      }
    } else {
      // Fallback para navegadores que no soportan ResizeObserver
      window.addEventListener('resize', this.checkForOverflow.bind(this));
    }
  }

  /**
   * Comprueba si el menú tiene overflow y aplica la clase correspondiente
   */
  checkForOverflow() {
    setTimeout(() => {
      const container = this.menuContainer?.nativeElement;
      if (container) {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        this.hasMenuOverflow = hasOverflow;
        if (hasOverflow) {
          container.classList.add('has-overflow');
          
          // Añadir evento de scroll para activar/desactivar indicadores
          container.addEventListener('scroll', this.handleScroll);
          
          // Verificar estado inicial
          this.handleScroll({ target: container });
        } else {
          container.classList.remove('has-overflow');
          container.removeEventListener('scroll', this.handleScroll);
        }
      }
    }, 100);
  }

  // Manejador de evento de scroll para mostrar/ocultar indicadores
  handleScroll = (event: any) => {
    const container = event.target;
    const isAtStart = container.scrollLeft <= 10;
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
    
    // Ajustar opacidad de indicadores según posición
    if (isAtStart) {
      container.style.setProperty('--start-indicator-opacity', '0');
    } else {
      container.style.setProperty('--start-indicator-opacity', '1');
    }
    
    if (isAtEnd) {
      container.style.setProperty('--end-indicator-opacity', '0');
    } else {
      container.style.setProperty('--end-indicator-opacity', '1');
    }
  }

  /**
   * Desplaza el menú horizontal en la dirección especificada
   * @param direction Dirección del desplazamiento: 'left' o 'right'
   */
  scrollMenu(direction: 'left' | 'right') {
    // Obtener el contenedor de scroll (menú completo)
    const scrollContainer = document.querySelector('.menu-scroll-container');
    
    if (scrollContainer) {
      // Calculamos la cantidad a desplazar (aproximadamente 200px o según necesidades)
      const scrollAmount = 200;
      
      if (direction === 'left') {
        scrollContainer.scrollLeft -= scrollAmount;
      } else {
        scrollContainer.scrollLeft += scrollAmount;
      }
      
      // Actualizamos el estado de los indicadores después del desplazamiento
      this.handleScroll({ target: scrollContainer });
      
      console.log(`Desplazando ${direction}, scrollLeft: ${scrollContainer.scrollLeft}`);
    } else {
      console.error('No se encontró el contenedor del menú para desplazar');
    }
  }

  onCompanyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    localStorage.setItem('CompaniaSelect', selectElement.value);
    this.router.navigate(['/home']);
    window.location.reload();
  }

  cargarMenuCompanias() {
    this.companias = this.authService.companiasBehaviour.getValue();

    if (this.companias.length > 0) {
      this.companiaSelect = this.authService.getCompaniaSelect();

      if (this.companiaSelect === 0) {
        localStorage.setItem('CompaniaSelect', this.companias[0].idCompania);
        this.companiaSelect = this.companias[0].idCompania;
      }
    }

    this.menuItems = this.authService.obtenerMenu();
    this.menuItems = this.buildMenuTree(this.menuItems);

    this.authService.usernameChanged.subscribe((newUsername: string | null) => {
      this.username = newUsername;
    });

    setTimeout(() => {
      this.checkForOverflow();
    }, 100);
  
  }

  getCompanyLogo(): string {
    const companyId = Number(this.companiaSelect) || 1;
    return this.companyLogos[companyId] || this.companyLogos[1];
  }

  // hasSubItems(parentId: number): boolean {
  //   return this.menuItems.some(item => item.IdPadre === parentId);
  // }
}
