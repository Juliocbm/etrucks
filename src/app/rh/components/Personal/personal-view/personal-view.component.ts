import { Component } from '@angular/core';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { Router } from '@angular/router';
import { TableAction } from './../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { Personal } from './../../../../models/RH/personal';
import { Categoria } from './../../../../models/RH/Categoria';
import { Departamento } from './../../../../models/RH/Departamento';
import { ApiRecursosHumanosService } from '../../../../DataAccess/api-recursos-humanos.service';
import { StorageService } from '../../../../Services/StorageService';
import { Routes } from '../../../../app-routes.constants';
import { ModalCrudPersonalComponent } from '../modal-crud-personal/modal-crud-personal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrls: ['./personal-view.component.css']
})
export class PersonalViewComponent {

  columnConfigs: { [key: string]: ColumnConfig } = {
    idPersonal: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    apellidoPaterno: { displayName: 'Apellido Paterno', type: 'default', showFilter: true, visible: true },
    apellidoMaterno: { displayName: 'Apellido Materno', type: 'default', showFilter: true, visible: true },
    sucursal: { displayName: 'Sucursal', type: 'default', showFilter: true, visible: true },
    compania: { displayName: 'Compañía', type: 'default', showFilter: false, visible: true },
    departamento: { displayName: 'Departamento', type: 'default', showFilter: true, visible: true },
    categoria: { displayName: 'Categoría', type: 'default', showFilter: true, visible: true },
    email: { displayName: 'Email', type: 'default', showFilter: true, visible: true },
    noNomina: { displayName: 'No. Nómina', type: 'default', showFilter: true, visible: true },
    activo: { displayName: 'Estatus', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', visible: true },
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
      headerColumFontSize: 5,
      createCallback: () => this.onCreateClick()
    };

  isLoading: boolean = false;
  datos: Personal[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Personal[] = [];
  createRoute: string = Routes.personal.create();

  constructor(
    private apiRecHumanosService: ApiRecursosHumanosService,
    private router: Router,
    private storageService: StorageService<Personal>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.storageService.init('personalActual');
    this.retriveData();
  }

  retriveData(): void {
    this.isLoading = true;
    this.apiRecHumanosService.obtenerPersonal().subscribe(
      (response) => {
        console.log('Datos obtenidos', response);
        this.datos = response;
        this.datosFiltrados = this.datos;
        this.isLoading = false;
      },
      (error) => {
        this.triggerAlert('Ha ocurrido un error al obtener los datos', 'danger');
        console.error('Ha ocurrido un error al obtener los datos', error);
        this.isLoading = false;
      }
    );
  }

  cambiarEstado(personal: Personal) {
    const nuevoEstado = !personal.activo;

    this.apiRecHumanosService.actualizarPersonal({ ...personal, activo: nuevoEstado }).subscribe(
      () => {
        personal.activo = nuevoEstado;
        this.triggerAlert(`Sucursal ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente!`, 'success');
      },
      error => {
        console.log(error);
        this.triggerAlert('Error al cambiar el estado de la flota', 'danger');
      }
    );
  }

  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Personal',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudPersonalComponent, {
      width: '800px',
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
      TITULO_MODAL: 'Personal',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudPersonalComponent, {
      width: '800px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Personal',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudPersonalComponent, {
      width: '800px',
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
