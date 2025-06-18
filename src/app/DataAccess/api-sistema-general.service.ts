import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ElementoDetalle } from '../models/SistemaGeneral/ElementoDetalle';
import { environment } from '../environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiSistemaGeneralService {

  // private API_URL = 'https://eapis.apphgtransportaciones.com/generales/v1/'//'https://eapis.apphgtransportaciones.com/generales/v1/';
  //private API_URL = 'https://localhost:7061/v1/'//'https://eapis.apphgtransportaciones.com/generales/v1/';
  private API_URL = environment.API_URL_GENERALES;

  idCompania: number = 0;
  idUsuario:string = "";

  constructor(private http: HttpClient) {
    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
   }

  enviarRegistro(registro:ElementoDetalle): Observable <ElementoDetalle>{
    registro.creadoPor = this.idUsuario;
    registro.modificadoPor = this.idUsuario;
    return this.http.post<ElementoDetalle>(this.API_URL + 'ElementosCatalogo', registro);

  }

  obtenerRegistro(idCatPadre: any, activos?:boolean): Observable<any> {
    let params  = new HttpParams();
    params  = params.set('activos', activos ?? false);
    params  = params.set('idCatGeneral', idCatPadre);
    return this.http.get<any>(this.API_URL + 'elementosCatalogo/' , { params });
  }

  obtenerRegistroV2(idCatPadre: any, activos?:boolean): Observable<any> {
    let params  = new HttpParams();
    params  = params.set('activos', activos ?? false);
    params  = params.set('idCatGeneral', idCatPadre);
    return this.http.get<any>(this.API_URL + 'ElementosCatalogoHgTools/' , { params });
  }

  actualizarDatos(elemento: ElementoDetalle): Observable<ElementoDetalle> {
    elemento.modificadoPor = this.idUsuario;
    return this.http.put<ElementoDetalle>(this.API_URL + 'ElementosCatalogo', elemento);
  }

  obtenerInfoPadre(idCatPadre:string): Observable<any> {
    return this.http.get<any>(this.API_URL + 'CatalogosGenerales?idCatgGen='+ idCatPadre );
  }
}
