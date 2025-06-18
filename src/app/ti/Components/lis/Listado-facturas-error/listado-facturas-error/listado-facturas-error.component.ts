import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiInterfacesLisService } from 'src/app/DataAccess/api-interfaces-lis';
import { CartaPorte } from 'src/app/models/ti/cfdi/cartaPorte';
import { DashboardComponentLis } from '../../dashboard/dashboard-envio-xml.component';
import { ColumnConfigsFacturas, tableConfigsFacturas } from '../../cartaPorteConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { FullTableV2Component } from '../../../../../shared-module/components/full-tableV2/full-table.component';

@Component({
  selector: 'app-listado-facturas-error',
  templateUrl: './listado-facturas-error.component.html',
  styleUrls: ['./listado-facturas-error.component.css']
})
export class ListadoFacturasErrorComponent {

  @ViewChild(FullTableV2Component) tableComponent!: FullTableV2Component;
  
  cartasPorte: CartaPorte[] = [];
  paginatedCartasPorte: CartaPorte[] = [];
  filteredCartasPorte: CartaPorte[] = [];

  ColumnConfigsFacturas = ColumnConfigsFacturas;
  tableConfigsFacturas = tableConfigsFacturas;

  currentPage: number = 1;
  itemsPerPage: number = 18;
  totalPages: number = 1;
  loading: boolean = false;

  filterValues = {
    numGuia: '',
    cteReceptorId: '',
    cteReceptorNombre: '',
    idUnidad: '',
    operador: '',
    fechaTimbrado: ''
  };

  constructor(public apiInterfacesLis: ApiInterfacesLisService,
    public dialog: MatDialog) { }

  ngOnInit() {
    /* this.getFacturasErroneas(); */
  }

  tableActions: TableAction[] = [
    {
      name: 'Ver',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Corregir',
      callback: (item) => this.onEditClick(item)
    }
  ];

  show(item: any) {
    console.log('item', item);
  }

  onEditClick(cartaPorte: CartaPorte): void {
    console.log('cartaPorte2:', cartaPorte);

    const dialogRef = this.dialog.open(DashboardComponentLis, {
      width: '1000px',
      data: cartaPorte // Pasa el objeto específico para edición
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.tableComponent.loadData()
    }); 
  }

}
