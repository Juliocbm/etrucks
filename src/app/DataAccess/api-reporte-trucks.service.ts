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
import { environment } from '../environments/environment.prod';
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
export class ApiRptTrcuksService {

  private API_URL = environment.API_URL_HGTOOLS;

  //GUIAS
  private controllerGuias: string = 'ReporteSeguimientoGuia/';
  
  idCompania: number = 0;
  idUsuario: string = "";
  usuario: string = "";

    constructor(private http: HttpClient, private httpService: HttpService) {
      this.idUsuario = localStorage.getItem('idUsuario') ?? '';
      this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
      this.API_URL = environment.API_URL_HGTOOLS;
    }
  

  //////////////////////////////////////////////////////////////////////////
  //////////////////////////////// GUIAS ///////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

    //reporte de seguimiento de guias
    getSeguimientoGuia(parametros: HttpParams): Observable<any> {
      return this.httpService
        .get<any>(
          this.API_URL +
            this.controllerGuias +
            `rpt/${this.idCompania}`,
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
}
