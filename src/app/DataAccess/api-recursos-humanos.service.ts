import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Departamento } from '../models/RH/Departamento';
import { Categoria } from '../models/RH/Categoria';
import { Personal } from '../models/RH/personal';
import { environment } from '../environments/environment.prod';
import { AptoMedico } from '../models/RH/AptoMedico';
import { AuthService } from '../security/services/auth.service';
import { SueldoOperador } from '../models/RH/SueldoOperador';
import { Periodo } from '../models/RH/Periodo';
import { Prestamo } from '../models/RH/Prestamo';
import { Pension } from '../models/RH/Pension';
import { Prestacion } from '../models/RH/Prestacion';
import { EstatusAsistencia } from '../models/RH/EstatusAsistencia';
import { ImpuestoNomina } from '../models/RH/ImpuestoNomina';
import { Banco } from '../models/RH/Banco';
import { TipoCaja } from '../models/RH/TipoCaja';
import { CargoCajaAhorro } from '../models/RH/CajaAhorro';
import { HttpService } from '../Services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ApiRecursosHumanosService {

  private API_URL = environment.API_URL_RH;
  idCompania: number = 0;
  idUsuario: string = "";
  public username: string | null = null;


  controllerDepartamento: string = "departamento/";
  controllerCategoria: string = 'categorias/';
  controllerPersonal: string = 'personal/';
  controllerPersonalTools: string = 'PersonalTools/';
  controllerAptoMedico: string = 'AptoMedico/'
  controllerCompania: string = 'Compania/'
  controllerSueldoOperador: string = 'SueldoOperador/'
  controllerPeriodo: string = 'Periodo/'
  controllerPrestamo: string = 'Prestamo/'
  controllerPension: string = 'Pension/'
  controllerEstatusAsistencia: string = 'EstatusAsistencia/';
  controllerImpuesto: string = 'ImpuestoNomina/';
  controllerPrestacion: string = 'Prestacion/';
  controlleBanco: string = 'Banco/';
  controllerTipoCaja: string = 'api/TipoCaja/';
  controllerPersonalBanco: string = 'PersonalBanco/';
  controllerSucursal: string = 'Sucursal/';
  controllerCajaAhorro: string = 'CajaAhorro/';
  controllerIngreso: string = 'Ingreso/';
  controllerSalarioDiario: string = 'SalarioDiario/';




  //////////////////////////////////////////////////////////////////////////
  /////////////////////////// DEPARTAMENTO /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  constructor(private http: HttpClient, public authService: AuthService, private httpService: HttpService) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
    this.username = this.authService.usuario;
    this.API_URL = environment.API_URL_RH;
  }

  obtenerDepartamentos(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerDepartamento);
  }

  obtenerDepartamento(id: Departamento): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerDepartamento + id.idDepartamento + '/');
  }

  enviarDepartamento(departamento: Departamento): Observable<any> {
    departamento.creadoPor = this.idUsuario;
    departamento.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerDepartamento, departamento);
  }

  actualizarDepartamento(departamento: Departamento): Observable<any> {
    departamento.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerDepartamento + departamento.idDepartamento + '/', departamento);
  }

  borrarDepartamento(departamento: Departamento): Observable<Departamento> {
    return this.http.delete<any>(this.API_URL + this.controllerDepartamento + departamento);
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////// CATEGORIA //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  enviarCategoria(categoria: Categoria): Observable<any> {
    categoria.creadoPor = this.idUsuario;
    categoria.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerCategoria, categoria);
  }

  obtenerCategorias(): Observable<any> {
    return this.http.get<Categoria>(this.API_URL + this.controllerCategoria);
  }

  actualizarCategoria(categoria: Categoria): Observable<any> {
    categoria.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerCategoria + categoria.idCategoria, categoria);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// PERSONAL //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPersonal(activos?:boolean): Observable<any> {

    let params  = new HttpParams();
    params  = params.set('activos', activos ?? false);
    params  = params.set('idCompania',this.idCompania);

    // Personal
    var apiUrlPrueba = environment.API_URL_RH + this.controllerPersonalTools ;
    // var apiUrlPrueba = "https://tools.apphgtransportaciones.com/Api_HGToolsPortal/api/PersonalTools/GetPersonal";

    console.log("apiUrlPrueba",apiUrlPrueba,  { params });

    return this.http.get<any>(apiUrlPrueba,  { params });
    // return this.http.get<any>(this.API_URL + this.controllerPersonal ,  { params });
  }

  obtenerPersonalById(idPersonal: number): Observable<Personal> {
    return this.http.get<Personal>(this.API_URL + this.controllerPersonal + this.idCompania + '/' + idPersonal);
  }

  obtenerPersonalByUsuario(): Observable<Personal> {
    return this.http.get<Personal>(this.API_URL + this.controllerPersonal +'usuario/' + this.idCompania + '/' + this.idUsuario);
  }

  validarRfc(rfc: string): Observable<boolean> {
    return this.http.get<boolean>(this.API_URL + this.controllerPersonal + 'rfc/' + rfc);
  }

  enviarPersonal(personalEstatus: Personal): Observable<any> {
    personalEstatus.creadoPor = this.idUsuario;
    personalEstatus.modificadoPor = this.idUsuario;
    personalEstatus.idCompania = this.idCompania;
  return this.http.post<any>(this.API_URL + this.controllerPersonal, personalEstatus);
  }

  actualizarPersonal(personalEstatus: Personal): Observable<any> {
    personalEstatus.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerPersonal + personalEstatus.idPersonal, personalEstatus);
  }

  eliminarPersonal(idEstatus: number): Observable<boolean> {
    return this.http.post<boolean>(this.API_URL + this.controllerPersonal, idEstatus);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// PERSONAL //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerAptoMedicos(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerAptoMedico)
  }

  enviarAptoMedico(aptoMedico: AptoMedico): Observable<AptoMedico> {
    aptoMedico.creadoPor = this.idUsuario;
    aptoMedico.modificadoPor = this.idUsuario;
    aptoMedico.emitidoPor = this.username || '';
    return this.http.post<AptoMedico>(this.API_URL + this.controllerAptoMedico, aptoMedico);
  }

  actualizarAptoMedico(aptoMedico: AptoMedico): Observable<AptoMedico> {
    aptoMedico.modificadoPor = this.idUsuario;
    aptoMedico.emitidoPor = this.username || '';
    return this.http.put<AptoMedico>(this.API_URL + this.controllerAptoMedico + aptoMedico.idAptoMedico + '/', aptoMedico);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Sueldo de Operadores //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerSueldo(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSueldoOperador)
  }

  enviarSueldo(sueldo: SueldoOperador): Observable<any> {
    sueldo.creadoPor = this.idUsuario;
    sueldo.modificadoPor = this.idUsuario;
    sueldo.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerSueldoOperador, sueldo);
  }

  actualizarSueldo(sueldo: SueldoOperador): Observable<any> {
    sueldo.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerSueldoOperador, sueldo);
  }

  deshabilitaSueldo(sueldo: SueldoOperador): Observable<any> {
    sueldo.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerSueldoOperador + '/Deshabilita', sueldo);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Sueldo de Operadores //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPeriodos(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerPeriodo + this.idCompania)
  }

  obtenerPeriodoActual(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerPeriodo + 'actual/' + this.idCompania)
  }
  obtenerPeriodoAnt(periodo: Periodo): Observable<any> {

    return this.http.post<any>(this.API_URL + this.controllerPeriodo, periodo);
  }

  actualizarPeriodo(periodo: Periodo): Observable<any> {
    periodo.modificadoPor = this.idUsuario;
    periodo.fechaModificacion = new Date();
    return this.http.put<any>(this.API_URL + this.controllerPeriodo + periodo.idPeriodo, periodo);
  }

    //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Prestamo de Operadores //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPrestamos(): Observable<any>
  {
    return this.http.get<any>(this.API_URL + this.controllerPrestamo)
  }

  enviarPrestamo(prestamo: Prestamo): Observable<any> {
    prestamo.creadoPor = this.idUsuario;
    prestamo.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerPrestamo, prestamo);
  }


  actualizarPrestamo(prestamo: Prestamo): Observable<any> {
    prestamo.modificadoPor = this.idUsuario;
    prestamo.fechaModificacion = new Date();
    return this.http.put<any>(this.API_URL + this.controllerPrestamo, prestamo);
  }


    //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Prestamo de Operadores //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPensiones(): Observable<any>
  {
    return this.http.get<any>(this.API_URL + this.controllerPension)
  }

  enviarPension(pension: Pension): Observable<any> {
    pension.creadoPor = this.idUsuario;
    pension.modificadoPor = this.idUsuario;
    pension.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerPension, pension);
  }

  actualizarPension(pension: Pension): Observable<any> {
    pension.modificadoPor = this.idUsuario;
    pension.fechaModificacion = new Date();
    return this.http.put<any>(this.API_URL + this.controllerPension, pension);
  }

  reportePensiones(fechaIni?:Date, fechaFin?:Date): Observable<any>
  {
    let params = new HttpParams();
    if (fechaIni)
      params = params.append('fechaInicio', fechaIni.toISOString());
    if (fechaFin)
      params = params.append('fechaFin', fechaFin.toISOString());


    return this.http.get<any>(this.API_URL + this.controllerPension+ 'reporte/' + this.idCompania, { params });
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// COMPANIA //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  obtenerCompanias(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerCompania);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////// ESTATUS ASISTENCIA OP /////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerEstatusAsistencia(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerEstatusAsistencia + this.idCompania)
  }

  enviarEstatusAsistencia(estatusAsistencia: EstatusAsistencia): Observable<EstatusAsistencia> {
    estatusAsistencia.creadoPor = this.idUsuario;
    estatusAsistencia.modificadoPor = this.idUsuario;
    return this.http.post<EstatusAsistencia>(this.API_URL + this.controllerEstatusAsistencia, estatusAsistencia);
  }

  actualizarEstatusAsistencia(estatusAsistencia: EstatusAsistencia): Observable<EstatusAsistencia> {
    estatusAsistencia.modificadoPor = this.idUsuario;
    return this.http.put<EstatusAsistencia>(this.API_URL + this.controllerEstatusAsistencia + estatusAsistencia.idEstatus, estatusAsistencia);
  }

  eliminarEstatusAsistencia(idEstatus: number): Observable<boolean> {
    return this.http.post<boolean>(this.API_URL + this.controllerEstatusAsistencia, idEstatus);
  }

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// IMPUESTOS ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerImpuestosNomina(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerImpuesto)
  }

  enviarImpuestoNomina(impuesto: ImpuestoNomina): Observable<ImpuestoNomina> {
    impuesto.creadoPor = this.idUsuario;
    impuesto.modificadoPor = this.idUsuario;
    return this.http.post<ImpuestoNomina>(this.API_URL + this.controllerImpuesto, impuesto);
  }

  actualizarImpuestoNomina(impuesto: ImpuestoNomina): Observable<ImpuestoNomina> {
    impuesto.modificadoPor = this.idUsuario;
    return this.http.put<ImpuestoNomina>(this.API_URL + this.controllerImpuesto + impuesto.idImpuestoNomina, impuesto);
  }

  eliminarImpuestoNomina(idImpuesto: number): Observable<boolean> {
    return this.http.post<boolean>(this.API_URL + this.controllerImpuesto, idImpuesto);
  }

    //////////////////////////////////////////////////////////////////////////
  ///////////////////////////// Prestacion //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  enviarPrestacion(prestacion: Prestacion): Observable<any> {
    prestacion.creadoPor = this.idUsuario;
    prestacion.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerPrestacion, prestacion);
  }

  obtenerPrestacion(): Observable<any> {
    return this.http.get<Prestacion>(this.API_URL + this.controllerPrestacion);
  }

  actualizarPrestacion(prestacion: Prestacion): Observable<any> {
    prestacion.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerPrestacion, prestacion);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Prestamo de Operadores //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerBanco(): Observable<any>
  {
    return this.http.get<any>(this.API_URL + this.controlleBanco)
  }

  enviarBanco(banco: Banco): Observable<any> {
    banco.creadoPor = this.idUsuario;
    banco.modificadoPor = this.idUsuario;
    banco.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controlleBanco, banco);
  }

  actualizarBanco(banco: Banco): Observable<any> {
    banco.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controlleBanco, banco);
  }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////// Tipo de caja ////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    obtenerTipoCaja(activos?:boolean): Observable<any> {

      let params  = new HttpParams();
      params  = params.set('activos', activos ?? false);
      var apiUrlPrueba = environment.API_URL_RH + this.controllerTipoCaja;

      return this.http.get<any>(apiUrlPrueba);
      // return this.http.get<any>(this.API_URL + this.controllerPersonal ,  { params });
    }

    obtenerTipoCajaById(idTipoCaja: number): Observable<TipoCaja> {
      return this.http.get<TipoCaja>(this.API_URL + this.controllerTipoCaja + idTipoCaja);
    }

    enviarTipoCaja(tipoCaja: TipoCaja): Observable<any> {
      tipoCaja.creadoPor = this.idUsuario;
      tipoCaja.modificadoPor = this.idUsuario;
    return this.http.post<any>(this.API_URL + this.controllerTipoCaja, tipoCaja);
    }

    actualizarTipoCaja(tipoCaja: TipoCaja): Observable<any> {
      tipoCaja.modificadoPor = this.idUsuario;
      return this.http.put<any>(this.API_URL + this.controllerTipoCaja + tipoCaja.idTipoCaja, tipoCaja);
    }

 //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Personal Banco ///////////////////////////
  /////////////////////////////////////////////////////////////////////////
  obtenerPersonalBanco(): Observable<any>
  {

    return this.http.get<any>(this.API_URL + this.controllerPersonalBanco)
  }
  enviarPersonalBanco(personalBanco: any): Observable<any> {
    personalBanco.creadoPor = this.idUsuario;
    personalBanco.modificadoPor = this.idUsuario;

    return this.http.post<any>(this.API_URL + this.controllerPersonalBanco, personalBanco);
  }
  actualizarPersonalBanco(personalBanco: any): Observable<any> {
    personalBanco.modificadoPor = this.idUsuario;
    return this.http.put<any>(this.API_URL + this.controllerPersonalBanco, personalBanco);
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Sucursal //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  obtenerSucursales(): Observable<any> {
    // console.log(this.API_URL + this.controllerSucursal + this.idCompania);
    return this.http.get<any>(this.API_URL + this.controllerSucursal + this.idCompania);
  }

  // Get Sucursal V2
  getSucursalesV2(parametros: HttpParams ): Observable<any> {
    // let params = new HttpParams()
    // // .set('ordenarPor', parametros.ordenarPor.toString())
    // .set('noPagina', parametros.noPagina.toString())
    // .set('tamanoPagina', parametros.tamanoPagina.toString())
    // .set('idCompania', parametros.idCompania.toString())
    // .set('multiIds', parametros.multiIds??'')
    // .set('actionMulti', parametros.actionMulti??'');

    return this.httpService.get('https://eapis.apphgtransportaciones.com/rh/api/' + 'Sucursal' + '/V2', { parametros });
    // return this.http.get<any>(this.API_URL + this.controllerSucursal + '/V2', { params });
  }

  obtenerSucursalById(idSucursal: number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSucursal + idSucursal);
  }


  //#region Caja Ahorro

  /**
   * 
   * @param fechaDesde Rango inicio de fecha
   * @param fechaHasta Rango fin de fecha
   * @param tpoEmpleado tipo de empleado: Todos | Operador | Empleado
   * @returns Observable http que emite lista de cargos de caja de ahorro.
   */
  obtenerCargosCajaAhorro(fechaDesde: string, fechaHasta: string, tpoEmpleado: string): Observable<CargoCajaAhorro[]> {
    const params = {
      idEmpresa: this.idCompania,
      desde: fechaDesde || new Date().toISOString(),
      hasta: fechaHasta || new Date().toISOString(),
      tpoEmpleado: tpoEmpleado || 'Todos'
    };
    return this.http.get<CargoCajaAhorro[]>(`${this.API_URL}${this.controllerCajaAhorro}cargos`, { params });
  }
  //#endregion

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////// Reporte/Ingresos(Liquidaciones) ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  reporteIngresoOperadores(params: HttpParams): Observable<any> {
    // if (fechaIni) params = params.append('fechaInicio', fechaIni.toISOString());
    // if (fechaFin) params = params.append('fechaFin', fechaFin.toISOString());
    // params = params.append('ordenarPor', 'fechaLiquidacion');

    return this.httpService
      .get(
        this.API_URL +
          this.controllerIngreso +
          'reporte/' +
          this.idCompania,
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

  reporteOperadoresActualizarEstatusTimbrado(params: HttpParams): Observable<any> {
    
    console.log('PARAMS EN PUT', params);

    //    return this.http.put<any>(this.API_URL + this.controllerCategoria + categoria.idCategoria, categoria);
    return this.httpService
      .get(
        this.API_URL +
          this.controllerIngreso +
          'reporte/exportLiquidacion/' +
          this.idCompania,
        params
      );
  }

  //////////////////////////////////////////////////////////////////////////
  ///////////////////////// Reporte/SalarioDiario(Liquidaciones) ///////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  GetReporteSalarioDiario(params: HttpParams): Observable<any> {
    // if (fechaIni) params = params.append('fechaInicio', fechaIni.toISOString());
    // if (fechaFin) params = params.append('fechaFin', fechaFin.toISOString());
    // params = params.append('ordenarPor', 'fechaLiquidacion');

    return this.httpService
      .get(
        this.API_URL +
          this.controllerSalarioDiario +
          'reporte/' +
          this.idCompania,
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

