import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Routes } from 'src/app/app-routes.constants';
import { ApiRhService } from 'src/app/DataAccess/api-rh.service';
import { Sucursal } from 'src/app/models/RH/sucursal';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ModalCrudSucursalComponent } from '../modal-crud-sucursal/modal-crud-sucursal.component';

@Component({
  selector: 'app-sucursal-view',
  templateUrl: './sucursal-view.component.html',
  styleUrls: ['./sucursal-view.component.css']
})
export class SucursalViewComponent implements OnInit {

  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Sucursal[] = [];
  datos: Sucursal[] = [];
  isLoading: boolean = false;
  createRoute: string = Routes.sucursales.create();

  constructor(
    private apiRhService:ApiRhService,
    private storageService: StorageService<Sucursal>,
    private router: Router,
    public dialog: MatDialog){

  }

  columnConfigs: { [key: string]: ColumnConfig } = {
    idSucursal: { displayName: 'Id', type: 'default', showFilter: true, visible: true  },
    nombre:{ displayName: 'Sucursal', type: 'default', showFilter: true, visible: true  },
    clave:{ displayName: 'Clave', type: 'default', showFilter: true, visible: true  },
    compania: { displayName: 'Compañia' , type: 'default', showFilter: true, visible: true  },
    activo: { displayName: 'Estatus', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
    fechaModificacion: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: true },
    usuarioModificadoPor: { displayName: 'Modificado por', type: 'default', showFilter: true, visible: true }
  };


  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClick(item)
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Editar',
      callback: (item) => this.onEditClick(item)
    }
  ];

  tableConfigs: TableConfig =
    {
      pageSizeOptions: [5, 15, 30],
      headerColumFontSize: 10,
      createCallback: () => this.onCreateClick()
    };


  ngOnInit(){
    this.storageService.init('sucursalActual');
    this.retriveData();
  }

  retriveData(){

    this.apiRhService.obtenerSucursales().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
        this.isLoading = false;

        console.log(this.datosFiltrados);
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
        this.isLoading = false;
      }
    );
  }

  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Sucursal',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudSucursalComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onEditClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Sucursal',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudSucursalComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Sucursal',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudSucursalComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  // Esta función se llama para mostrar la alerta
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

}
