import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// llamar el modelo
  import { Liquidacion,DetalleLiquidacion } from '../models/Despacho/Liquidacion';
  import { InformacionOperador } from '../Interfaces/InformacionOperador';

@Injectable({
  providedIn: 'root'
})
export class ApiLiquidacionService {

  // Definir la URL de tu API.
  private API_URL = 'https://localhost:7216/api/';

  constructor(private http: HttpClient) { }

  // Un ejemplo de un método para obtener datos de la API.
  obtenerDatos(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Liquidaciones/Listado`);
  }
  //Obtener datos del endpoint de Operadores
  obtenerDatosOperadores(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}Liquidaciones/CargaOperadores`);
  }
  
  obtenerViajesAdeudos(operador: number, compania: number | null ): Observable<InformacionOperador> {
    const url = `${this.API_URL}Liquidaciones/DatosOperador/${compania}/${operador}`;
    return this.http.get<InformacionOperador>(url);
  }

  enviarDatos(liq: Liquidacion): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(this.API_URL + 'Liquidaciones', liq);
  }

  actualizarDatos(liq: Liquidacion): Observable<Liquidacion> {
    return this.http.put<Liquidacion>(this.API_URL + 'Liquidaciones/'+ liq.no_liquidacion, liq);
  }

  borrarDatos(id: string): Observable<Liquidacion> {
    console.log(id);
    return this.http.delete<any>(this.API_URL + 'Liquidaciones/' + id);
  }
}
