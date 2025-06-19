import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ColumnConfigsLiquidaciones, tableConfigsLiquidaciones } from '../../LiquidacionesConfig';
import { ApiCfdiService } from '../../../../../DataAccess/api-cfdi.service';
import { TableAction } from '../../../../../shared-module/Interfaces/TableAction';
import { Liquidacion } from '../../../../../models/Cfdi/Liquidacion';
import { FullTableV2Component } from '../../../../../shared-module/components/full-tableV2/full-table.component';
import { ModalErrorsValidationsComponent } from '../../../../cfdi/dashboard/modal-errors-validations/modal-errors-validations/modal-errors-validations.component';

@Component({
  selector: 'app-listado-liquidaciones',
  templateUrl: './listado-liquidaciones.component.html',
  styleUrls: ['./listado-liquidaciones.component.css']
})
export class ListadoLiquidacionesComponent implements OnInit {
  // Mapa para controlar las liquidaciones en proceso de timbrado
  private timbradoEnProceso: { [id: number]: boolean } = {};

  @ViewChild('fullTable') fullTable!: FullTableV2Component;

  selectedLiquidaciones: number[] = [];
  private selectedRows: Liquidacion[] = [];

  verErrores(item: Liquidacion): void {
    if (!item.errores || item.errores.length === 0) {
      return;
    }
    this.dialog.open(ModalErrorsValidationsComponent, {
      width: '50%',
      data: { errores: item.errores }
    });
  }

  descargaPdf(item: Liquidacion): void {
    this.downloadFile(item.pdf, `Liquidacion_${item.idLiquidacion}.pdf`);
  }

  descargaXml(item: Liquidacion): void {
    this.downloadFile(item.xml, `Liquidacion_${item.idLiquidacion}.xml`);
  }

  private downloadFile(blob: Blob | null | undefined, name: string) {
    if (!blob) {
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  timbrarLiquidacion(item: Liquidacion): void {
    const idLiquidacion = item.idLiquidacion;
    // Evitar múltiples peticiones para la misma liquidación
    if (this.timbradoEnProceso[idLiquidacion]) {
      return;
    }

    this.timbradoEnProceso[idLiquidacion] = true;
    item.timbrando = true;

    this.apiCfdiLiq
      .timbrarLiquidacion(idLiquidacion)
      .pipe(
        finalize(() => {
          this.timbradoEnProceso[idLiquidacion] = false;
          item.timbrando = false;
        })
      )
      .subscribe({
      next: (response) => {
        if (!response) {
          item.estatus = 2;
          item.mensaje = 'Error desconocido';
          return;
        }

        item.mensaje = response.mensaje;
        item.errores = response.errores;

        if (response.isSuccess) {
          item.estatus = 3;
          if (response.xmlByteArray) {
            item.xml = this.apiCfdiLiq.base64ToBlob(response.xmlByteArray, 'application/xml');
          }
          if (response.pdfByteArray) {
            item.pdf = this.apiCfdiLiq.base64ToBlob(response.pdfByteArray, 'application/pdf');
          }
        } else {
          item.estatus = 2;
        }
      },
      error: (error) => {
        console.error('Error al timbrar la liquidación:', error);
      }
    });
  }

  tableActions: TableAction[] = [
    {
      name: 'Descarga',
      title: 'Descargar XML',
      icon: 'file_download',
      tooltip: 'Descarga XML',
      callback: (item: Liquidacion) => this.descargaXml(item),
      isVisible: (item: Liquidacion) => item.estatus === 3
    },
    {
      name: 'Descarga',
      title: 'Descargar PDF',
      icon: 'file_download',
      tooltip: 'Descarga PDF',
      callback: (item: Liquidacion) => this.descargaPdf(item),
      isVisible: (item: Liquidacion) => item.estatus === 3
    },
    {
      name: 'Errores',
      title: 'Ver errores',
      icon: 'error_outline',
      tooltip: 'Ver errores',
      callback: (item: Liquidacion) => this.verErrores(item),
      isVisible: (item: Liquidacion) => !!item.errores && item.errores.length > 0
    },
    {
      name: 'Timbrar',
      title: 'Timbrar',
      icon: 'receipt_long',
      tooltip: 'Timbrar',
      callback: (item: Liquidacion) => this.timbrarLiquidacion(item),
      showCondition: (item: Liquidacion) =>
        !this.timbradoEnProceso[item.idLiquidacion],
      isVisible: (item: Liquidacion) => [0, 2, 4, 5].includes(item.estatus)

    }
  ];

  ColumnConfigsLiquidaciones = ColumnConfigsLiquidaciones;
  tableConfigsLiquidaciones = tableConfigsLiquidaciones;

  constructor(public apiCfdiLiq: ApiCfdiService, private dialog: MatDialog) { }

  onSelectedRows(rows: Liquidacion[]) {
    this.selectedRows = rows;
    this.selectedLiquidaciones = rows.map((r) => r.idLiquidacion);
  }

  timbrarLote() {
    if (this.selectedLiquidaciones.length === 0) return;

    const requests = this.selectedRows.map((row) => {
      this.timbradoEnProceso[row.idLiquidacion] = true;
      row.timbrando = true;
      return this.apiCfdiLiq.timbrarLiquidacion(row.idLiquidacion).pipe(
        finalize(() => {
          this.timbradoEnProceso[row.idLiquidacion] = false;
          row.timbrando = false;
        })
      );
    });

    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((res, idx) => {
          const row = this.selectedRows[idx];
          if (!res) {
            row.estatus = 2;
            row.mensaje = 'Error desconocido';
            return;
          }
          row.mensaje = res.mensaje;
          row.errores = res.errores;
          if (res.isSuccess) {
            row.estatus = 3;
            if (res.xmlByteArray) {
              row.xml = this.apiCfdiLiq.base64ToBlob(res.xmlByteArray, 'application/xml');
            }
            if (res.pdfByteArray) {
              row.pdf = this.apiCfdiLiq.base64ToBlob(res.pdfByteArray, 'application/pdf');
            }
          } else {
            row.estatus = 2;
          }
        });
        this.selectedLiquidaciones = [];
        this.selectedRows = [];
        this.fullTable.clearSelection();
      },
      error: (err) => console.error('Error en timbrado por lote', err),
    });
  }

  ngOnInit() {
  }


}
