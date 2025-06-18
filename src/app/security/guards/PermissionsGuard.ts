import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { delay, map, finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { PERMISOS } from '../Permisos.constants';
@Injectable({
    providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {

  PERMISOS = PERMISOS;

    constructor(
        private authService: AuthService, 
        private router: Router,
        private spinner: NgxSpinnerService
    ) { 
    }

    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> {
        console.log('JCBM-NEXT', next);
      const idMenu = next.data['idMenu'];
      this.spinner.show();

      return of(true).pipe(
          delay(1000),
          map(() => {
             
              const hasPermission = this.authService.hasPermission(this.PERMISOS['VER'].idPermiso, idMenu);
              
              if (!hasPermission) {
                  this.router.navigate(['/access-denied']);
                  return false;
              }

              return true;
          }),
          finalize(() => {
              this.spinner.hide();
          })
      );
  }
  
}

