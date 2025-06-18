import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Bitacora } from 'src/app/models/Serv. Cliente/Bitacoras/Bitacora';

@Injectable({
  providedIn: 'root'
})
export class ApiOperadoresApiService {
  //  private url = 'https://localhost:7182/api/'; // https://localhost:7025/api/Operadores/GetOperadores https://localhost:7182/swagger/index.html
  // private url = 'https://opera.apphgtransportaciones.com/api/api/';
  private url = environment.API_OPERADORES;


  private usuario: string = 'JVILLA';
  private password: string = "Apodaca123";
  private idSistema: number = 1;
  private headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };


  constructor(private http: HttpClient){
    this.authLogin().subscribe(
      (data) => {
        localStorage.setItem('token', data.token);
      }
    );
  }

  authLogin(): Observable<any> {
    return this.http.post<any>(`${this.url}Security/login`, {usuario: this.usuario, contrasena: this.password , idSistema: this.idSistema});
  }

  // Bitacora
  obtenerDatos(): Observable<any> {
    return this.http.get<any>(`${this.url}Bitacoras/` , { headers: this.headers });
  }

  // Crear Bitacora
  crearBitacora(bitacora: Bitacora): Observable<any> {
    // console.log(`${this.url}Bitacoras`, bitacora , { headers: this.headers });

    return this.http.post<Bitacora>(`${this.url}Bitacoras`, bitacora, { headers: this.headers })
    .pipe(
      catchError(error => {
        console.error('Error en la solicitud:', error);
        throw error;
      })
    );
  }






  // Catalogos Generales de Bitacora
  obtenerCatalogosGeneralCliente(compania: number): Observable<any> {
    return this.http.get<any>(`${this.url}CatalogoGeneral/clientes/` + compania, { headers: this.headers });
  }

  obtenerCatalogosGeneralUnidades(compania: number): Observable<any> {
    return this.http.get<any>(`${this.url}CatalogoGeneral/unidades/` + compania, { headers: this.headers });
  }

  obtenerCatalogosGeneralFlotas(compania: number): Observable<any> {
    return this.http.get<any>(`${this.url}CatalogoGeneral/flotas/` + compania, { headers: this.headers });
  }

  obtenerCatalogosGeneralPeriodo(compania: number): Observable<any> {
    return this.http.get<any>(`${this.url}CatalogoGeneral/bitacoraPeriodo/` + compania, { headers: this.headers });
  }

  obtenerCatalogosGeneralOperadores(): Observable<any> {
    return this.http.get<any>(`${this.url}Usuarios` , { headers: this.headers });
  }





  // Catalogo General ViewCatGeneral
  obtenerCatalogosGeneralViewCatGeneralBitEstatus(): Observable<any> {
    return this.obtenerCatalogosGeneralViewCatGeneral('7D6F7013-7D0F-4E31-9009-9E45241DE149');
  }

  obtenerCatalogosGeneralViewCatGeneralBitTurno(): Observable<any> {
    return this.obtenerCatalogosGeneralViewCatGeneral('F9697752-D669-4AAB-A941-49CE6974002C');
  }

  private obtenerCatalogosGeneralViewCatGeneral(catGeneral: string): Observable<any> {
    return this.http.get<any>(`${this.url}VwCatGenerals/` + catGeneral, { headers: this.headers });
  }

}
