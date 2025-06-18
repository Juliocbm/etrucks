import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { ColumnConfigsLiquidaciones, tableConfigsLiquidaciones } from '../../LiquidacionesConfig';
import { ApiCfdiService } from '../../../../../DataAccess/api-cfdi.service';
import { TableAction } from '../../../../../shared-module/Interfaces/TableAction';
import { Liquidacion } from '../../../../../models/Cfdi/Liquidacion';

@Component({
  selector: 'app-listado-liquidaciones',
  templateUrl: './listado-liquidaciones.component.html',
  styleUrls: ['./listado-liquidaciones.component.css']
})
export class ListadoLiquidacionesComponent implements OnInit {
  // Mapa para controlar las liquidaciones en proceso de timbrado
  private timbradoEnProceso: { [id: number]: boolean } = {};

  selectedLiquidaciones: number[] = [];
  private selectedRows: Liquidacion[] = [];

  descargaPdf(item: Liquidacion): void {
    throw new Error('Method not implemented.');
  }
  descargaXml(item: Liquidacion): void {
    throw new Error('Method not implemented.');
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
        console.log('Liquidación timbrada exitosamente:', response);
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

  constructor(public apiCfdiLiq: ApiCfdiService) { }

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
      next: () => {
        this.selectedLiquidaciones = [];
        this.selectedRows = [];
      },
      error: (err) => console.error('Error en timbrado por lote', err),
    });
  }

  ngOnInit() {
  }


}
