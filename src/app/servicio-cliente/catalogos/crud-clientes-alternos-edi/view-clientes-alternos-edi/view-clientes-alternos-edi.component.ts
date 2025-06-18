import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ModalCrudClientesAlternosEdiComponent } from '../modal-crud-clientes-alternos-edi/modal-crud-clientes-alternos-edi.component';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { ApiServicioClienteService } from 'src/app/DataAccess/api-servicio-cliente.service';
import { ClienteAlternoEdi } from 'src/app/models/Edi/ClienteAlternoEdi.interface';
import { concatMap, count, from } from 'rxjs';
import { AlertService } from 'src/app/Services/alert.service';

@Component({
  selector: 'app-view-clientes-alternos-edi',
  templateUrl: './view-clientes-alternos-edi.component.html',
  styleUrls: ['./view-clientes-alternos-edi.component.css']
})
export class ViewClientesAlternosEdiComponent implements OnInit {

  columnConfigs: { [key: string]: ColumnConfig } = {
    noCliente: { displayName: 'No. Cliente', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    domicilio: { displayName: 'Domicilio', type: 'default', showFilter: true, visible: true },
    rfc: { displayName: 'RFC', type: 'default', showFilter: true, visible: true },
    cantidadClientesAlternos: { displayName: 'Clientes Alternos', type: 'default', showFilter: true, visible: true },
    creadoPor: { displayName: 'Creado por', type: 'default', showFilter: true, visible: false },
    fechaCreacion: { displayName: 'Creado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: false },
    modificadoPor: { displayName: 'Modificado por', type: 'default', showFilter: true, visible: true },
    fechaModificacion: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    activo: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: false, visible: false },
  };
  
  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 12,
    createCallback: () => this.openDialog('CREATE')
  };

  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.openDialog('DETAIL', item),
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Editar',
      callback: (item) => this.openDialog('EDIT', item)
    },
    {
      name: 'delete',
      title: 'Eliminar',
      icon: 'delete',
      tooltip: 'Eliminar',
      callback: (item) => this.onDelete(item)
    }
  ];
  
  dataTable: any[] = [];
  isLoading: boolean = false;

  constructor(
    private _matDialog: MatDialog,
    private _apiServicioCliente: ApiServicioClienteService,
    private _alertService: AlertService
  ) { }
  
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.isLoading = true;
    this._apiServicioCliente
    .getClientesPrincipalesEdi()
    .subscribe((data: any) => {
      this.dataTable = data;
      this.isLoading = false;
    });
  }

  openDialog(tipo: 'CREATE' | 'EDIT' | 'DETAIL', row: any | null = null) {
    if(tipo === 'CREATE' || row.activo){
      const dialogRef = this._matDialog.open(ModalCrudClientesAlternosEdiComponent, {
        width: '1000px',
        height: '80%',
        data: { tipo, row }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.getData();
      });
    }else{
      this._alertService.info('No se puede editar o eliminar registro eliminado');
    }
  }
  
  onDelete(row: any) {
    if(row.activo){
      this._alertService.question('¿Está seguro de eliminar el registro con todos sus clientes alternos?').subscribe(
      (result) => {
        if (result) {
          this._apiServicioCliente.deleteClientesPrincipalesEdi(row.idClientePrincipalEdi)
          .subscribe({
            next: result => console.log(result),
            complete: () => {
              this._alertService.success('Se han eliminado los datos correctamente.');
              this.getData();
            }
          });
        }
      })
    }else{
      this._alertService.info('No se puede editar o eliminar registro eliminado');
    }
  } 

}
