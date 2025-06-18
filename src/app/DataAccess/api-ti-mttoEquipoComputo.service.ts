import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { mttoEquipoComputo } from "../models/ti/mttoEquipoComputo";
import { environment } from "../environments/environment.prod";
@Injectable({
    providedIn: 'root'
})
export class ApiMttoEquipoComputo {
    private API_URL = environment.API_URL_ASIG_AUTO + 'v1/'//'https://tools.apphgtransportaciones.com/API_HGToolsPortal/v1/'; //'https://localhost:44349/v1/';//////
    idCompania: number = 0;
    idUsuario:string = "";

    constructor(private http: HttpClient){

        this.idUsuario = localStorage.getItem('idUsuario')??'';
        this.idCompania = Number(localStorage.getItem('CompaniaSelect'))??0;

    }

    //EndPoints
    obtenerDatos(): Observable<any> {
        return this.http.get<any>(`${this.API_URL}MttoEquipoComputo/` + this.idCompania );
      }


}
