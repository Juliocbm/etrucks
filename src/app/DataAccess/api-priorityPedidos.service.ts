import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CartaPorte } from '../models/ti/cfdi/cartaPorte';
import { PriorityPedido } from '../models/Serv. Cliente/PriorityPedidos/PriorityPedido';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class PriorityPedidosService {
   private url = environment.API_URL_OPERACIONES //'https://hg.tools.midireccion.com/PriorityPedidos/';
  //  private url = 'https://localhost:7025/';

  constructor(private http: HttpClient) {
  }

  /* postTimbrarAsync(remision: string): Observable<any> {
    const database = this.getDatabaseName();
    const apiUrl = `${this.url}TimbraRemision?database=${database}&remision=${remision}&sitemaTimbrado=${2}`;
    return this.http.post<any>(apiUrl, { database, remision });
  }
 */
  getPedidos(): Observable<PriorityPedido[]> {
    // console.log(`${this.url}api/PriorityPedidos/`)
    return this.http.get<PriorityPedido[]>(`${this.url}api/PriorityPedidos/`);
  }

  getOperadores(): Observable<any[]> {
    // console.log(`${this.url}api/PriorityPedidos/`)
    return this.http.get<any[]>(`${this.url}api/PriorityPedidos/Operadores`);
  }

  updatePedidos(pedidos: PriorityPedido[]): Observable<any> {
    // console.log(`${this.url}api/PriorityPedidos/`)
    return this.http.put(`${this.url}api/PriorityPedidos/`, pedidos);
  }
}
