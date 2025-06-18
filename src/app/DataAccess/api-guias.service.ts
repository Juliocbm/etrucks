import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpService } from '../Services/http.service';
import { AlertService } from '../Services/alert.service';
@Injectable({
  providedIn: 'root',
})
export class ApiGuiasService {
  private readonly _guiasController: string = 'Guias';
  private readonly _apiUrl: string = environment.API_URL_HGTOOLS;

  idCompania: number = 0;
  idUsuario: string = "";
  usuario: string = "";

  constructor(   
    private _httpService: HttpService,
    private _alertService: AlertService,
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.usuario = localStorage.getItem('usuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  getGuiasByIdsString(guias: string = ''){
    return this._httpService.get<any[]>(`${this._apiUrl}${this._guiasController}/by-list?idCompania=${this.idCompania}&guias=${guias}`);
  }

  putGuiasByIdsString(guias: string[] = [], estatus: string, tipoDoc: string) {
    return this._httpService.put<any[]>(`${this._apiUrl}${this._guiasController}/by-list?idCompania=${this.idCompania}&status=${estatus}&tipo_doc=${tipoDoc}`, guias);
  }

  
}
