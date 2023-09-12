import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from '../models/ServicioAlCliente/cliente';

@Injectable({
  providedIn: 'root'
})
export class ApiServicioClienteService {

  // Definir la URL de tu API.
  private API_URL = 'https://localhost:7132/api/';

  constructor(private http: HttpClient) { }

  // Un ejemplo de un método para obtener datos de la API.
  obtenerDatos(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}cliente`);
  }

  enviarDatos(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.API_URL + 'Cliente', cliente);
  }

  actualizarDatos(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(this.API_URL + 'Cliente/'+ cliente.idCliente, cliente);
  }

  borrarCliente(id: string): Observable<Cliente> {
    console.log(id);
    return this.http.delete<any>(this.API_URL + 'Cliente/' + id);
  }
}
