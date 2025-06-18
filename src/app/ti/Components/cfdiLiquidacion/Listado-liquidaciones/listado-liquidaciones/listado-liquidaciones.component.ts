import { Component, OnInit } from '@angular/core';
import { ColumnConfigsLiquidaciones, tableConfigsLiquidaciones } from '../../LiquidacionesConfig';
import { ApiInterfacesLisService } from 'src/app/DataAccess/api-interfaces-lis';
import { ApiCfdiService } from '../../../../../DataAccess/api-cfdi.service';
import { TableAction } from '../../../../../shared-module/Interfaces/TableAction';

@Component({
  selector: 'app-listado-liquidaciones',
  templateUrl: './listado-liquidaciones.component.html',
  styleUrls: ['./listado-liquidaciones.component.css']
})
export class ListadoLiquidacionesComponent implements OnInit {
  descargaPdf(item: any): void {
    throw new Error('Method not implemented.');
  }
  descargaXml(item: any): void {
    throw new Error('Method not implemented.');
  }

  timbrarLiquidacion(idLiquidacion: number): void {
    this.apiCfdiLiq.timbrarLiquidacion(idLiquidacion).subscribe({
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
      callback: (item) => this.descargaXml(item)
    },
    {
      name: 'Descarga',
      title: 'Descargar PDF',
      icon: 'file_download',
      tooltip: 'Descarga PDF',
      callback: (item) => this.descargaPdf(item)
    },
    {
      name: 'Timbrar',
      title: 'Timbrar',
      icon: 'receipt_long',
      tooltip: 'Timbrar',
      callback: (item) => this.timbrarLiquidacion(item.idLiquidacion)
      
    }
  ];

  ColumnConfigsLiquidaciones = ColumnConfigsLiquidaciones;
  tableConfigsLiquidaciones = tableConfigsLiquidaciones;

  constructor(public apiCfdiLiq: ApiCfdiService) { }

  ngOnInit() {
  }


}
