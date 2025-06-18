import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { cpMunicipio } from "../models/catalogo-sat/cpMunicipio";
import { environment } from "../environments/environment.prod";

@Injectable({
    providedIn: 'root'
})
export class ApiCpMunicipio {
    private API_URL = environment.API_URL_ASIG_AUTO;//'https://tools.apphgtransportaciones.com/API_HGToolsPortal/v1/'//'https://localhost:7025/v1/';//'https://localhost:7079/v1/';
    idCompania: number = 0;
    idUsuario:string = "";

    constructor(private http: HttpClient){

        this.idUsuario = localStorage.getItem('idUsuario')??'';
        this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;

    }

    //EndPoints
    obtenerDatos(page : number): Observable<any> {
        return this.http.get<any>(`${this.API_URL}v1/AcumaticaCatalogoSatCp/ByPage/` + this.idCompania + '/' + page);
      }

      obtenerDato( id : cpMunicipio):Observable<any>{
        return this.http.get<any>(this.API_URL + 'v1/AcumaticaCatalogoSatCp/' + this.idCompania + '/' + id + '/')
    }

    enviarDatos(cp: cpMunicipio): Observable<cpMunicipio> {
        return this.http.post<cpMunicipio>(this.API_URL + 'v1/AcumaticaCatalogoSatCp', cp);
      }

      actualizarDatos(cp: cpMunicipio): Observable<cpMunicipio>{
        return this.http.put<cpMunicipio>(this.API_URL + 'v1/AcumaticaCatalogoSatCp/' + cp.id + '/', cp);
    }
}
