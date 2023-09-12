import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from '../../Interfaces/MenuItem';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';

  public menuItems: MenuItem[] = [];
  public menuItemsChanged = new Subject<MenuItem[]>();  
  public usuario: string | null = null;
  public usernameChanged = new Subject<string | null>();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) { 
    this.loadAuthState();
  }

  login(credentials: any) {
    return this.http.post('https://localhost:7228/api/auth/login', credentials)
      .pipe(
        tap(response => {
          const token = (response as any).token;    
          localStorage.setItem(this.tokenKey, token);   
          this.setAuthState(token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('usuario');
    this.usernameChanged.next(null);
    this.menuItemsChanged.next([]);  
    this.usuario = null;
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  private setAuthState(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.usuario = decodedToken.Usuario;
    localStorage.setItem("usuario", decodedToken.Usuario);
    this.usernameChanged.next(decodedToken.Usuario);
    try {
      const menuArray: MenuItem[] = JSON.parse(decodedToken.Menus);
      this.menuItems = menuArray;
      this.menuItemsChanged.next(menuArray);
    } catch (error) {
      console.error("Error al parsear el menú:", error);
    }
  }

  loadAuthState() {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.setAuthState(token);
    } else {
      this.logout();
    }
  }
}
