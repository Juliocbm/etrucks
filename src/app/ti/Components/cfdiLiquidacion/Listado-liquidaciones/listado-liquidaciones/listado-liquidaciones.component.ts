import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ColumnConfigsLiquidaciones, tableConfigsLiquidaciones } from '../../LiquidacionesConfig';
import { ApiCfdiService } from '../../../../../DataAccess/api-cfdi.service';
import { TableAction } from '../../../../../shared-module/Interfaces/TableAction';
import { Liquidacion } from '../../../../../models/Cfdi/Liquidacion';
import { LoadingService } from 'src/app/Services/loading.service';

@Component({
  selector: 'app-listado-liquidaciones',
  templateUrl: './listado-liquidaciones.component.html',
  styleUrls: ['./listado-liquidaciones.component.css']
})
export class ListadoLiquidacionesComponent implements OnInit {
  // Mapa para controlar las liquidaciones en proceso de timbrado
  private timbradoEnProceso: { [id: number]: boolean } = {};

  descargaPdf(item: Liquidacion): void {
    throw new Error('Method not implemented.');
  }
  descargaXml(item: Liquidacion): void {
    throw new Error('Method not implemented.');
  }

  timbrarLiquidacion(idLiquidacion: number): void {
    // Evitar múltiples peticiones para la misma liquidación
    if (this.timbradoEnProceso[idLiquidacion]) {
      return;
    }

    this.timbradoEnProceso[idLiquidacion] = true;
    this.loading.open();

    this.apiCfdiLiq
      .timbrarLiquidacion(idLiquidacion)
      .pipe(
        finalize(() => {
          this.loading.close();
          this.timbradoEnProceso[idLiquidacion] = false;
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
      callback: (item: Liquidacion) => this.descargaXml(item)
    },
    {
      name: 'Descarga',
      title: 'Descargar PDF',
      icon: 'file_download',
      tooltip: 'Descarga PDF',
      callback: (item: Liquidacion) => this.descargaPdf(item)
    },
    {
      name: 'Timbrar',
      title: 'Timbrar',
      icon: 'receipt_long',
      tooltip: 'Timbrar',
      callback: (item: Liquidacion) => this.timbrarLiquidacion(item.idLiquidacion),
      showCondition: (item: Liquidacion) => !this.timbradoEnProceso[item.idLiquidacion]

    }
  ];

  ColumnConfigsLiquidaciones = ColumnConfigsLiquidaciones;
  tableConfigsLiquidaciones = tableConfigsLiquidaciones;

  constructor(public apiCfdiLiq: ApiCfdiService, private loading: LoadingService) { }

  ngOnInit() {
  }


}
