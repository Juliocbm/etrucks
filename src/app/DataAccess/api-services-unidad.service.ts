import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unidad } from '../models/Mantenimiento/unidad';

@Injectable({
  providedIn: 'root'
})
export class ApiUnidadService {

  private API_URL = 'https://localhost:7077/api/';

  constructor(private http: HttpClient) { }

  obtenerDatos(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}unidad`);
  }

  obtenerDato(id: Unidad): Observable<any> {
    console.log(id.idCompania,id.idUnidad)
    return this.http.get<any>(this.API_URL + 'unidad/'+ id.idUnidad + '/' + id.idCompania + '/');
  }

  enviarDatos(unidad: Unidad): Observable<Unidad> {
    return this.http.post<Unidad>(this.API_URL + 'unidad', unidad);
  }

  actualizarDatos(cliente: Unidad): Observable<Unidad> {
    console.log(cliente);
    return this.http.put<Unidad>(this.API_URL + 'unidad/'+ cliente.idUnidad+ '/' + cliente.idCompania+ '/', cliente);
  }

  borrarDatos(id: number,id2: number): Observable<Unidad> {
    console.log(id,id2);
    return this.http.delete<any>(this.API_URL + 'unidad/' + id + '/' + id2);
  }
}
