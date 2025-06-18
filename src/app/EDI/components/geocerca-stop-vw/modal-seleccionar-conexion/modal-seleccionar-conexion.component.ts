import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiEdiService } from 'src/app/DataAccess/Edi/api-edi.service';
import { ParametrosDropdownConexionDetalle } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-modal-seleccionar-conexion',
  template: `
    <h2 mat-dialog-title>Seleccionar Conexión</h2>
    <mat-dialog-content style="display: block;">
    <app-dropdown-fullV2
        style="margin-bottom: 20px !important; position: relative; display: block;"
        [fetchDataFunction]="apiEDI.getConexionDetalle.bind(apiEDI)"
        [parametros]="parametrosConexionDetalle"
        [columnConfigs]="columnConfigsConexionDetalle"
        [placeholder]="'Selecciona una conexión detalle'"
        [IS_EDITABLE]="true"
        [itemDefault]="conexionDetalleSelected"
        [displayColumnConfigDF]="displayColumnConfigDFConexionDetalle"
        (enviarItemEvent)="onSeleccionaConexionDetalle($event)"
        #myTable
        [tableConfigs]="tableConfigsConexionDetalle">
    </app-dropdown-fullV2>
    </mat-dialog-content>
<!--     <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-button color="primary" (click)="dialogRef.close()">Aceptar</button>
    </mat-dialog-actions> -->
  `
})
export class ModalSeleccionarConexionComponent {
  parametrosConexionDetalle = ParametrosDropdownConexionDetalle;

  displayColumnConfigDFConexionDetalle = {
    identificador: 'idConexionDetalle',
    separadorColumnas: ' - ',
    columnas: ['descripcion', 'scac']
  };

  columnConfigsConexionDetalle = {
    idConexionDetalle: { displayName: 'ID', type: 'default', showFilter: true, visible: true },
    descripcion: { displayName: 'NOMBRE', type: 'default', showFilter: true, visible: true },
    scac: { displayName: 'SCAC', type: 'default', showFilter: true, visible: true }
  };
  conexionDetalleSelected: any = ({});

  tableConfigsConexionDetalle = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5
  };

  constructor(
    public dialogRef: MatDialogRef<ModalSeleccionarConexionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiEDI: ApiEdiService
  ) {}

  onSeleccionaConexionDetalle(item: any) {
    if (item) {
      this.dialogRef.close(item);
    }
  }
}
