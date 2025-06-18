import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Visita } from '../models/Operaciones/Visita';
import { Observable } from 'rxjs';
import { Sucursal } from '../models/RH/sucursal';
import { Proveedor } from '../models/Operaciones/Proveedores';
import { ParametrosGenerales } from '../models/SistemaGeneral/ParametrosGenerales';
import { RelClienteMarcaTracktor } from '../models/Operaciones/RelClienteMarcaTracktorDTO';
import { RelClienteOperadorVetado } from '../models/Operaciones/RelClienteOperadorVet';
import { HttpService } from '../Services/http.service';
import { VwOperadorUsuario } from '../models/Operaciones/VwOperadorUsuario';
import { OperadorUsuario } from '../models/Operaciones/OperadorUsuario';

@Injectable({
  providedIn: 'root'
})
export class ApiOperacionesService {
  private apiUrl = environment.API_URL_ASIG_AUTO;
  // private apiUrl = 'https://localhost:7025/';

  // OperadorWebApp
  private controllerSeguridadOperadorWebApp: string = 'api/seguridadOperadorWebApp/'

  idCompania: number = 0;
  idUsuario: string = '';
  usuario: string = '';

  constructor(private http: HttpClient, private httpService: HttpService) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.usuario = localStorage.getItem('usuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  getPrioridadPedidos() {
    // console.log(`${this.apiUrl}/PriorityPedidos/`)
    return this.http.get(`${this.apiUrl}api/PriorityPedidos/`);
  }

  getOperadores(idCompania: number) {
    // console.log(`${this.apiUrl}/Operadores/${idCompania}`)
    return this.http.get(`${this.apiUrl}v1/Operaciones/${idCompania}`);
    // return this.http.get(`${this.apiUrl}Operadores/`);
  }

  // Catalogo de Ubicaciones
  getUbicaciones() {
    return this.http.get(`${this.apiUrl}v1/Operaciones/CatalogoUbicacion`);
  }

