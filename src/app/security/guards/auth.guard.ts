import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn() || state.url === '/reset-password') {
      return true;
    }

    // Guarda la URL original para redirigir después del login
    localStorage.setItem('redirectUrl', state.url);
    
    // Redirige al usuario al login con un mensaje opcional
    this.router.navigate(['/login'], { queryParams: { reason: 'notAuthenticated' } });
    return false;
  }
}
