import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TraficoGuia } from '../Models/TraficoGuia';
import { Cliente } from '../Models/Cliente';
import { environment } from 'src/app/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiFacturasService {
  private API_URL = environment.API_URL_COBRANZA + 'api/';
  private API_URL_TEST = environment.API_URL_COBRANZA + 'v1/PedidosCobranza';

  private compania = localStorage.getItem("CompaniaSelect") || null;

  constructor(private http: HttpClient) {
  }

  obtenerFacturas(idCliente: number, fechaInicio?: Date, fechaFin?: Date): Observable<any> {
    // Preparar los parámetros HTTP
    let params = new HttpParams();
    if (fechaInicio) {
      params = params.append('fechaInicio', fechaInicio.toISOString());
    }
    if (fechaFin) {
      params = params.append('fechaFin', fechaFin.toISOString());
    }

    return this.http.get<TraficoGuia>(`${this.API_URL}DescargaFacturas/` + this.compania + '/' + idCliente, { params });
  }

  obtenerFacturasByNumGuias(numGuias: string[]): Observable<any> {
    return this.http.post<TraficoGuia>(`${this.API_URL}DescargaFacturas/pod/` + this.compania , numGuias);
  }

  obtenerClientes(): Observable<any> {
    return this.http.get<Cliente>(`${this.API_URL}DescargaFacturas/clientes/` + this.compania);
  }

  // ediConfId: number
  obtenerPedidosCobranza( ediConfId?: number, fechaInicio?: Date, fechaFin?: Date): Observable<any> {
    let params = new HttpParams();
    if (ediConfId !== undefined) {
      params = params.append('ediConfId', ediConfId.toString());
    }
    if (fechaInicio !== undefined) {
      params = params.append('fechaInicial', fechaInicio.toISOString());
    }
    if (fechaFin !== undefined) {
      params = params.append('fechaFinal', fechaFin.toISOString());
    }
    return this.http.get(`${this.API_URL_TEST}/pedidosCobranza`, { params });
  }


}
