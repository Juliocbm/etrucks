import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ClienteEdi, EdiKpiData, ApiResponse } from 'src/app/models/Edi/ediKpiModel';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';

@Injectable({
  providedIn: 'root'
})
export class ApiEdiToolsService {
  // URL
  private API_URL = environment.API_URL_HGTOOLS;

  // Variables Globales
  private idCompania: number = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  private idUsuario: string = localStorage.getItem('idUsuario') ?? '';

  // Endpoints
  private endpointClientes = 'api/KpiEdi/clientes';
  private endpointKpiData = 'api/KpiEdi/kpi';
  private endpointKpiDataByIdCliente = 'api/KpiEdi/detalle';

  constructor(private http: HttpClient) {
    // Actualizar las variables globales cuando se inicializa el servicio
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
  }

  /**
   * Obtiene la lista de clientes EDI según la compañía
   * @param idCompania ID de la compañía
   * @returns Observable con la respuesta de clientes
   */
  getClientes(idCompania: number): Observable<ApiResponse<ClienteEdi>> {
    const params = new HttpParams().set('idCompania', idCompania);
    return this.http.get<ApiResponse<ClienteEdi>>(`${this.API_URL}${this.endpointClientes}`, { params });
  }

  /**
   * Obtiene los datos del KPI EDI según los parámetros especificados
   * @param parametros Parámetros generales (idCompania, rangoFechas)
   * @param idCliente ID del cliente (opcional)
   * @returns Observable con la respuesta de datos KPI
   */
  getKpiData(parametros: ParametrosGenerales, idCliente: number | null): Observable<ApiResponse<EdiKpiData>> {
    // Inicializamos los parámetros con la compañía
    let params = new HttpParams()
      .set('idCompania', parametros.idCompania.toString());
    
    // Agregamos el rango de fechas como parámetro adicional
    if (parametros.rangoFechas) {
      // El formato debe ser rangoFechas=[fecha-fecha]
      params = params.set('rangoFechas', parametros.rangoFechas);
    }
    
    // Solo agregar idCliente si no es null
    if (idCliente !== null) {
      params = params.set('idCliente', idCliente.toString());
    }
    
    console.log('URL API:', `${this.API_URL}${this.endpointKpiData}`);
    console.log('Params:', params.toString());
    
    return this.http.get<ApiResponse<EdiKpiData>>(`${this.API_URL}${this.endpointKpiData}`, { params });
  }


  /* Obtener el detalle del KPI EDI de un cliente en especifico */
  // Ejemplo conexion https://localhost:7025/api/KpiEdi/detalle?idCompania=1&additionalProp1=string&additionalProp2=string&additionalProp3=string&anio=2025&semana=23&idCliente=2494
  getKpiDataByIdCliente(parametros: ParametrosGenerales, idCliente: number, anio: number, semana: number): Observable<ApiResponse<EdiKpiData>> {
    const params = new HttpParams()
      .set('idCompania', parametros.idCompania.toString())
      .set('anio', anio.toString())
      .set('semana', semana.toString())
      .set('idCliente', idCliente.toString());
    
    return this.http.get<ApiResponse<EdiKpiData>>(`${this.API_URL}${this.endpointKpiDataByIdCliente}`, { params });
  }

}
