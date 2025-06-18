import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiAcumaticaService {
  // private API_URL = 'http://localhost:5095/api/';
  private API_URL = environment.API_URL_ASIG_AUTO;//'https://tools.apphgtransportaciones.com/API_HGToolsPortal/api/';
  private API_TimbradosLis = environment.API_URL_LIS;//'http://hg.lisinter.midireccion.com/';
  // private API_TimbradosLis = 'https://lisinter.apphgtransportaciones.com/';
  // private API_TimbradosLis = 'https://localhost:44388/';

  idCompania: number = 0;
  idUsuario:string = "";

  constructor(private http: HttpClient) {
    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
  }

  //EndPoints
  obtenerDatos(busquedaInterface: number): Observable<any> {
    const apiUrl = `${this.API_URL}Timbrado/GetTimbrados` + `?interfaz=${busquedaInterface}&guia=${this.idCompania}`;
    console.log(busquedaInterface,this.idCompania);
    return this.http.get<any>(apiUrl);
  }

  timbrarDatosLis(database: number, guia: string): Observable<any> {
    const apiUrl = `${this.API_TimbradosLis}TimbraRemision`+ `?database=${database}&remision=${guia}`;
    const requestBody = { database: database, remision: guia }; // Create the request body
    return this.http.post<any>(apiUrl, requestBody);
  }


  // BLOQUEOS EN BASE DE DATOS
  getBloqueosDb(): Observable<any> {
    const apiUrl = `${this.API_URL}api/BloqueosDB/GetBloqueosDB` + `?compania=${this.idCompania}`;
    return this.http.get<any>(apiUrl);
  }

  setBloqueosDb(sessionId: number, hostName:string): Observable<any> {
    const apiUrl = `${this.API_URL}api/BloqueosDB/SetBloqueosDB` + `?idSistema=${this.idCompania}&sessionId=${sessionId}&hostName=${hostName}`;
    const requestBody = { idSistema: this.idCompania, sessionId: sessionId, hostName: hostName }; // Create the request body
    return this.http.post<any>(apiUrl,requestBody);
  }



}
