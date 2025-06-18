import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem,Compania } from '../../Interfaces/MenuItem';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';  // Observable añadido aquí
import { Menu, Permiso } from '../../security/models/Menu';
import { environment } from 'src/app/environments/environment.prod';
import { MENU_BD } from '../../paths.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  public menuItems: Menu[] = [];
  public menuItemsChanged = new Subject<Menu[]>();
  public permisosItems: Permiso[] = [];
  public companiasBehaviour = new BehaviorSubject<Compania[]>([]);
  companiasItems$ = this.companiasBehaviour.asObservable();
  public usuario: string | null = null;
  public usernameChanged = new Subject<string | null>();
  public companias: Compania[] = [];
  public companiaChanged = new Subject<Compania[]>();
  MENU_BD = MENU_BD;


  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {
    this.loadAuthState();
  }


  logout(): void {
    // Limpiar todo el localStorage
    localStorage.clear();
    
    // Actualizar estado de la aplicación
    this.usernameChanged.next(null);
    this.menuItemsChanged.next([]);
    this.usuario = null;
    window.location.reload();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  public setAuthState(token: string) {
      
    localStorage.setItem(this.tokenKey, token);
    const decodedToken = this.jwtHelper.decodeToken(token);

    try {
      let objUs = JSON.parse(decodedToken.Usuario);
      this.usuario = objUs.Usuario;
      this.usernameChanged.next(objUs.Usuario);
      localStorage.setItem('usuario', objUs.Usuario);
      localStorage.setItem('idUsuario', objUs.IdUsuario);
    } catch (error) {}
  }

  public setMenuCompania(objetoSeg: any) {
    console.log('JCBM-SET-MENU-COMPANIA', objetoSeg);

    try {
      this.permisosItems = objetoSeg.permisos;
      localStorage.setItem('permisos', JSON.stringify(this.permisosItems));

      this.companias = objetoSeg.companias;
      this.companiasBehaviour.next(this.companias);

      this.menuItems = objetoSeg.menu;
      localStorage.setItem('menu', JSON.stringify(this.menuItems));
      
    } catch (error) {}
  }

  public obtenerMenu(): Menu[] {
    return JSON.parse(localStorage.getItem('menu') ?? '[]');
  }

  public obtenerPermisos(): Permiso[] {
    return JSON.parse(localStorage.getItem('permisos') ?? '[]');
  }

  /* 
  private setAuthState(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    try {
      // Procesar usuario
      let objUs = JSON.parse(decodedToken.Usuario);
      this.usuario = objUs.Usuario;
      this.usernameChanged.next(objUs.Usuario);
      localStorage.setItem("usuario", objUs.Usuario);
      localStorage.setItem("idUsuario", objUs.IdUsuario);

      // Procesar compañías primero
      const companiasArray: Compania[] = JSON.parse(decodedToken.Companias);
      this.companias = companiasArray;
      this.companiaChanged.next(companiasArray);
      
      // Establecer compañía por defecto si no hay una seleccionada
      if (companiasArray.length > 0) {
        if (!localStorage.getItem('CompaniaSelect')) {
          // Asegurarse de que IdCompania se maneje como string
          const idCompania = companiasArray[0].IdCompania.toString();
          localStorage.setItem('CompaniaSelect', idCompania);
        }
      }

      // Ahora procesamos los menús
      const menuArray: MenuItem[] = JSON.parse(decodedToken.Menus);
      this.menuItems = menuArray;
      this.menuItemsChanged.next(menuArray);
      localStorage.setItem("DECODE-TOKEN", decodedToken.Menus);
    } catch (error) {
      console.error("Error al parsear el menú:", error);
    }
  } */

  loadAuthState() {
    const token = this.getToken();
    
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.setAuthState(token);
      // console.log('JCBM-LOAD-AUTH-STATE', token);
    } else {
      // Limpiar estado cuando no hay token o está expirado
      this.usernameChanged.next(null);
      this.menuItemsChanged.next([]);
      this.companiaChanged.next([]);
      this.usuario = null;
      this.menuItems = [];
    }
  }

  hasPermission(idPermiso: number, idMenu: number): boolean {
    const permisos = this.obtenerPermisos();
    const idCompaniaSelect = this.getCompaniaSelect();
    return permisos.some(p => p.idMenu === idMenu && p.idPermiso === idPermiso && p.idCompania === idCompaniaSelect);
  }

   getCompaniaSelect(): number {
    const companiaStorage = localStorage.getItem('CompaniaSelect');
    let companiaSelect = 0;
   
    if (companiaStorage === null || companiaStorage === undefined) 
      companiaSelect = 0;
    else
      companiaSelect = Number(companiaStorage);

    return companiaSelect;
  }

  getMenuByCveMenu(cveMenu: string): Menu {

    const idMenu = this.MENU_BD[cveMenu].idMenu;
    const menuItem = this.obtenerMenu().find(m => m.idMenu === idMenu);
    localStorage.setItem('lastMenuObj', JSON.stringify(menuItem));
  
    return {
      idMenu: menuItem?.idMenu || 0,
      idPadre: null,
      menu: menuItem?.menu || '',
      url: menuItem?.url || '',
      idCompania: this.getCompaniaSelect()
    };
  } 
 
}
