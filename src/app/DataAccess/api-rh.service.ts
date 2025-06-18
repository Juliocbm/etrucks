import { ParametrosGenerales } from './../models/SistemaGeneral/ParametrosGenerales';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { Sucursal } from '../models/RH/sucursal';
import { HttpService } from '../Services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiRhService {
  private API_URL = environment.API_URL_RH;
  private API_URL_COBRANZA = environment.API_URL_COBRANZA;
  // private API_URL = 'https://localhost:7093/api/';
  // private API_URL_COBRANZA = 'https://localhost:61180/api/';

  private idCompania: number = 0;
  private idUsuario: string = "";


  constructor(private http: HttpClient, private httpService: HttpService) {
    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
  }

  private controllerSucursales: string = 'Sucursal/';

  //EndPoints
  obtenerDatos(): Observable<any> {
    console.log('GetRepNuevoAdeudos?'+this.idCompania);
    console.log(`${this.API_URL}GetRepNuevoAdeudos?` + this.idCompania);
    return this.http.get<any>(`${this.API_URL}GetRepNuevoAdeudos?compania=` + this.idCompania);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// SUCURSALES ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerSucursales() : Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSucursales + this.idCompania);
  }

  enviarSucursal(sucursal: Sucursal) : Observable<any> {
    sucursal.idCompania = this.idCompania;
    sucursal.creadoPor = this.idUsuario;
    sucursal.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerSucursales, sucursal);
  }

  actualizaSucursal(idSucursal: number, sucursal: Sucursal) : Observable<any> {
    sucursal.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerSucursales + idSucursal, sucursal);
  }


  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// PROC.ODESA ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  // TOOLS PROCESO ODESSA
  // obtenerDatosMoper(): Observable<any> {
  //   console.log('GetRepMoper?'+this.idCompania);
  //   return this.http.get<any>(`${this.API_URL_COBRANZA}api/GetRepMoper?idCompania=` + this.idCompania);
  // }

  // fileUpload(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   console.log('URL:', `${this.API_URL_COBRANZA}FileUpload`);
  //   return this.http.post<any>(`${this.API_URL_COBRANZA}FileUpload`, formData);
  // }

  // Pendientes de confirmar
  // obtenerDatosPendientesDeConfirmar(): Observable<any> {
  //   return this.http.get<any>(`${this.API_URL_COBRANZA}api/GetPendientesDeConfirmar?idCompania=` + this.idCompania);
  // }

  // Confirmacion de adeudos por idCompania, nombreArchivo
  // confirmarAdeudos(idCompania: number, nombreArchivo: string): Observable<any> {
  //   return this.http.post<any>(`${this.API_URL_COBRANZA}api/ConfirmarDescuentosOdessa?idCompania=` + idCompania + '&archivoConfirmacion=' + nombreArchivo, null);
  // }




  //* RH(EAPIS) PROCESO ODESSA *//
  
  // Pendientes de confirmar - GET
  obtenerDatosPendientesDeConfirmar(): Observable<any> {
    return this.http.get<any>(`${this.API_URL_COBRANZA}Odessa/Confirmacion?IdCompania=` + this.idCompania);
  }

  // Confirmacion de adeudos por idCompania, nombreArchivo - PUT
  confirmarAdeudos(idCompania: number, nombreArchivo: string): Observable<any> {
    return this.http.put<any>(`${this.API_URL_COBRANZA}Odessa/Confirmacion?idCompania=` + idCompania + '&archivoConfirmacion=' + nombreArchivo, null);
  }

  // Moper - GET
  obtenerDatosMoper(): Observable<any> {
    return this.http.get<any>(`${this.API_URL_COBRANZA}Odessa/Mopper?IdCompania=` + this.idCompania);
  }

  // Cargar Descuentos (Archivos) - POST
  fileUpload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // console.log('URL:', `${this.API_URL_COBRANZA}FileUpload`);
    return this.http.post<any>(`${this.API_URL_COBRANZA}Odessa/Mopper?IdCompania=` + this.idCompania, formData);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// CATALOGO OPERADOR /////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  // Obtener catalogo de operadores V2 'api/RH/GetVwPersonalOperadorV2' con ParametrosGenerales
  GetVwPersonalOperadorV2( parametros: HttpParams ) : Observable<any>{
    // let params = new HttpParams()
    // .set('ordenarPor', parametros.ordenarPor.toString())
    // .set('noPagina', parametros.noPagina.toString())
    // .set('tamanoPagina', parametros.tamanoPagina.toString())
    // .set('idCompania', parametros.idCompania.toString())
    // .set('multiIds', parametros.multiIds??'')
    // .set('actionMulti', parametros.actionMulti??'');

    // if (parametros.filtrosPorColumna) {
    //   Object.keys(parametros.filtrosPorColumna).forEach(key => {
    //     const filtro = parametros.filtrosPorColumna![key];
    //     if (filtro) {
    //       params = params.set(`filtrosPorColumna[${key}]`, filtro);
    //     }
    //   });
    // }

    // return this.http.get<ParametrosGenerales[]>(`https://localhost:7025/api/RH/GetVwPersonalOperadorV2`, { params } );
    return this.httpService.get(`https://tools.apphgtransportaciones.com/API_HGToolsPortal/api/RH/GetVwPersonalOperadorV2`, { parametros } );
    // return this.http.post<ParametrosGenerales[]>(`${this.API_URL_COBRANZA}api/RH/GetVwPersonalOperadorV2`, { params } );
  }


}