  // Catalogo de Sucursales
  getSucursales(idCompania: number): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.apiUrl}api/Visita/GetSucursales/${idCompania}`);
  }

  getSucursalTools(idCompania: number): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(`${this.apiUrl}api/Sucursal/${idCompania}`);
  }



  //////////////////////////////////////////////////////////////

  /* CATALOGO DE PAGINA DE VISITAS */

  //////////////////////////////////////////////////////////////

  // Catalogo de Visita
  // getVisitas(idCompania: number) : Observable<ParametrosGenerales[]> {

  //   console.log('Obteniendo visitas:', `${this.apiUrl}api/Visita?idCompania=${idCompania}&OrdenarPor=Id&Descending=true`);
  //   return this.http.get<ParametrosGenerales[]>(`${this.apiUrl}api/Visita?idCompania=${idCompania}&OrdenarPor=Id&Descending=true`);
  // }

  getVisitas(parametrosGenerales: HttpParams): Observable<any> {
    

    return this.httpService.get(`${this.apiUrl}api/Visita`, { parametrosGenerales });
  }

  postVisita(visita: Visita): Observable<Visita> {
    // console.log('Enviando visita:', visita);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(visita);
    console.log('Enviando visita:', body);
    console.log('Conexion a:', `${this.apiUrl}api/Visita/CreateVisita`, body, { headers });
    return this.http.post<Visita>(`${this.apiUrl}api/Visita/CreateVisita`, body, { headers });
  }

  // Put Actualizar Visita
  putVisita(visita: Visita): Observable<Visita> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(visita);
    console.log('Actualizando visita:', body);
    return this.http.put<Visita>(`${this.apiUrl}api/Visita/UpdatedVisita`, body, { headers });
  }

  // Obtener catalogo de Proveedores
  getProveedores(idCompania: number) {
    return this.http.get<Proveedor[]>(`${this.apiUrl}api/Visita/GetProveedores/${idCompania}`);
  }

  getProveedoresV2(parametrosGenerales: HttpParams): Observable<any> {
    

    return this.httpService.get(`${this.apiUrl}api/Visita/ProveedorV2`, { parametrosGenerales });
  }

  getTipoDocumento(parametrosGenerales: HttpParams): Observable<any> {
    

    return this.httpService.get(`${this.apiUrl}api/Visita/TipoDocumento`, { parametrosGenerales });
  }

  getEstatusSolicitud(parametrosGenerales: HttpParams): Observable<any> {
    

    return this.httpService.get(`${this.apiUrl}api/Visita/EstatusSolicitud`, { parametrosGenerales });
  }


  // Registrar OTP
  postRegistrarOTP(empresa: number, sucursal: number, correo: string) {
    // console.log('Enviando OTP:', empresa, sucursal, correo);
    return this.http.post(`${this.apiUrl}api/Visita/OTP?idCompania=${empresa}&idSucursal=${sucursal}&correo=${correo}`, {});
  }

  // Validar OTP
  postValidarOTP(empresa: number, sucursal: number, correo: string, otp: string) {
    // console.log('Validando OTP:', empresa, sucursal, correo, otp);
    return this.http.post(`${this.apiUrl}api/Visita/ValidarOTP?idCompania=${empresa}&idSucursal=${sucursal}&correo=${correo}&otp=${otp}`, {});
  }

  /////////////////////////////////////////////////////////////////
  ////////////////////////// CTE MARCAS ///////////////////////////
  ////////////////////////////////////////////////////////////////


  // Cliente Marca Tractor
  getClienteMarcaTractor(idCompania: number): Observable<ParametrosGenerales[]> {
    return this.http.get<ParametrosGenerales[]>(`${this.apiUrl}api/PriorityPedidos/ObtenerMarcasPorClienteAsync?idCompania=${idCompania}&OrdenarPor=Id&Descending=true`);
  }

  // Post Cliente Marca Tractor
  postClienteMarcaTractor(relaciones: RelClienteMarcaTracktor[]): Observable<RelClienteMarcaTracktor[]> {
    console.log('Enviando relaciones:', relaciones);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(relaciones);
    return this.http.post<RelClienteMarcaTracktor[]>(`${this.apiUrl}api/PriorityPedidos/PostRelacionClienteMarcaTracktor`, body, { headers });
  }

  // Put Cliente Marca Tractor
  putClienteMarcaTractor(clienteMarcaTractor: RelClienteMarcaTracktor): Observable<RelClienteMarcaTracktor> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(clienteMarcaTractor);
    console.log('Actualizando clienteMarcaTractor:', body);
    return this.http.put<RelClienteMarcaTracktor>(`${this.apiUrl}api/PriorityPedidos/PutRelacionClienteMarcaTracktor`, body, { headers });
  }

  // CLientes
  getClientes(parametros: HttpParams): Observable<any> {

    return this.httpService.get(`${this.apiUrl}api/PriorityPedidos/GetCatalogoClientes`, parametros );
  }

  // Marcas
  getMarcas(idCompania: number): Observable<any> {
    return this.http.get<ParametrosGenerales[]>(`${this.apiUrl}api/PriorityPedidos/GetCatalogoMarcaUnidades?Descending=true&NoPagina=1&TamanoPagina=100&Activos=false&idCompania=${idCompania}&OrdenarPor=nombre`);
  }

  //////////////////////////////////////////////
  ///////////// CTE OPERADOR VETADO ////////////
  //////////////////////////////////////////////

  // Catalogo de Operadores /api/PriorityPedidos/GetCatalogoOperador
  getCatalogoOperador(idCompania: number): Observable<ParametrosGenerales[]> {
    return this.http.get<ParametrosGenerales[]>(`${this.apiUrl}api/PriorityPedidos/GetCatalogoOperador?idCompania=${idCompania}&OrdenarPor=Id&Descending=true`);
  }

  // Cte Operador Vetado
  getCteOperadorVetado(idCompania: number): Observable<ParametrosGenerales[]> {
    return this.http.get<ParametrosGenerales[]>(`${this.apiUrl}api/PriorityPedidos/ObtenerOperadoresVetadosPorClienteAsync?idCompania=${idCompania}&OrdenarPor=Id&Descending=true`);
  }

  // Post Cte Operador Vetado
  postCteOperadorVetado(relaciones: any[]): Observable<any[]> {
    console.log('Enviando relaciones:', relaciones);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(relaciones);
    return this.http.post<any[]>(`${this.apiUrl}api/PriorityPedidos/PostRelClienteOperadorVet`, body, { headers });
  }

  // Put Cte Operador Vetado
  putCteOperadorVetado(relaciones: any[]): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(relaciones);
    return this.http.put<any[]>(`${this.apiUrl}api/PriorityPedidos/PutRelClienteOperadorVet`, body, { headers });
  }

  // Delete Cte Operador Vetado
  deleteCteOperadorVetado(relaciones: any[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(relaciones);
    console.log('Eliminando relaciones:', body);

    console.log('Conexion a:', `${this.apiUrl}api/PriorityPedidos/DeleteRelClienteOperadorVet`, body, { headers });
    return this.http.put<any>(`${this.apiUrl}api/PriorityPedidos/DeleteRelClienteOperadorVet`, body, { headers });
  }
  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////// RPT DEMORAS DE REMOLQUES ///////////////////////////
  ///////////////////////////////////////////////////////////////////////////////

  obtenerDemorasRemolques(fechaInical: string, fechaFin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api/DemorasRemolques?fechaInicial=${fechaInical}&fechaFin=${fechaFin}`);
  }

  /////////////////////////////////////////////////////////////////////////////
  ////////////////////////// SEGURIDAD OPERADOR WEB APP ////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  obtenerOperadorUsuario(parametros: HttpParams): Observable<any> {

    return this.httpService.get(this.apiUrl + this.controllerSeguridadOperadorWebApp, parametros);
  }

  postOperadorUsuario(operadorUsuario: OperadorUsuario): Observable<any> {
    operadorUsuario.creadoPor = this.idUsuario;
    operadorUsuario.modificadoPor = this.idUsuario;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'idCompania': this.idCompania });
    const body = JSON.stringify(operadorUsuario);
    return this.http.post<any>(this.apiUrl + this.controllerSeguridadOperadorWebApp + this.idCompania, body, { headers });
  }

  putOperadorUsuario(operadorUsuario: OperadorUsuario): Observable<any> {
    operadorUsuario.modificadoPor = this.idUsuario;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(operadorUsuario);
    return this.http.put<any>(this.apiUrl + this.controllerSeguridadOperadorWebApp + this.idCompania, body, { headers });
  }

}
