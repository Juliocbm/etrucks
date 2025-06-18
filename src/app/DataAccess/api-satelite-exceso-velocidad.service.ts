import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiSateliteExcesoVelocidadService {
  private API_URL = environment.API_URL_ASIG_AUTO;//'https://tools.apphgtransportaciones.com/API_HGToolsPortal/';
  //private API_URL = 'https://retoolapi.dev/tMRmZK/'; // https://retoolapi.dev/bvqLyA/repoVelocidad
  // private API_URL = 'https://localhost:7006/v1/';


  idCompania: number = 0;
  idUsuario:string = "";

  constructor(private http: HttpClient) {
    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
  }

  //EndPoints
  obtenerDatos(): Observable<any> {
    const apiUrl = `${this.API_URL}v1/SamsaraExcessiveSpeed/excessive-speed`;
    return this.http.get<any>(apiUrl);
  }

  obtenerViajes(shipment:boolean): Observable<any> {
    const apiUrl = `${this.API_URL}api/ReporteSeguimientoViaje/`+ this.idCompania;
    const params = {shipment:shipment}
    return this.http.get<any>(apiUrl, { params });
  }

  obtenerDetalle(shipment:string): Observable<any> {
    const params = { shipment:shipment,  idCompania: this.idCompania };
    const apiUrl = `${this.API_URL}api/ReporteSeguimientoViaje/Detalle`;
    return this.http.get<any>(apiUrl, {params} );
  }

  enviarShipments(shimpments: string[]): Observable<any> {

    return this.http.post<any>(this.API_URL + 'api/ReporteSeguimientoViaje/'+ this.idCompania, shimpments);
  }

}
