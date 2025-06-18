import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ParametrosGenerales } from '../models/SistemaGeneral/ParametrosGenerales';
import { ClienteAlternoEdi, ClientePrincipalEDI, ClienteAlternoEDI } from '../models/Edi/ClienteAlternoEdi.interface';
import { HttpService } from '../Services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServicioClienteService {
  
  private idCompania: number = 0;
  private idUsuario: string = "";

  constructor(
    private _httpClient: HttpClient, 
    private httpService: HttpService
  ) { 
    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
  }

  readonly _ApiServicioCliente = environment.API_URL_SERVCTE;

  getClientesV2(parametros: HttpParams, extraParams: ParametrosGenerales) {

   
    return this.httpService.get(`${this._ApiServicioCliente}Cliente/clientesv2`, { parametros });
  }


  postClienteAlternoEdi(data: ClienteAlternoEDI, validar: boolean): any {
    data.idCompania = this.idCompania;
    data.creadoPor = this.idUsuario;
    data.fechaCreacion = new Date().toISOString();
    data.modificadoPor = this.idUsuario;
    data.fechaModificacion = new Date().toISOString();

    return  this._httpClient.post(`${this._ApiServicioCliente}ClientesAlternosEdi?validate=${validar}`, data);
  }

  postClientePrincipalEdi(data: ClientePrincipalEDI, validar: boolean): any {
    data.idCompania = this.idCompania;
    data.creadoPor = this.idUsuario;
    data.fechaCreacion = new Date().toISOString();
    data.modificadoPor = this.idUsuario;
    data.fechaModificacion = new Date().toISOString();

    return  this._httpClient.post<ClientePrincipalEDI>(`${this._ApiServicioCliente}ClientesAlternosEdi/principal?validate=${validar}`, data);
  }

  getClientesPrincipalesEdi() {
    return this._httpClient.get<ClienteAlternoEDI[]>(`${this._ApiServicioCliente}ClientesAlternosEdi/principales/${this.idCompania}`);
  }

  getClientesAlternosEdi(idPrincipal: number) {
    return this._httpClient.get<ClienteAlternoEDI[]>(`${this._ApiServicioCliente}ClientesAlternosEdi/alternos/${idPrincipal}`);
  }

  deleteClientesAlternoEdi(idClienteAlternoEdi: number) {
    return this._httpClient.delete<boolean>(`${this._ApiServicioCliente}ClientesAlternosEdi/alterno?idClienteAlterno=${idClienteAlternoEdi}&idUsuario=${this.idUsuario}`);
  }

  deleteClientesPrincipalesEdi(idClientePrincipalEdi: number) {
    return this._httpClient.delete<boolean>(`${this._ApiServicioCliente}ClientesAlternosEdi/principal?idClientePrincipal=${idClientePrincipalEdi}&idUsuario=${this.idUsuario}`);
  }

  putClientesAlternosEdi(data: ClienteAlternoEdi) {
    data.modificadoPor = this.idUsuario;
    data.fechaModificacion = new Date().toISOString();
    return this._httpClient.put(`${this._ApiServicioCliente}ClientesAlternosEdi`, data);
  }
}
