import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { AlertService, Alert } from '../Services/alerts.service';
import { AuthService } from '../security/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiSecurityService {
  private API_URL = environment.API_URL_SECURITY;
  private ID_SISTEMA: number = 4;
  idCompania: number = 0;
  idUsuario: string = '';

  controllerAuth: string = 'auth/';
  controllerElementosCatalogo: string = 'elementosCatalogo/';
  controllerCatalogosGenerales: string = 'catalogosGenerales/';
  controllerGeography: string = 'geography/';
  controllerParametrosSistema: string = 'parametrosSistema/';
  alert: string = '';

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    
    this.idCompania = this.authService.getCompaniaSelect();
      // Suscribirse a las alertas emitidas por el servicio
      this.alertService.alert$.subscribe((alert: Alert) => {
        this.alert = alert.message;
      });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(
      this.API_URL + this.controllerAuth + 'forgotpassword',
      { email: email, idSistema: this.ID_SISTEMA}
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(
      this.API_URL + this.controllerAuth + 'resetpassword',
      { token, newPassword }
    );
  }

  generateVerificationCode(email: string): Observable<any> {
    return this.http.post(
      this.API_URL + this.controllerAuth + 'generateVerificationCode',
      { email: email, idSistema: this.ID_SISTEMA }
    );
  }

  validateVerificationCode(email: string, code: string): Observable<any> {
    return this.http.post(
      this.API_URL + this.controllerAuth + 'validateVerificationCode' + '/' + code,
      { email: email, idSistema: this.ID_SISTEMA }
    );
  }
  
  //////////////////////////////////////////////////////////////////////////
  ////////////////////// CONSULTAS ESTANDARIZADAS /////////////////////////
  /////////////////////////////////////////////////////////////////////////

  login(credentials: any): Observable<any> {

    return this.http
      .post(this.API_URL + this.controllerAuth + 'login', credentials)
      .pipe(
        // Manejo de éxito
        map((data) => {
             this.alertService.success(
           'login.default.success.autenticacion'
          );
          return data;
        }),
        // Manejo de errores
        catchError((error) => {
          console.log('ERROR LOGIN', error);
          this.alertService.error('login.default.error.autenticacion');
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }



  getPermisosByUsuario(): Observable<any> {
    return this.http
      .get(this.API_URL + this.controllerAuth + 'GetPermissionsByUser/' + this.idUsuario + '/' + this.ID_SISTEMA + '/' + this.idCompania)
      .pipe(
        map((data: any) => {    
          return data;
        }),
        catchError((error) => {
          return of([]);
        })
      );
  }
   
  
}
