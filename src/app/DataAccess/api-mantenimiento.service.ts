import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patio, Geocerca, Unidad, Marca } from '../models/Mantenimiento/patio';
import { Remolque } from '../models/Mantenimiento/remolque';
import { ProveedorDiesel } from '../models/Mantenimiento/ProveedorDiesel';
import { Linea } from '../models/Mantenimiento/linea';
import { environment } from '../environments/environment.prod';
import { TipoMotor } from '../models/Mantenimiento/tipoMotor';
import { ParametrosGenerales } from '../models/SistemaGeneral/ParametrosGenerales';
import { HttpService } from '../Services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiMantenimientoService {
   private API_URL = environment.API_URL_MANTENIMIENTO;
  //private API_URL = "https://localhost:7077/api/";

  idCompania: number = 0;
  idUsuario: string = "";

  controllerRemolque: string = "remolques/";
  controllerMarca: string = "marca/";
  controllerGeocerca: string = "geocercas/";
  controllerPatio: string = "patios/";
  controllerProveedoresDiesel: string = "proveedorDiesel/";
  controllerLinea: string = "linea/";
  controllerUnidad: string = "unidades/";
  controllerTipoUnidad: string = "tipoUnidad/";
  controllerTipoMotor: string = 'tipoMotor/';
  controllerConfiguracionTipoUnidad: string = 'configuracionTipoUnidad/';

  constructor(private http: HttpClient, private httpService: HttpService) {

    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// Unidad //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerUnidades(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerUnidad);
  }

  obtenerUnidadesAsignacion(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerUnidad + 'details');
  }

  obtenerUnidad(id: Unidad): Observable<any> {
    console.log(id.idCompania, id.idUnidad)
    return this.http.get<any>(this.API_URL + this.controllerUnidad  + id.idUnidad + '/');
  }

  obtenerDatosTipoUnidad(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerTipoUnidad );
  }

  enviarUnidad(unidad: Unidad): Observable<Unidad> {
    unidad.creadoPor = this.idUsuario;
    unidad.modificadoPor = this.idUsuario;
    unidad.idCompania = this.idCompania;
    return this.http.post<Unidad>(this.API_URL + this.controllerUnidad , unidad);
  }

  actualizarUnidad(unidad: Unidad): Observable<Unidad> {
    unidad.modificadoPor = this.idUsuario;
    return this.http.put<Unidad>(this.API_URL + this.controllerUnidad , unidad);
  }

  obtenerEmpresas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerUnidad + 'compañias')
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// MARCA //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerMarcas(idTipoMarca?: string): Observable<any> {
    let params  = new HttpParams();
    if(idTipoMarca != undefined){
      params  = params .set('activos', 'true');
      params  = params .set('idTipoMarca', idTipoMarca);
    }
    return this.http.get<any>(this.API_URL + this.controllerMarca,  { params  });
  }

  obtenerMarca(id: number): Observable<Marca> {
    return this.http.get<Marca>(this.API_URL + this.controllerMarca + id);
  }

  enviarMarca(marca: Marca): Observable<any> {
    marca.creadoPor = this.idUsuario;
    marca.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerMarca, marca);
  }

  actualizarMarca( marca: Marca): Observable<any> {
    marca.modificadoPor = this.idUsuario;
    marca.creadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerMarca + marca.idMarca, marca);
  }

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////////// GEOCERCA /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerGeocercas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerGeocerca);
  }

  obtenerGeocerca(id: number): Observable<Geocerca> {
    return this.http.get<Geocerca>(this.API_URL + this.controllerGeocerca + id);
  }

  obtenerGeocercasPatios(parametros: HttpParams): Observable<any> {
   
    return this.httpService.get(this.API_URL + this.controllerGeocerca + 'patios/', { parametros });
  }
  obtenerGeocercasPatiosById(idGeocerca: string): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerGeocerca + 'PatiosById/?idGeocerca=' + idGeocerca);
  }

  obtenerGeocercaV2(parametros: HttpParams): Observable<any> {
        
        return this.httpService.get(this.API_URL + this.controllerGeocerca  + 'V2/' , { parametros });
      }

  enviarGeocerca(geocerca: Geocerca): Observable<any> {
    geocerca.creadoPor = this.idUsuario;
    geocerca.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerGeocerca, geocerca);
  }

  actualizarGeocerca(id: any, geocerca: Geocerca): Observable<any> {
    geocerca.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerGeocerca + id, geocerca);
  }

  getGeocercasAllV2(parametros: HttpParams): Observable<any> {
    
    return this.httpService.get(this.API_URL + this.controllerGeocerca  + 'GeofenceV2' , { parametros });
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// PATIO //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPatios(): Observable<Patio[]> {
    return this.http.get<any>(this.API_URL + this.controllerPatio);
  }

  obtenerPatio(id: number): Observable<Patio> {
    return this.http.get<Patio>(this.API_URL + this.controllerPatio + id);
  }

  enviarPatio(evidencia: Patio): Observable<any> {
    evidencia.idCompania = this.idCompania;
    evidencia.creadoPor = this.idUsuario;
    evidencia.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerPatio, evidencia);
  }

  actualizarPatio( evidencia: Patio): Observable<any> {
    evidencia.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerPatio + evidencia.idPatio, evidencia);
  }

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////////// REMOLQUE /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerRemolques(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRemolque);
  }

  obtenerRemolque(remolque: Remolque): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRemolque + remolque.idCompania + '/' + remolque.idRemolque + '/');
  }

  enviarRemolque(remolque: Remolque): Observable<Remolque> {
    remolque.idCompania = this.idCompania;
    remolque.creadoPor = this.idUsuario;
    remolque.modificadoPor = this.idUsuario;
    return this.http.post<Remolque>(this.API_URL + this.controllerRemolque, remolque);
  }

  actualizarRemolque(remolque: Remolque): Observable<Remolque> {
    remolque.modificadoPor = this.idUsuario;
    return this.http.put<Remolque>(this.API_URL + this.controllerRemolque + remolque.idRemolque + '/', remolque);
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////// PROVEEDORES DIESEL //////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerProveedores(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerProveedoresDiesel);
  }

  enviarProveedor(proveedor: ProveedorDiesel): Observable<any> {
    proveedor.creadoPor = this.idUsuario;
    proveedor.modificadoPor = this.idUsuario;
    proveedor.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerProveedoresDiesel, proveedor);
  }

  actualizarProveedor(proveedor: ProveedorDiesel): Observable<any> {
    proveedor.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerProveedoresDiesel + proveedor.idProveedorDiesel, proveedor);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// LINEA /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerLineas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerLinea);
  }

  enviarLinea(linea: Linea): Observable<any> {
    linea.creadoPor = this.idUsuario;
    linea.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerLinea, linea);
  }

  actualizarLinea(linea: Linea): Observable<any> {
    linea.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerLinea + linea.idLinea, linea);
  }

  borrarLinea(id: number): Observable<Linea> {
    console.log(id);
    return this.http.delete<any>(this.API_URL + this.controllerLinea + id);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// TIPO MOTOR ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerTipoMotores(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerTipoMotor);
  }

  obtenerTipoMotor(id: string): Observable<TipoMotor> {
    return this.http.get<TipoMotor>(this.API_URL + this.controllerTipoMotor + id);
  }

  enviarTipoMotor(tipoMotor: TipoMotor): Observable<any> {
    tipoMotor.creadoPor = this.idUsuario;
    tipoMotor.modificadoPor = this.idUsuario;
    tipoMotor.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerTipoMotor, tipoMotor);
  }

  actualizarTipoMotor(tipoMotor: TipoMotor ): Observable<any> {
    tipoMotor.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerTipoMotor + 'id/' + tipoMotor.idTipoMotor, tipoMotor);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// CONFIG TIPO UNIDAD ////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerConfiguracionTipoUnidades(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerConfiguracionTipoUnidad);
  }

  obtenerConfiguracionTipoUnidad(idConfiguracionTipoUnidad: string): Observable<TipoMotor> {
    return this.http.get<TipoMotor>(this.API_URL + this.controllerConfiguracionTipoUnidad + idConfiguracionTipoUnidad);
  }

}




