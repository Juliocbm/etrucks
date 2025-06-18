import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
//import { HttpService } from 'src/app/shared-module/services/http.service';
import { HttpService } from 'src/app/Services/http.service';
import { EdiClienteParadasGeocerca } from 'src/app/models/Edi/ediClienteParadasGeocercaModel';
import { TipoParadaEvento } from 'src/app/models/Edi/tipoParadaEventoModel';

@Injectable({
    providedIn: 'root'
  })
export class ApiEdiService {

    // URL
    private API_URL = environment.API_URL_EDI;

    // Controller
    private controllerEdi = '';

    // EndPoints
    private endpointTipoParada = 'TipoParada';
    private endpointEvento = 'Evento';
    private endpointConexionDetalle = 'ConexionDetalle';
    private endpointEdiClienteParadas = 'EdiClienteParadas';

    private endpointTipoParadaEvento = 'TipoParadaEvento';
    private endpointEdiClienteParadasGeocerca = 'ediClienteParadasGeocerca';

    // Variables
    private idCompania: number = Number(localStorage.getItem('CompaniaSelect'))??0;
    private idUsuario: string = localStorage.getItem('idUsuario')??'';


    // Constructor
    constructor(
        private httpService: HttpService,
        private http: HttpClient
    ) {
        this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
        this.idUsuario = localStorage.getItem('idUsuario')??'';
    }

    //////////////////////////////////////////////////////
    /////////////////// ConexionDetalle //////////////////
    //////////////////////////////////////////////////////
    getConexionDetalle(parametros: HttpParams): Observable<any>{

      return this.httpService.get(this.API_URL + this.controllerEdi + this.endpointConexionDetalle , { parametros });  
    }


    //////////////////////////////////////////////////////
    /////////////////////// Evento ///////////////////////
    //////////////////////////////////////////////////////
    getEvento(parametros: HttpParams): Observable<any>{
        

      return this.httpService.get(this.API_URL + this.controllerEdi + this.endpointEvento, { parametros });
    }

    //////////////////////////////////////////////////////
    ///////////////////// TipoParada /////////////////////
    //////////////////////////////////////////////////////
    getTipoParada(parametros: HttpParams): Observable<any>{
        

      return this.httpService.get(this.API_URL + this.controllerEdi + this.endpointTipoParada, { parametros });
    }

    /////////////////////////////////////////////////////////////
    ///////////////////// EdiClienteParadas /////////////////////
    /////////////////////////////////////////////////////////////
    getEdiClienteParadas(parametros: HttpParams): Observable<any>{
        

      return this.httpService.get<ParametrosGenerales[]>(this.API_URL + this.controllerEdi + this.endpointEdiClienteParadas, { parametros });
    }

    // By ID
    getEdiClienteParadasById(id: number): Observable<ParametrosGenerales[]>{
        return this.http.get<ParametrosGenerales[]>(this.API_URL + this.controllerEdi + this.endpointEdiClienteParadas + '/' + id);
    }

    ////////////////////////////////////////////////////////////////
    /////////////////// ediClienteParadasGeocerca //////////////////
    ////////////////////////////////////////////////////////////////
    getEdiClienteParadasGeocerca(parametros: HttpParams): Observable<any>{
        

      return this.httpService.get(this.API_URL + this.controllerEdi + this.endpointEdiClienteParadasGeocerca, { parametros });
    }

    // Post List<EdiClienteParadasGeocerca> sin parametros generales
    postEdiClienteParadasGeocerca(ediClienteParadasGeocerca: EdiClienteParadasGeocerca[]): Observable<any[]>{
        return this.http.post<any[]>(this.API_URL + this.controllerEdi + this.endpointEdiClienteParadasGeocerca, ediClienteParadasGeocerca);
    }

    // Put EdiClienteParadasGeocerca
    putEdiClienteParadasGeocerca(ediClienteParadasGeocerca: EdiClienteParadasGeocerca): Observable<any[]>{
        return this.http.put<any[]>(this.API_URL + this.controllerEdi + this.endpointEdiClienteParadasGeocerca, ediClienteParadasGeocerca);
    }

    ///////////////////////////////////////////////////////////////
    /////////////////// TipoParadaEvento //////////////////////////
    ////////////////////////////////////////////////////////////////
    getTipoParadaEvento(parametros: HttpParams): Observable<any>{
        

      return this.httpService.get(this.API_URL + this.controllerEdi + this.endpointTipoParadaEvento, { parametros });
    }

    // POST TipoParadaEvento[]
    postTipoParadaEvento(tipoParadaEvento: TipoParadaEvento[]): Observable<any[]>{
        return this.http.post<any[]>(this.API_URL + this.controllerEdi + this.endpointTipoParadaEvento, tipoParadaEvento);
    }

    // PUT TipoParadaEvento
    putTipoParadaEvento(tipoParadaEvento: TipoParadaEvento): Observable<any[]>{
        return this.http.put<any[]>(this.API_URL + this.controllerEdi + this.endpointTipoParadaEvento, tipoParadaEvento);
    }

    // CRUD operations for TipoParadaEvento
    createTipoParadaEvento(data: any): Observable<any> {
        return this.http.post<any>(this.API_URL + this.controllerEdi + this.endpointTipoParadaEvento, data);
    }

    updateTipoParadaEvento(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.API_URL}${this.controllerEdi}${this.endpointTipoParadaEvento}/${id}`, data);
    }

    deleteTipoParadaEvento(id: number): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}${this.controllerEdi}${this.endpointTipoParadaEvento}/${id}`);
    }

    // CRUD operations for EdiClienteParadasGeocerca
    createEdiClienteParadasGeocerca(data: any): Observable<any> {
        return this.http.post<any>(this.API_URL + this.controllerEdi + this.endpointEdiClienteParadasGeocerca, data);
    }

    updateEdiClienteParadasGeocerca(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.API_URL}${this.controllerEdi}${this.endpointEdiClienteParadasGeocerca}/${id}`, data);
    }

    deleteEdiClienteParadasGeocerca(id: number): Observable<any> {
        return this.http.delete<any>(`${this.API_URL}${this.controllerEdi}${this.endpointEdiClienteParadasGeocerca}/${id}`);
    }
}
