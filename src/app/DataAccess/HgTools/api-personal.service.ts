import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { environment } from 'src/app/environments/environment.prod';
import { HttpService } from 'src/app/Services/http.service';
import { AlertService } from 'src/app/Services/alerts.service';

@Injectable({
    providedIn: 'root'
  })
export class ApiPersonalService {

  //private API_URL = 'https://localhost:7093/api/';//environment.API_URL_HGTOOLS;
  private API_URL = environment.API_URL_RH;
  idCompania: number = 0;
  idUsuario:string = "";

  controllerPersonal: string = "Personal/";
  controllerPersonalTrucks: string = "PersonalTrucks/";
  constructor(private http: HttpClient, private httpService: HttpService, private alertService: AlertService) {

    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// Menu //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

    obtenerPersonal(activos?: Boolean): Observable<any> {
     
      let params  = new HttpParams();
    params  = params.set('activos', (activos ?? false).toString());
    params  = params.set('idCompania',this.idCompania);
      return this.http.get<any>(this.API_URL + this.controllerPersonal , {  params });
    }

  obtenerPersonalV2(parametros: HttpParams): Observable<any> {
    
    return this.httpService.get(this.API_URL + this.controllerPersonal + 'V2/', { parametros });
  }

  obtenerPersonalById(idPersonal: number): Observable<any> {

    return this.http.get(this.API_URL + this.controllerPersonal  + this.idCompania + '/'+ idPersonal);
  }

  obtenerCategorias(): Observable<any> {
    return this.http.get<any>(this.API_URL + 'Categorias/' );
  }
  obtenerCompanias(): Observable<any> {
    return this.http.get<any>(this.API_URL +'Compania/' );
  }

  obtenerDepartamentos(): Observable<any> {
    return this.http.get<any>(this.API_URL + 'Departamento/' );
  }

  postPersonal(personal: any): Observable<any> {
    personal.creadoPor = this.idUsuario;
    personal.modificadoPor = this.idUsuario;
    //personal.idCompania = this.idCompania;
    return this.http.post<any>(this.API_URL + this.controllerPersonal , personal );
  }

  putPersonal(personal: any): Observable<any> {
    personal.modificadoPor = this.idUsuario
    return this.http.put<any>(this.API_URL + this.controllerPersonal + personal.idPersonal, personal);
  }

  // Regenerar el codigo de barras del empleado con base en el id del empleado (idPersonal) = PUT /api/Personal/RegCodigoBarras/{idPersonal}
  regenerarCodigoBarras(idPersonal: number): Observable<any> {
    return this.http.put(this.API_URL + this.controllerPersonal + 'RegCodigoBarras/' + idPersonal, null);
  }


  //////////////////////////////////////////////////////////////////////////
  ////////////////////// PERSONAL TRUCKS HGDB_LIS //////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerPersonalTrucks(parametros: HttpParams): Observable<any> {
    console.log('parametros endpoint get personal trucks', parametros);
    return this.httpService.get(this.API_URL + this.controllerPersonalTrucks ,  parametros );
  }

  obtenerPersonalTrucksById(idPersonal: number): Observable<any> {

    return this.http.get(this.API_URL + this.controllerPersonalTrucks + idPersonal);
  }

  enviarPersonalTrucks(idPersonal: number): Observable<any> {
    return this.httpService.post(this.API_URL + this.controllerPersonalTrucks + idPersonal + '/' + this.idUsuario, null
    )
    .pipe(
      // Manejo de éxito
      map((data) => {
        this.alertService.success(
          'Migracion realizada con exito.'
        );
        return data;
      }),
      // Manejo de errores
      catchError((error) => {
        // Retornar un arreglo vacío en caso de error
        return of([]);
      })
    );
  }
}
