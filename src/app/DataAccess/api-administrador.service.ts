import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
// import { Usuario } from '../models/Administrador/Usuario';
// import { RolModulos } from '../models/Administrador/Menu';
// import { environment } from '../../environments/environment';
import { Usuario } from '../models/Administrador/Usuario';
import { RolModulos } from '../models/Administrador/Menu';
import { environment } from '../environments/environment.prod';
import { HttpService } from '../Services/http.service';
import { Rol } from '../models/Administrador/Rol';
import { AlertService, Alert } from '../Services/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class ApiAdministradorService {

  private API_URL = environment.API_URL_SECURITY;
  idCompania: number = 0;
  idUsuario:string = "";

  controllerUsuario: string = "usuario/";
  controllerSistema: string = "Sistemas/";
  controllerRol: string = "rol/";

  constructor(private http: HttpClient,  private httpService: HttpService, private alertService: AlertService) {

    this.idUsuario = localStorage.getItem('idUsuario')??'';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////// USUARIOS //////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

    obtenerUsuariosV2(
      parametros: HttpParams,
      extraParams: { [key: string]: any }
  ): Observable<any> {
    return this.httpService
      .get(`${this.API_URL}${this.controllerUsuario}`, parametros )
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

    obtenerUsuarioById(id: string): Observable<any> {
    return this.httpService
      .get(this.API_URL + this.controllerUsuario + id, {})
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


  obtenerUsarios(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerUsuario);
  }

  obtenerCompanias(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerUsuario + 'Companias');
  }

  obtenerSistemas(): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerSistema + 'GetSistemas');
  }

  postUsuario(idSistema: number,usuario: Usuario): Observable<any> {
    usuario.creadoPor = this.idUsuario;
    usuario.modificadoPor = this.idUsuario;

    return this.httpService
      .post(this.API_URL + this.controllerUsuario + idSistema , usuario)
      .pipe(
        // Manejo de éxito
        map((data) => {
          this.alertService.success(
            'Usuario creado exitosamente'
          );
          return data;
        }),
        // Manejo de errores
        catchError((error) => {
          console.log('ERROR CASETA', error);
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

  putUsuario(usuario: Usuario): Observable<any> {
    usuario.modificadoPor = this.idUsuario

    return this.httpService
      .put(this.API_URL + this.controllerUsuario + usuario.id, usuario)
      .pipe(
        // Manejo de éxito
        map((data) => {
          this.alertService.success(
            'Usuario actualizado exitosamente'
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

  // Método para eliminar usuario
  deleteUsuario(idUsuario: string): Observable<any> {
    const modificadoPor = this.idUsuario;

    return this.httpService
      .delete(
        this.API_URL + this.controllerUsuario + idUsuario + '/' + modificadoPor
      )
      .pipe(
        // Manejo de éxito
        map((data) => {


          return data;
        }),
        // Manejo de errores
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

  //////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// ROL ///////////////////////////////////
  //////////////////////////////////////////////////////////////////////////

  obtenerRol(idSistema?:number): Observable<any> {

    let params  = new HttpParams();
    return this.http.get<any>(this.API_URL + this.controllerRol + 'v1/' + idSistema);
  }

      // Método para obtener los conceptos contables
      MenuPorIdPadre(idPadre: number): Observable<any> {
        return this.httpService
          .get(
            this.API_URL +
              this.controllerRol +
              'MenuPorIdPadre/' +
              idPadre +
              '/1/',
          )
          .pipe(
            // Modificación de los datos usando map()
            map((data: any) => {
              return data.items;
            }),
            // Manejar errores y retornar [] si falla la petición
            catchError((error) => {
              // Retornar un arreglo vacío en caso de error
              return of([]);
            })
          );
      }

  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// MENU ///////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

      // Método para obtener los roles
      obtenerRoles(
        parametros: HttpParams,
        extraParams: { [key: string]: any }
      ): Observable<any> {
       
        // Agregar idCategoria a la URL si está presente
        let url = this.API_URL + this.controllerRol + '4' + '/';
    
        return this.httpService.get(url, parametros).pipe(
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

  obtenerMenu(idSistema?:number): Observable<any> {
    idSistema = idSistema??4
    return this.http.get<any>(this.API_URL + this.controllerRol + 'Menu/'+ idSistema);
  }

  // obtenerMenuPorId(idRol:number): Observable<any> {
  //   return this.http.get<any>(this.API_URL + this.controllerRol + 'Menu/' + idRol + '/' );
  // }

  obtenerMenuPorRol(idSistema:number, idRol:number): Observable<any> {
    idSistema = idSistema??4
    return this.http.get<any>(this.API_URL + this.controllerRol + idSistema +'/' + idRol);
  }

  obtenerMenuPorRolAndId(idRol:number, idSistema:number): Observable<any> {
    return this.http.get<any>(this.API_URL + this.controllerRol+ idSistema + '/' + idRol + '/' );
  }

  postRol(rol: Rol): Observable<any> {
      
    rol.creadoPor = this.idUsuario;
    rol.modificadoPor = this.idUsuario;
    rol.idCompania = this.idCompania;

    return this.httpService
      .post(this.API_URL + this.controllerRol, rol)
      .pipe(
        // Manejo de éxito
        map((data) => {
          this.alertService.success(
            'administrador.catalogos.roles.success.creado'
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

  putRol(rol: Rol): Observable<any> {
      
    rol.modificadoPor = this.idUsuario;

    return this.httpService
      .put(this.API_URL + this.controllerRol, rol)
      .pipe(
        // Manejo de éxito
        map((data) => {
          this.alertService.success(
             'administrador.catalogos.roles.success.editado'
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

   updEstatusRol(idRol: number): Observable<any> {
    return this.httpService
      .put(
        this.API_URL + this.controllerRol + 'UpdEstatus/' + idRol + '/1/',
        null
      )
      .pipe(
        // Manejo de éxito
        map((data) => {
          this.alertService.success(
            'administrador.catalogos.roles.success.editado'
          );
          return data;
        }),
        // Manejo de errores
        catchError((error) => {
          console.log('ERROR ROL', error);
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

  // Método para obtener la informacion del Rol por id
  obtenerRolById(idRol: number): Observable<any> {
    return this.httpService
      .get(
        this.API_URL +
          this.controllerRol + 'GetRolById/' +
          idRol
      )
      .pipe(
        // Modificación de los datos usando map()
        map((data: any) => {
          return data.item;
        }),
        // Manejar errores y retornar [] si falla la petición
        catchError((error) => {
          // Retornar un arreglo vacío en caso de error
          return of([]);
        })
      );
  }

    // Método para obtener catalogo general version 2
    obtenerModulos(parametros: HttpParams, extraParams: { [key: string]: any }): Observable<any> {
      const params = parametros; 
      const { idSistema } = extraParams;
      if (idSistema == null) return of([]);

      let url = this.API_URL + this.controllerRol + 'modulos/' + idSistema 
  
      return this.httpService
        .get(url, parametros)
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
