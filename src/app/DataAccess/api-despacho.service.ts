import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Viaje, CancelaViaje } from '../models/Despacho/Viaje';
import { Guia } from '../models/Despacho/Guia';
import { ViajeEstatus } from '../models/Despacho/ViajeEstatus';
import { UnidadEstatus } from '../models/Despacho/UnidadEstatus';
import { Tramo } from '../models/Despacho/Tramo';
import { Convenio } from '../models/Despacho/Convenios';
import { ConceptoContable } from '../models/Despacho/ConceptoContable';
import { ConceptoFacturable } from '../models/Despacho/ConceptoFacturable';
import { Operador } from '../models/Despacho/Operador';
import { Plaza } from '../models/Despacho/Plaza';
import { EvidenciaViaje } from '../models/Despacho/Viajes';
import { Ruta } from '../models/Despacho/Ruta';
import { Sucursal } from '../models/Despacho/Sucursal';
import { RemolqueEstatus } from '../models/Despacho/remolqueEstatus';
import { TipoSeguimientoViaje } from '../models/Despacho/TipoSeguimientoViaje';
import { Flota } from '../models/Despacho/Flota';
import { Liquidacion } from '../models/Despacho/Liquidacion';
import { InformacionOperador } from '../Interfaces/InformacionOperador';
import { environment } from '../environments/environment';
import { Compania } from '../models/Administrador/Compania';
import { ApiResponse } from '../Interfaces/Response.model';
import { Permisionario } from '../models/Despacho/Permisionario';
import { BitacoraAsistencia } from '../models/Despacho/BitacoraAsistencia';
import { TipoMotor, TipoMotorModded } from '../models/Mantenimiento/tipoMotor';
import { UnidadOperador } from '../models/Despacho/UnidadOperador';
import { AsignacionViaje } from '../models/Despacho/AsignacionViaje';
import { HttpService } from '../Services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiDespachoService {

  private API_URL = environment.API_URL_DESPACHO;

  //GUIAS
  private controllerGuias: string = 'guias/';
  private controllerConceptoContable: string = 'conceptosCont/';
  private controllerConceptoFacturable: string = 'conceptosFacturables/';

  //RUTAS Y PLAZAS
  private controllerRuta: string = 'rutas/';
  private controllerTramo: string = 'tramos/';
  private controllerPlaza: string = 'plazas/';
  private controllerSucursal: string = 'sucursales/';
  private controllerCasetasPeaje: string = 'casetasPeaje/';

  //UNIDADES Y REMOLQUES
  private controllerFlota: string = 'flotas/';
  private controllerUnidadEstatus: string = 'unidadEstatus/';
  private controllerRemolqueEstatus: string = 'remolqueEstatus/'

  //GENERALES
  private controllerTipoServicio: string = 'tipoServicio/';
  private controllerLiquidacion: string = 'liquidaciones/';
  private controllerOperador: string = 'operadores/';

  //VIAJES
  private controllerViajes: string = 'viajes/';
  private controllerAnticiposViaje: string = 'anticiposViaje/';
  private controllerEvidenciasViaje: string = 'evidenciasViaje/';
  private controllerViajeEstatus: string = 'viajeEstatus/';
  private controllerValeCombustible: string = 'valeCombustible/';
  private controllerSeguimientoViaje: string = 'seguimientoViaje/';
  private controllerPermisionarios: string = 'permisionarios/';

  //CONVENIO
  private controllerConvenio: string = 'Convenio/';

  // RENDIMIENTO MOTOR
  private controllerRendimientoMotor: string = 'rendimientoMotor/';


  //COMPAÑIAS
  private controllerCompanias: string = 'companias/'

  private controllerBitacoraAsistencia: string = 'bitacoraAsistencia/';

  //ASIGNACION DE UNIDAD OPERADOR
  private controllerUnidadOperador: string = 'unidadOperador/';

  //REPORTES VIAJES
  private controllerRptViajes: string = 'RptViajes/';

  idCompania: number = 0;
  idUsuario: string = "";
  usuario: string = "";

  constructor(private http: HttpClient, private _httpService: HttpService) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.usuario = localStorage.getItem('usuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// GUIAS ///////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerGuias(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerGuias + this.idCompania);
  }

  obtenerGuia(idViaje: number): Observable<Guia> {
    return this.http.get<Guia>(this.API_URL + this.controllerGuias + this.idCompania + '/' + idViaje);
  }

  crearGuia(guia: Guia): Observable<Guia> {
    guia.idCompania = this.idCompania;
    guia.creadoPor = this.idUsuario;
    guia.modificadoPor = this.idUsuario;

    // Iterar sobre los detalles de la guía para asignar los valores
    guia.detalles.forEach(detalle => {
      detalle.idCompania = this.idCompania;
      detalle.creadoPor = this.idUsuario;
      detalle.modificadoPor = this.idUsuario;
    });

    // Iterar sobre las mercancías de la guía para asignar los valores
    guia.mercanciasCCP.forEach(mercancia => {
      mercancia.idCompania = this.idCompania;
      mercancia.creadoPor = this.idUsuario;
      mercancia.modificadoPor = this.idUsuario;
    });
    return this.http.post<Guia>(this.API_URL + this.controllerGuias, guia);
  }
  
  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// VIAJES //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerViajes(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerViajes + this.idCompania);
  }

  obtenerViajePorId(id: number): Observable<Viaje> {
    return this.http.get<Viaje>(this.API_URL + this.controllerViajes + id);
  }

  insertarViaje(viaje: Viaje): Observable<Viaje> {
    viaje.creadoPor = this.idUsuario;
    viaje.modificadoPor = this.idUsuario;
    viaje.idCompania = this.idCompania;
    console.log(viaje);

    return this.http.post<Viaje>(this.API_URL + this.controllerViajes + 'create', viaje).pipe(
      map((respuesta: Viaje) => {
        respuesta.usuarioCreadoPor = this.usuario;
        return respuesta;
      })
    );
  }

  changeEstatusViaje(idViaje: number, idEstatus: number): Observable<boolean> {
    return this.http.put<boolean>(this.API_URL + this.controllerViajes + this.idCompania + '/' + idViaje + '/' + idEstatus, null);
  }

  actualizarViaje(viaje: Viaje): Observable<Viaje> {
    viaje.creadoPor = this.idUsuario;
    viaje.modificadoPor = this.idUsuario;
    viaje.idCompania = this.idCompania;
    return this.http.put<Viaje>(this.API_URL + this.controllerViajes + viaje.idViaje, viaje);
  }

  obtenerAsignacionViajes(activos: boolean = false) : Observable<any> {
    let params  = new HttpParams();
    params  = params .set('activos', activos);
    params  = params .set('ordenarPor', 'IdAsignacionViaje');

    return this.http.get<any>(this.API_URL + this.controllerViajes + 'asignacion/' + this.idCompania, { params });
  }

  insertarAsignacionViaje(newAsignacion: AsignacionViaje) {
    // throw new Error('Method not implemented.');
    newAsignacion.creadoPor = this.idUsuario;
    newAsignacion.modificadoPor = this.idUsuario;
    newAsignacion.idCompania = this.idCompania;
    return this.http.post<AsignacionViaje>(this.API_URL + this.controllerViajes + 'asignacion/' + newAsignacion.idCompania + '/' + newAsignacion.idViaje, newAsignacion);
  }

  actualizaAsignacionViaje(asignacionViaje: AsignacionViaje) {
    return this.http.put<Viaje>(this.API_URL + this.controllerViajes + 'asignacion/' + this.idCompania, asignacionViaje);
  }

  cancelaViaje(viaje: CancelaViaje): Observable<any> {
    viaje.creadoPor = this.idUsuario;
    viaje.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerViajes + 'cancelaViaje', viaje);
  }



  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// ANTICIPOS VIAJE ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  crearAnticipos(anticipos: any[]): Observable<any> {

    return this.http.post<any>(this.API_URL + this.controllerAnticiposViaje + 'AnticipoViaje', anticipos);
  }

  obtenerAnticiposPorViaje(idViaje: number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerAnticiposViaje + 'AnticipoViaje/' + idViaje);
  }

  actualizarAnticipos(anticipos: any[]): Observable<any> {

    return this.http.put<any>(this.API_URL + this.controllerAnticiposViaje + 'AnticipoViaje', anticipos);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// VALES COMBUSTIBLE DE VIAJE ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  ImprimeVale(idViaje: number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerValeCombustible + idViaje);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// EVIDENCIA VIAJE ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  getAllViajes(): Observable<EvidenciaViaje[]> {
    return this.http.get<EvidenciaViaje[]>(this.API_URL + this.controllerEvidenciasViaje);
  }

  getViajeById(id: number): Observable<EvidenciaViaje> {
    return this.http.get<EvidenciaViaje>(this.API_URL + this.controllerEvidenciasViaje + id);
  }

  addViaje(evidencia: EvidenciaViaje): Observable<any> {
    evidencia.creadoPor = this.idUsuario;
    evidencia.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerEvidenciasViaje, evidencia);
  }

  updateViaje(id: any, evidencia: EvidenciaViaje): Observable<any> {
    evidencia.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerEvidenciasViaje + id, evidencia);
  }

  deleteViaje(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + this.controllerEvidenciasViaje + id);
  }

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////// VIAJE ESTATUS ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerListaViajeEstatus(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerViajeEstatus);
  }

  enviarViajeEstatus(viajeEstatus: ViajeEstatus): Observable<ViajeEstatus> {
    return this.http.post<ViajeEstatus>(this.API_URL + this.controllerViajeEstatus, viajeEstatus);
  }

  actualizarViajeEstatus(viajeEstatus: ViajeEstatus): Observable<ViajeEstatus> {
    return this.http.put<ViajeEstatus>(this.API_URL + this.controllerViajeEstatus + viajeEstatus.idViajeEstatus, viajeEstatus);
  }

  borrarViajeEstatus(id: number): Observable<any> {
    return this.http.delete<any>(this.API_URL + this.controllerViajeEstatus + id);
  }

  obtenerViajeEstatus(id: number): Observable<ViajeEstatus> {
    return this.http.get<ViajeEstatus>(this.API_URL + this.controllerViajeEstatus + id);
  }

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////// UNIDAD ESTATUS ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerListaUnidadEstatus(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerUnidadEstatus);
  }

  obtenerUnidadEstatus(idEstatus: number): Observable<UnidadEstatus> {
    return this.http.get<UnidadEstatus>(this.API_URL + this.controllerUnidadEstatus + idEstatus);
  }

  enviarUnidadEstatus(unidadEstatus: UnidadEstatus): Observable<UnidadEstatus> {
    unidadEstatus.creadoPor = this.idUsuario;
    unidadEstatus.modificadoPor = this.idUsuario;
    return this.http.post<UnidadEstatus>(this.API_URL + this.controllerUnidadEstatus, unidadEstatus);
  }

  actualizarUnidadEstatus(unidadEstatus: UnidadEstatus): Observable<UnidadEstatus> {
    unidadEstatus.modificadoPor = this.idUsuario;
    return this.http.put<UnidadEstatus>(this.API_URL + this.controllerUnidadEstatus + unidadEstatus.idUnidadEstatus, unidadEstatus);
  }

  eliminarUnidadEstatus(idEstatus: number): Observable<boolean> {
    return this.http.post<boolean>(this.API_URL + this.controllerUnidadEstatus, idEstatus);
  }

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////////// TRAMO ////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerTramos(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerTramo);
  }

  obtenerTramosSelect(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerTramo + 'Select');
  }

  obtenerTramo(id: Tramo): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerTramo + id + '/');
  }

  enviarTramo(tramo: Tramo): Observable<Tramo> {
    tramo.creadoPor = this.idUsuario;
    tramo.modificadoPor = this.idUsuario;
    return this.http.post<Tramo>(this.API_URL + this.controllerTramo, tramo);
  }

  actualizarTramo(tramo: Tramo): Observable<Tramo> {
    tramo.modificadoPor = this.idUsuario;
    return this.http.put<Tramo>(this.API_URL + this.controllerTramo + tramo.idTramo + '/', tramo);
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////// CASETA PEAJE ////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerCasetaPeajeSitios(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerCasetasPeaje + 'sitios');
  }

  obtenerCasetasPeaje(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerCasetasPeaje);
  }

  enviarCasetaPeaje(casetaPeaje: any): Observable<any> {
    casetaPeaje.creadoPor = this.idUsuario;
    casetaPeaje.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerCasetasPeaje, casetaPeaje);
  }

  actualizarCasetaPeaje(elemento: any): Observable<any> {
    elemento.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerCasetasPeaje + elemento.idCasetaPeaje + '/', elemento);
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////// CONCEPTO CONTABLE //////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  enviarConceptoContable(concepto: ConceptoContable): Observable<any> {
    concepto.creadoPor = this.idUsuario;
    concepto.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerConceptoContable, concepto);
  }

  obtenerConceptosContables(): Observable<any> {

    return this.http.get<any>(this.API_URL + this.controllerConceptoContable);
  }

  obtenerConceptoContablePorTipo(tipoConcepto: string): Observable<any> {

    return this.http.get<any>(this.API_URL + this.controllerConceptoContable + tipoConcepto);
  }

  actualizarConceptoContable(concepto: ConceptoContable): Observable<any> {
    concepto.modificadoPor = this.idUsuario
    return this.http.put<any>(this.API_URL + this.controllerConceptoContable + concepto.idConceptoContable, concepto);
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////// CONCEPTO FACTURABLE //////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  enviarConceptoFacturable(concepto: ConceptoFacturable): Observable<any> {
    concepto.creadoPor = this.idUsuario;
    concepto.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerConceptoFacturable, concepto);
  }

  obtenerConceptosFacturables(): Observable<any> {

    return this.http.get<any>(this.API_URL + this.controllerConceptoFacturable);
  }

  obtenerConceptoFacturablePorTipo(tipoConcepto: string): Observable<any> {

    return this.http.get<any>(this.API_URL + this.controllerConceptoFacturable + tipoConcepto);
  }

  actualizarConceptoFacturable(concepto: ConceptoFacturable): Observable<any> {
    concepto.modificadoPor = this.idUsuario
    return this.http.put<any>(this.API_URL + this.controllerConceptoFacturable + concepto.idConceptoFacturable, concepto);
  }



  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// OPERADOR //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerOperadores(): Observable<any> {
    return this.http.get<Operador[]>(this.API_URL + this.controllerOperador + this.idCompania);
  }

  obtenerOperadoresSelect(): Observable<any> {
    return this.http.get<Operador[]>(this.API_URL + this.controllerOperador +'Select/'+ this.idCompania);
  }

  obtenerOperadoresFlota(idFlota: number): Observable<any> {
    return this.http.get<Operador[]>(this.API_URL + this.controllerOperador +'Flota/'+ this.idCompania + '/' +  idFlota);
  }

  obtenerOperadoresFleetMgr(): Observable<any> {
    return this.http.get<Operador[]>(this.API_URL + this.controllerOperador +'FleetMgr/'+ this.idCompania + '/' +  this.idUsuario);
  }

  obtenerOperadoresAsignacion(): Observable<any> {
    return this.http.get<Operador[]>(this.API_URL + this.controllerOperador + this.idCompania + '/details');
  }

  obtenerOperador(idCompania: number, id: Operador): Observable<any> {
    console.log(id.idOperador)
    return this.http.get<any>(this.API_URL + this.controllerOperador + idCompania + '/' + id.idOperador);
  }

  obtenerLicenciaOperador(idPersonal: number): Observable<any>{
    return this.http.get<any>(this.API_URL + this.controllerOperador + 'licencias/' + idPersonal)
  }


  enviarOperador(operador: Operador): Observable<Operador> {
    operador.idCompania = this.idCompania;
    operador.creadoPor = this.idUsuario;
    operador.modificadoPor = this.idUsuario;
    console.log('operador',operador);
    return this.http.post<Operador>(this.API_URL + this.controllerOperador, operador);
  }

  actualizarOperador(operador: Operador): Observable<Operador> {
    console.log(operador);
    operador.modificadoPor = this.idUsuario;
    return this.http.put<Operador>(this.API_URL + this.controllerOperador + operador.idOperador + '/', operador);
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// PLAZA //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPlazas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerPlaza);
  }

  obtenerPlaza(id: Plaza): Observable<any> {
    console.log(id.idPlaza);
    return this.http.get<any>(this.API_URL + this.controllerPlaza + id.idPlaza);
  }

  obtenerPorEstado(idEstado:number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerPlaza + 'PorEstado/' + idEstado);
  }

  enviarPlaza(plaza: Plaza): Observable<Plaza> {
    plaza.creadoPor = this.idUsuario;
    plaza.modificadoPor = this.idUsuario;
    return this.http.post<Plaza>(this.API_URL + this.controllerPlaza, plaza);
  }

  obtenerPaisesEstados(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerPlaza + 'paises');
  }

  obtenerMunicipios(idEstado: number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerPlaza + 'municipios/' + idEstado);
  }

  actualizarPlaza(plaza: Plaza): Observable<Plaza> {
    plaza.modificadoPor = this.idUsuario;
    return this.http.put<Plaza>(this.API_URL + this.controllerPlaza + plaza.idPlaza, plaza);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// RUTA //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerRutas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRuta);
  }

  obtenerRuta(idRuta:number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRuta + idRuta);
  }

  enviarRuta(ruta: Ruta): Observable<any> {
    ruta.creadoPor = this.idUsuario;
    ruta.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerRuta, ruta);
  }

  actualizarRuta(ruta: Ruta): Observable<any> {
    ruta.modificadoPor = this.idUsuario;
    return this.http.put<Ruta>(this.API_URL + this.controllerRuta, ruta);
  }

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////////// SUCURSAL /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerSucursales(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSucursal);
  }

  obtenerSucursal(id: Sucursal): Observable<any> {
    console.log(id.idSucursal)
    return this.http.get<any>(this.API_URL + this.controllerSucursal + this.idCompania + '/' + id.idSucursal + '/');
  }

  enviarSucursal(sucursal: any): Observable<any> {
    sucursal.creadoPor = this.idUsuario;
    sucursal.modificadoPor = this.idUsuario;
    sucursal.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerSucursal, sucursal);
  }

  actualizarSucursal(operador: Sucursal): Observable<any> {
    return this.http.put<any>(this.API_URL + this.controllerSucursal + operador.idSucursal + '/', operador);
  }

  borrarSucursal(id: number, id2: number): Observable<Sucursal> {
    console.log(id, id2);
    return this.http.delete<any>(this.API_URL + this.controllerSucursal + id + '/' + id2);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// REMOLQUES /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerListaRemolqueEstatus(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRemolqueEstatus)
  }

  obtenerRemolqueEstatus(id: RemolqueEstatus): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRemolqueEstatus + id.idRemolqueEstatus + '/')
  }

  actualizarRemolqueEstatus(remolqueEstatus: RemolqueEstatus): Observable<RemolqueEstatus> {
    remolqueEstatus.modificadoPor = this.idUsuario;
    return this.http.put<RemolqueEstatus>(this.API_URL + this.controllerRemolqueEstatus + remolqueEstatus.idRemolqueEstatus + '/', remolqueEstatus);
  }

  enviarRemolqueEstatus(remolqueEstatus: RemolqueEstatus): Observable<RemolqueEstatus> {
    remolqueEstatus.creadoPor = this.idUsuario;
    remolqueEstatus.modificadoPor = this.idUsuario;
    return this.http.post<RemolqueEstatus>(this.API_URL + this.controllerRemolqueEstatus, remolqueEstatus)
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// SEGUIMIENTO VIAJE /////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerSeguimientosViaje(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSeguimientoViaje)
  }

  obtenerSeguimientoViaje(idCompania: number, id: TipoSeguimientoViaje): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSeguimientoViaje + idCompania + '/' + id.idTipoSeguimientoViaje + '/')
  }

  actualizarSeguimientoViaje(tipoSeguimientoViaje: TipoSeguimientoViaje): Observable<any> {
    tipoSeguimientoViaje.modificadoPor = this.idUsuario;
    tipoSeguimientoViaje.idCompania = this.idCompania;
    return this.http.put<any>(this.API_URL + this.controllerSeguimientoViaje + tipoSeguimientoViaje.idTipoSeguimientoViaje + '/', tipoSeguimientoViaje);
  }

  enviarSeguimientoViaje(tipoSeguimientoViaje: TipoSeguimientoViaje): Observable<any> {
    tipoSeguimientoViaje.creadoPor = this.idUsuario;
    tipoSeguimientoViaje.modificadoPor = this.idUsuario;
    tipoSeguimientoViaje.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerSeguimientoViaje, tipoSeguimientoViaje)
  }

  obtenerEmpresas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSeguimientoViaje + 'Companias')
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////// TIPO SERVICIO //////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerTiposServicio(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerTipoServicio)
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// FLOTA //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerFlotas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerFlota + this.idCompania);
  }

  obtenerFlota(idCompania: number, idFlota: number): Observable<Flota> {
    return this.http.get<Flota>(this.API_URL + this.controllerFlota + idCompania + '/' + idFlota);
  }

  enviarFlota(flota: Flota): Observable<boolean> {
    const headers = { 'Content-Type': 'application/json' };
    flota.idCompania = this.idCompania;
    flota.creadoPor = this.idUsuario;
    flota.modificadoPor = this.idUsuario;
    return this.http.post<boolean>(this.API_URL + this.controllerFlota, flota, { headers });
  }

  actualizarFlota(flota: Flota): Observable<boolean> {
    const headers = { 'Content-Type': 'application/json' };
    flota.modificadoPor = this.idUsuario;
    return this.http.put<boolean>(this.API_URL + this.controllerFlota + flota.idFlota + '/', flota, { headers });
  }

  eliminarFlota(idFlota: number): Observable<boolean> {
    return this.http.post<boolean>(this.API_URL + this.controllerFlota + 'EliminarFlota', idFlota);
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////// LIQUIDACION OLD TRUCKS //////////////////////////
  //////////////////////////////////////////////////////////////////////////

  // Un ejemplo de un método para obtener datos de la API.
  obtenerLiquidaciones(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerLiquidacion);
  }
  //Obtener datos del endpoint de Operadores
  obtenerDatosOperadores(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerLiquidacion + 'operadores');
  }

  obtenerViajesAdeudos(operador: number, compania: number | null): Observable<InformacionOperador> {
    return this.http.get<InformacionOperador>(this.API_URL + this.controllerLiquidacion + 'datosOperador/' + compania + '/' + operador);
  }

  enviarLiquidacion(liq: Liquidacion): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(this.API_URL + this.controllerLiquidacion, liq);
  }

  actualizarLiquidacion(liq: Liquidacion): Observable<Liquidacion> {
    return this.http.put<Liquidacion>(this.API_URL + this.controllerLiquidacion + liq.no_liquidacion, liq);
  }

  borrarLiquidacion(id: string): Observable<Liquidacion> {
    console.log(id);
    return this.http.delete<any>(this.API_URL + this.controllerLiquidacion + id);
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// COMPANIAS ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerCompanias(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerCompanias);
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// PERMISIONARIOS //////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPermisionarios(): Observable<any> {
   /*  console.log('Obtener permisionarios'); */
    return this.http.get<any>(this.API_URL + this.controllerPermisionarios);
  }

  obtenerPermisionarioById(idPermisionario: number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerPermisionarios + '/' + idPermisionario);
  }

  enviarPermisionario(permisionario: Permisionario): Observable<Permisionario> {
    return this.http.post<Permisionario>(this.API_URL + this.controllerPermisionarios, permisionario);
  }

  actualizarPermisionario(permisionario: Permisionario): Observable<Permisionario> {
   /*  flota.idCompania = this.idCompania;
    flota.creadoPor = this.idUsuario; */
    permisionario.modificadoPor = this.idUsuario;
/*
    console.log('permisionario', permisionario); */
    return this.http.put<Permisionario>(this.API_URL + this.controllerPermisionarios, permisionario);
  }

  validarRfc(id:number | null, rfc: string): Observable<boolean> {
   /*  console.log('entro a dataccess',id, rfc); */
    return this.http.get<ApiResponse<boolean>>(`${this.API_URL}${this.controllerPermisionarios}id/${id}/rfc/${rfc}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'Error al verificar el RFC');
          }
        /*   console.log(response); */
          return response.data;
        })
      );
  }
  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Convenio //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  // obtenerConvenios(): Observable<any> {
  //   return this.http.get<any>(this.API_URL + this.controllerConvenio);
  // }


  obtenerConvenios(activos:boolean = false): Observable<any> {
    let params  = new HttpParams();
    if(activos){
      params  = params .set('activos', activos);
    }
    return this.http.get<any>(this.API_URL + this.controllerConvenio, { params  });
  }

  obtenerConvenio(idConvenio:number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerConvenio + idConvenio);
  }


  enviarConvenio(convenio: Convenio): Observable<any> {
    convenio.creadoPor = this.idUsuario;
    convenio.modificadoPor = this.idUsuario;
    convenio.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerConvenio, convenio);
  }

  actualizarConvenio(convenio: Convenio): Observable<any> {
    convenio.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerConvenio, convenio);
  }

  obtenerCasetasPorRuta(idRuta: number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerConvenio + 'Casetas/' + idRuta);
  }
  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Bitacora asistencia //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerBitacoraOperador(idOperador:number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerBitacoraAsistencia + idOperador + '/' + this.idCompania);
  }

  enviarBitacoraOperador(bitacora: BitacoraAsistencia[]): Observable<any> {

    return this.http.post<any>(this.API_URL + this.controllerBitacoraAsistencia, bitacora);
  }

  actualizarBitacoraOperador(bitacora: BitacoraAsistencia[]): Observable<any> {

    return this.http.put<any>(this.API_URL + this.controllerBitacoraAsistencia, bitacora);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// RENDIMIENTO MOTOR /////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerRendimientoMotores(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRendimientoMotor);
  }

  obtenerRendimientoMotor(id: string): Observable<TipoMotorModded> {
    return this.http.get<TipoMotorModded>(this.API_URL + this.controllerRendimientoMotor + id);
  }

  enviarRendimientoTipoMotor(tipoMotor: TipoMotor): Observable<any> {
    // tipoMotor.creadoPor = this.idUsuario;
    // tipoMotor.modificadoPor = this.idUsuario;
    // tipoMotor.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerRendimientoMotor, tipoMotor);
  }

  actualizarRendimientoTipoMotor(tipoMotor: TipoMotor ): Observable<any> {
    // tipoMotor.modificadoPor = this.idUsuario;
    console.log(tipoMotor);
    return this.http.put<any>(this.API_URL + this.controllerRendimientoMotor + 'id/' + tipoMotor.idTipoMotor, tipoMotor);
  }

  //////////////////////////////////////////////////////////////////////////
  /////////////////////////// UNIDAD OPERADOR //////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  enviarUnidadOperador(unidadOperador: UnidadOperador[]): Observable<any> {
    return this.http.post<any>(this.API_URL + this.controllerUnidadOperador, unidadOperador);
  }

  actualizarUnidadOperador(unidadOperador: UnidadOperador[]): Observable<any> {
    return this.http.put<any>(this.API_URL + this.controllerUnidadOperador, unidadOperador);
  }

  obtenerEstatusViajev2(parametros: HttpParams): Observable<any> {
    const params = parametros;

    // Agregar idCategoria a la URL si está presente
    let url = this.API_URL + this.controllerViajes + 'estatusV2/';

    return this.http.get(url, { params });
  }

  obtenerRptSeguimientoDeViajes(
    parametros: HttpParams,
    extraParams: any
  ): Observable<any> {
    const params = parametros;

    return this._httpService
      .get(
        `${this.API_URL}${this.controllerRptViajes}seguimiento/${this.idCompania}`,
        params
      )
      .pipe(
        // Modificación de los datos usando map()
        map((data) => {
          return data;
        }),
        // Manejar errores y retornar [] si falla la petición
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

  obtenerPosicionesPorViaje(
    parametros: HttpParams,
    idViaje: number
  ): Observable<any> {
    const params = parametros;

    return this._httpService
      .get(
        `${this.API_URL}${this.controllerRptViajes}posiciones/${idViaje}`,
        params
      )
      .pipe(
        // Modificación de los datos usando map()
        map((data) => {
          return data;
        }),
        // Manejar errores y retornar [] si falla la petición
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

  obtenerPosicionesPorViajePaginado(
    parametros: HttpParams,
    extraParams: any
  ): Observable<any> {
    const params = parametros;

    let idViaje = extraParams.idViaje;

    return this._httpService
      .get(
        `${this.API_URL}${this.controllerRptViajes}posiciones/paginado/${idViaje}`,
        params
      )
      .pipe(
        // Modificación de los datos usando map()
        map((data) => {
          return data;
        }),
        // Manejar errores y retornar [] si falla la petición
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

}
