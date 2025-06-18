import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ParametrosGenerales } from '../models/SistemaGeneral/ParametrosGenerales';
import { ClienteAlternoEdi, ClientePrincipalEDI, ClienteAlternoEDI } from '../models/Edi/ClienteAlternoEdi.interface';
import { HttpService } from '../Services/http.service';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServicioClienteTrucksService {

  private idCompania: number = 0;
  private idUsuario: string = "";

  constructor(
    private _httpClient: HttpClient,
    private httpService: HttpService
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  readonly API_URL = environment.API_URL_HGTOOLS;
  controllerCliente: string = "ClienteTrucks/";

  //Consulta la lista de accidentes mediante el endpoint de paginacion
  getClientesAsync(parametros: HttpParams): Observable<any> {
    const params = parametros;

    console.log('params clientes', params);

    return this.httpService
      .get(this.API_URL + this.controllerCliente + this.idCompania, params)
      .pipe(
        // Modificación de los datos usando map()
        map((data) => {
          console.log('clientes', data);
          return data;
        }),
        // Manejar errores y retornar [] si falla la petición
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }
}
