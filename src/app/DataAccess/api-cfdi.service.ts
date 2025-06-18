import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { CartaPorte } from '../models/ti/cfdi/cartaPorte';
import { environment } from '../environments/environment';
import { TipoCambio } from '../cobranza/Models/TipoCambio/TipoCambio';
import { HttpService } from '../Services/http.service';
import { AlertService } from '../Services/alert.service';
@Injectable({
  providedIn: 'root',
})
export class ApiCfdiService {
  /* private url = 'https://cfdi.apphgtransportaciones.com/api/'; */
  private url = 'https://localhost:7029/api/';


  private readonly controllerTipoCambio = 'tipoCambio/';
  private readonly controllerCfdi = 'cfdi/';
  private readonly controllerCfdiLiquidacion = 'cfdiLiquidacion/';

  idCompania: number = 0;
  idUsuario: string = "";
  usuario: string = "";

  constructor(private http: HttpClient,
    private httpService: HttpService,
    private alertService: AlertService,
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.usuario = localStorage.getItem('usuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
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

  private getDatabaseName(): string {
    switch (this.idCompania) {
      case 1: return 'hgdb_lis';
      case 2: return 'chdb_lis';
      case 3: return 'rldb_lis';
      default: return 'lindadb';
    }
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// CFDI Fletes /////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  //#region cfdis
  postTimbrarAsync(remision: string): Observable<any> {
    const database = this.getDatabaseName();
    const apiUrl = `${this.url + this.controllerCfdi}TimbraRemision?database=${database}&remision=${remision}&sitemaTimbrado=${2}`;
    return this.http.post<any>(apiUrl, { database, remision });
  }

  getCartaPorte(num_guia: string): Observable<CartaPorte> {
    const database = this.getDatabaseName();
    const apiUrl = `${this.url + this.controllerCfdi}GetCartaPorte/?database=${database}&num_guia=${num_guia}`;
    return this.http.get<any>(apiUrl).pipe(
      map(data => {
        // Transformar los datos base64 en blobs
        if (data.archivoCFDi) {
          data.archivoCFDi.xml = this.base64ToBlob(data.archivoCFDi.xml, 'application/xml');
          data.archivoCFDi.pdf = this.base64ToBlob(data.archivoCFDi.pdf, 'application/pdf');
        }
        return data;
      })
    );
  }

  putCartaPorte(cartaPorte: CartaPorte): Observable<CartaPorte> {
    cartaPorte.modificadoPor = this.idUsuario;

    const database = this.getDatabaseName();
    const url = `${this.url + this.controllerCfdi}PutCartaPorte?database=${database}`;
    return this.http.put<any>(url, cartaPorte);
  }
  //#endregion


  //////////////////////////////////////////////////////////////////////////
  ///////////////////////// CFDI Liquidaciones /////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  //#region cfdis
  getLiquidaciones(parametros: HttpParams): Observable<any> {
    const database = this.getDatabaseName();
    const url = this.url + this.controllerCfdiLiquidacion + 'GetLiquidaciones/' + database;

    return this.httpService
      .get(url, parametros) // 👈 Pasas los HttpParams como segundo argumento (así como en `getClientesAsync`)
      .pipe(
        map((data: any) => {
          // Si la respuesta incluye propiedad `items`, transformamos esa lista
          if (data && Array.isArray(data.items)) {
            data.items = data.items.map((item: any) => ({
              ...item,
              fecha: new Date(item.fecha),
              xml: item.xml ? this.base64ToBlob(item.xml, 'application/xml') : null,
              pdf: item.pdf ? this.base64ToBlob(item.pdf, 'application/pdf') : null
            }));
          }
          return data;
        }),
        catchError((error) => {
          console.error('[getLiquidaciones] Error', error);
          return of([]); // O puedes retornar: of({ items: [] }) si esperas paginación
        })
      );
  }

  timbrarLiquidacion(noLiquidacion: number): Observable<any> {

    console.log('noLiquidacion', noLiquidacion);

    const url = `${this.url}${this.controllerCfdiLiquidacion}TimbrarLiquidacion`;
    const params = new HttpParams()
      .set('idCompania', this.idCompania.toString())
      .set('noLiquidacion', noLiquidacion.toString());

    return this.httpService
      .post(url, null, { params }) // 👈 null en body porque el backend no espera uno
      .pipe(
        map((response) => {
          console.log('Timbrado response', response);
          return response;
        }),
        catchError((error) => {
          console.error('[timbrarLiquidacion] Error', error);
          return of(null); // o puedes manejarlo con throwError si quieres notificación en el componente
        })
      );
  }

  //#endregion

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// TIPOS DE CAMBIO ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  //#region tipo de cambio
  obtenerTiposCambio(parametros: HttpParams): Observable<any> {
    const params = parametros;

    console.log('parametros', params);

    /* return this.httpService.get(this.url + this.controllerTipoCambio, { params });
     */
    return this.httpService
      .get(this.url + this.controllerTipoCambio, params)
      .pipe(
        // Modificación de los datos usando map()
        map((data) => {
          console.log('TiposCambio', data);
          return data;
        }),
        // Manejar errores y retornar [] si falla la petición
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

  obtenerTipoCambioPorId(idTipoCambio: number): Observable<any> {
    return this.httpService.get(this.url + this.controllerTipoCambio + 'getById/' + idTipoCambio).pipe(
      map((data) => data),
      catchError((error) => {
        console.error('Error obteniendo tipo de cambio por ID:', error);
        return of(null);
      })
    );
  }

  crearTipoCambio(tipoCambio: TipoCambio): Observable<any> {
    tipoCambio.creadoPor = this.idUsuario;
    tipoCambio.modificadoPor = this.idUsuario;

    return this.httpService.post(this.url + this.controllerTipoCambio + 'create', tipoCambio).pipe(
      map((data) => {
        this.alertService.success("Tipo de cambio creado exitosamente");
        return data;
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }

  actualizarTipoCambio(tipoCambio: TipoCambio): Observable<any> {
    return this.httpService.put(this.url + this.controllerTipoCambio, tipoCambio).pipe(
      map((data) => {
        this.alertService.success("Tipo de cambio actualizado exitosamente");
        return data;
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }

  eliminarTipoCambio(tipoCambio: TipoCambio): Observable<any> {
    console.log('tipoCambio', tipoCambio);
    return this.httpService.put(this.url + this.controllerTipoCambio + "eliminar", tipoCambio).pipe(
      map((data) => {
        this.alertService.success("Tipo de cambio eliminado exitosamente");
        return data;
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }
  //#endregion
}
