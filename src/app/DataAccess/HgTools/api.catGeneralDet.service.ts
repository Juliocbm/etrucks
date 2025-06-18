import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiCatGenDetService {

  //private API_URL = 'https://localhost:7061/v1/';//environment.API_URL_HGTOOLS;
  private API_URL = environment.API_URL_GENERALES;
  //private API_URL_ETRUCKS = environment.API_URL_GENERALES_ETRUCKS;
  idCompania: number = 0;
  idUsuario:string = "";

  controllerCatGeneralDet: string = "ElementosCatalogoHgTools/";
  controllerCatGeneralDetETrucks: string = "ElementosCatalogo/";
  controllerGeography: string = "GeographyHgTools/";
  constructor(private http: HttpClient) {

    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// CAT GENERAL TOOLS //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerCatGeneralDet(idCatGeneralDet : string): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerCatGeneralDet + '?idCatGeneral=' + idCatGeneralDet );
  }

  obtenerEstados(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerGeography + 'estados/' + 1);
  }

  obtenerMunicipios(idEstado: number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerGeography + 'municipios/' + idEstado);
  }

//////////////////////////////////////////////////////////////////////////
////////////////////////////// CAT GENERAL ETRUCKS ///////////////////////
//////////////////////////////////////////////////////////////////////////
  
obtenerCatGeneralDetETrucks(idCatGeneralDet : string): Observable<any> {
  return this.http.get<any>(this.API_URL + this.controllerCatGeneralDetETrucks + '?idCatGeneral=' + idCatGeneralDet );
}


}