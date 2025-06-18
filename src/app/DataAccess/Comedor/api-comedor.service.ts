import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { MenuComedorModel } from 'src/app/models/RH/Comedor/Menu';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { consumoModel } from 'src/app/models/RH/Comedor/consumo';
import { HttpService } from 'src/app/Services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ApiComedorService {
  //private API_URL = environment.API_URL_HGTOOLS;
  private API_URL = environment.API_URL_HGTOOLS;
  private API_URL_COMEDOR = environment.API_URL_COMEDOR; //
  idCompania: number = 0;
  idUsuario: string = '';

  controllerMenu: string = 'MenuComedor/';
  // controllerComedor: string = "Comedor/";
  controllerSucursal: string = 'GetSucursales/';
  constructor(private http: HttpClient, private httpService: HttpService) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Menu Comidas Comedor //////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerMenu(): Observable<any> {
    return this.http.get<any>(
      this.API_URL +
        this.controllerMenu +
        'GetMenuByCompania/' +
        this.idCompania
    );
  }

  obtenerSucursales(idCompania: number): Observable<any> {
    return this.http.get<any>(this.API_URL_COMEDOR + this.controllerSucursal);
  }
  postMenu(menu: MenuComedorModel): Observable<any> {
    menu.creadoPor = this.idUsuario;
    menu.modificadoPor = this.idUsuario;
    console.log('service', menu);
    return this.http.post<any>(this.API_URL + this.controllerMenu, menu);
  }

  putMenu(menu: MenuComedorModel): Observable<any> {
    menu.modificadoPor = this.idUsuario;
    return this.http.put<any>(
      this.API_URL + this.controllerMenu + menu.idComida,
      menu
    );
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// reporte consumos //////////////////////////
  //////////////////////////////////////////////////////////////////////////
  obtenerConsumos(
    idSucursal: number,
    idCompania: number,
    idEstatusConsumo: number,
    fechaInicio: String,
    fechaFin: String,
    tipoEmpleado: string,
    tipoConsulta: number
  ): Observable<any> {
    return this.http.get<any>(
      this.API_URL_COMEDOR +
        'getReporteConsumos/' +
        '?id_sucursal=' +
        idSucursal +
        '&idCompania=' +
        idCompania +
        '&idEstatusConsumo=' +
        idEstatusConsumo +
        '&fechaInicio=' +
        fechaInicio +
        '&fechaFin=' +
        fechaFin +
        '&tipoEmpleado=' +
        tipoEmpleado +
        '&tipoConsulta=' +
        tipoConsulta
    );
  }

  obtenerEstatus(): Observable<any> {
    return this.http.get<any>(this.API_URL_COMEDOR + 'GetEstatusConsumo/');
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Lista de consumos /////////////////////////
  //////////////////////////////////////////////////////////////////////////

  // Obtener VwConsumos con parametrosGenerales
  GetComedorConsumo(parametros: HttpParams): Observable<any> {
    return this.httpService.get<any>(
      this.API_URL + 'ComedorConsumo',
      parametros
    );
  }

  // Post ComedorConsumo (consumo)
  postComedorConsumo(consumo: consumoModel): Observable<any> {
    return this.http.post<any>(this.API_URL + 'ComedorConsumo', consumo);
  }

  // Delete Logico ComedorConsumo (consumo) por id
  deleteComedorConsumo(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + 'ComedorConsumo/' + id);
  }

  // Get EstatusConsumo (ParametrosGenerales)
  getEstatusConsumoV2(parametros: HttpParams): Observable<any> {
    return this.httpService.get(this.API_URL + 'EstatusConsumo');
  }
}
