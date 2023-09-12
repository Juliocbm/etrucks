import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Marca } from '../models/Mantenimiento/marca';

@Injectable({
  providedIn: 'root'
})
export class ApiMarcaService {

  // Definir la URL de tu API.
  private API_URL = 'https://localhost:7077/api/';

  constructor(private http: HttpClient) { }

  // Un ejemplo de un método para obtener datos de la API.
  obtenerDatos(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}marca`);
  }

  enviarDatos(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.API_URL + 'marca', marca);
  }

  actualizarDatos(marca: Marca): Observable<Marca> {
    return this.http.put<Marca>(this.API_URL + 'marca/'+ marca.idMarca, marca);
  }

  borrarMarca(id: string): Observable<Marca> {
    console.log(id);
    return this.http.delete<any>(this.API_URL + 'marca/' + id);
  }
}
