import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable, of, tap } from 'rxjs';
import { ApiGuiasService } from 'src/app/DataAccess/api-guias.service';
import { AlertService } from 'src/app/Services/alert.service';
import { LoadingService } from 'src/app/Services/loading.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';

@Component({
  selector: 'app-actualizacion-estatus-de-guias',
  templateUrl: './actualizacion-estatus-de-guias.component.html',
  styleUrls: ['./actualizacion-estatus-de-guias.component.css']
})
export class ActualizacionEstatusDeGuiasComponent implements OnInit {
  //#region Table V1
  columnConfigs: { [key: string]: ColumnConfig } = {
    noGuia: {
      displayName: 'No.',
      type: 'default',
      showFilter: false,
      visible: true,
      widthColumn: '90px'
    },
    numGuia: {
      displayName: 'Guía',
      type: 'default',
      showFilter: false,
      visible: true,
      widthColumn: '110px'
    },
    statusGuia: {
      displayName: 'Estatus',
      type: 'default',
      showFilter: false,
      visible: true,
      widthColumn: '70px'
    },
    tipoDoc: {
      displayName: 'Tipo documento',
      type: 'number',
      showFilter: false,
      visible: true,
      widthColumn: '100px'
    },
    observacionesGuia: {
      displayName: 'Observaciones',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    fechaGuia: {
      displayName: 'Fecha',
      type: 'date',
      showFilter: false,
      visible: true,
      widthColumn: '110px'
    },
  };
  guias: any [] = [];
  //#endregion
  //#region Form cambio de estatus
  formCambioDeEstatus: FormGroup;
  estatusGuias$: any;
  estatusSelect: any = null;
  columnConfigEstatusGuias: { [key: string]: ColumnConfig } = {
    id: {
      displayName: 'Id',
      type: 'default',
      showFilter: true,
      visible: true
    },
    nombre: {
      displayName: 'Nombre',
      type: 'default',
      showFilter: true,
      visible: true,
    },
  };
  displayColConfEstatusGuias: DisplayColumnConfigDF = {
    identificador: 'id',
    separadorColumnas: ' - ',
    columnas: ['nombre'],
  };
  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5
  };
  tipoDocs$: any;
  tipoDocSelect: any = { id: 1, nombre: '1 - GUIA' };
  //#endregion
  //#region Form control de busqueda
  guiasFormControl: FormControl = new FormControl('')
  //#endregion
  constructor(
    private _formBuilder: FormBuilder,
    private _apiGuias: ApiGuiasService,
    private _loading: LoadingService,
    private _alertService: AlertService
  ) {
    this.estatusGuias$ = this._obtenerEstatusTraficoGuia.bind(this);
    this.tipoDocs$ = this._obtenerEstatusTipoDoc.bind(this);

    this.formCambioDeEstatus = this._formBuilder.group({
        estatus: [null, [Validators.required]],
        tipoDocumento: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  searchGuias(){
    let guiasString =  this.guiasFormControl.value;  
    if(guiasString != undefined && guiasString != null && guiasString != ''){
      this._loading.open();
      this._apiGuias.getGuiasByIdsString(guiasString)
      .pipe(
        tap((res: any[]) => {
          res.length == 0? this._alertService.info('No se encontraron registros.'):null
        }),
        finalize( () => this._loading.close())
      )
      .subscribe(
        (res: any[]) => {
          this.guias = res;
        }
      );
    }
  }

  updateGuias(){
    if(this.formCambioDeEstatus.valid && this.guias.length > 0){
      let estatus = this.formCambioDeEstatus.value.estatus;
      let tipoDocumento = this.formCambioDeEstatus.value.tipoDocumento;
      this._alertService.question(`Seguro de actualizar un total de ${this.guias.length} guias a estatus ${estatus}?`)
      .subscribe( ok => {
        if(ok){
          this._loading.open();
          let guiasIds: string[] = this.guias.map( g => g.numGuia );
          this._apiGuias.putGuiasByIdsString(guiasIds, estatus, tipoDocumento)
          .pipe(
            tap( (res: any[]) => {
              res.length == 0? this._alertService.info('No se encontraron registros.'):null
            }),
            finalize( () => this._loading.close())
          )
          .subscribe(
            (res: any[]) => {
              this.guias = [];
              this._alertService.success('Actualización exitosa');
              this.estatusSelect = null;
            }
          );
        }
      });
    }
  }

  private _obtenerEstatusTraficoGuia(parametros: HttpParams): Observable<any> {
    return of({
      "message": null,
      "totalRecords": 5,
      "items": [
        {
          "id": 1,
          "nombre": "A - PENDIENTE",
          "estatus": "A"
        },
        {
          "id": 2,
          "nombre": "C - TRANSFERIDA",
          "estatus": "C"
        },
        {
          "id": 3,
          "nombre": "R - REGRESO",
          "estatus": "R"
        },
        {
          "id": 4,
          "nombre": "B - CANCELADA",
          "estatus": "B"
        },
        {
          "id": 5,
          "nombre": "T - TRANSITO",
          "estatus": "T"
        }
      ],
      "success": true,
      "item": null,
      "errorList": []
    });
  }

  private _obtenerEstatusTipoDoc(parametros: HttpParams): Observable<any> {
    return of({
      "message": null,
      "totalRecords": 2,
      "items": [
        {
          "id": 1,
          "nombre": "1 - GUIA"
        },
        {
          "id": 2,
          "nombre": "2 - CARTA PORTE"
        }
      ],
      "success": true,
      "item": null,
      "errorList": []
    });
  }
}
