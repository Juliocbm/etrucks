import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { CartaPorte } from '../models/ti/cfdi/cartaPorte';
import { environment } from '../environments/environment.prod';
import { HttpService } from '../Services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ApiInterfacesLisService {
  // private url = 'https://lisinter.apphgtransportaciones.com/api/Lis/';
 
 /*  private API_URL = 'https://localhost:7007/api/';  */
 private API_URL = environment.API_URL_LIS + 'api/'; 

  //GUIAS
  private controllerGuias: string = 'Lis/';
  private idCompania: number = 0;

  /*  constructor(private http: HttpClient) {
     ({ idCompania: this.idCompania } = localStorage);
   }
  */
  constructor(private http: HttpClient, private httpService: HttpService) {
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  private getDatabaseName(): string {
    switch (this.idCompania) {
      case 1: return 'hgdb_lis';
      case 2: return 'chdb_lis';
      case 3: return 'rldb_lis';
      default: return 'lindadb';
    }
  }

  //reporte de seguimiento de guias
  getCartasPorteErrorTrasladoLis(parametros: HttpParams): Observable<any> {
    return this.httpService
      .get<any>(
        this.API_URL +
        this.controllerGuias +
        `FacturasErrorTraslado/${this.idCompania}`,
        parametros
      )
      .pipe(
        // Modificación de los datos usando map()
        map((data) => {
          console.log('seguimiento guia', data);
          return data;
        }),
        // Manejar errores y retornar [] si falla la petición
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

  getCartasPorteErrorTrasladoLisOrig(): Observable<CartaPorte[]> {
    const database = this.getDatabaseName();
    const apiUrl = `${this.API_URL + this.controllerGuias }FacturasErrorTraslado?database=${database}`;
    return this.http.get<any>(apiUrl).pipe(
      map(data => {
        console.log('data', data);

        // Transformar los datos base64 en blobs
        if (data.archivoCFDi) {
          data.archivoCFDi.xml = this.base64ToBlob(data.archivoCFDi.xml, 'application/xml');
          data.archivoCFDi.pdf = this.base64ToBlob(data.archivoCFDi.pdf, 'application/pdf');
        }
        return data;
      })
    );
  }

  postTrasladoFacturaAsync(remision: string): Observable<any> {
    const database = this.getDatabaseName();
    const apiUrl = `${this.API_URL + this.controllerGuias}EnviaFactura?database=${database}&NumGuia=${remision}&cartaPorteVersion=31`;
    return this.http.post<any>(apiUrl, { database, remision });
  }

  public base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64);
    const length = binary.length;
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type });
  }

  PutDatosLis(cartaPorte: CartaPorte): Observable<CartaPorte> {
    const database = this.getDatabaseName();
    const url = `${this.API_URL + this.controllerGuias}PutDatosLis?database=${database}`;
    return this.http.put<any>(url, cartaPorte);
  }
}
