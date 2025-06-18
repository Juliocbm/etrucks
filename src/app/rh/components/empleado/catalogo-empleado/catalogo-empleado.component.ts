import { Component } from '@angular/core';
import { Menu } from 'src/app/models/Administrador/Menu';
import { ApiPersonalService } from 'src/app/DataAccess/HgTools/api-personal.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from '../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from '../../../../shared-module/Interfaces/TableConfig';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Routes } from '../../../../app-routes.constants';
import { ModalCrudEmpleadoComponent } from '../modal-crud-empleado/modal-crud-empleado.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/Services/StorageService';
import { PersonalModel } from 'src/app/models/RH/Empleado/empleado';


@Component({
  selector: 'app-catalogo-empleado',
  templateUrl: './catalogo-empleado.component.html',
  styleUrls: ['./catalogo-empleado.component.css']
})
export class CatalogoEmpleadoComponent {

  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: PersonalModel[] = [];
  datos: PersonalModel[] = [];
  isLoading: boolean = false;
  createRoute: string = Routes.empleados.create();

  constructor(
    private apiPersonal:ApiPersonalService,
    private storageService: StorageService<PersonalModel>,
    private router: Router,
    public dialog: MatDialog){

  }

  columnConfigs: { [key: string]: ColumnConfig } = {
    idPersonalRef: { displayName: 'ID Personal', type: 'default', showFilter: true, visible: true  },
    noNomina: { displayName: 'No. Nomina', type: 'default', showFilter: true, visible: true  },
    nombreCompleto:{ displayName: 'Nombre', type: 'default', showFilter: true, visible: true  },
    sucursal: { displayName: 'Sucursal' , type: 'default', showFilter: true, visible: true  },
    categoria: { displayName: 'Categoria' , type: 'default', showFilter: true, visible: true  },
    departamento: { displayName: 'Departamento' , type: 'default', showFilter: true, visible: true  },
    estatus: { displayName: 'Estatus' , type: 'default', showFilter: true, visible: true  },
    // email: { displayName: 'email', type: 'number', showFilter: true, visible: true  },
    //activo: { displayName: 'Estatus', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', visible: true },
    fechaModificacion: { displayName: 'Modificado', type: 'date-time', format: 'dd/MMM/yyyy HH:mm', showFilter: true,  visible: true },
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
    this.storageService.init('menuActual');
    // console.log(this.createRoute);
    this.retriveData();
  }

  retriveData(){
    this.isLoading = true;
    this.apiPersonal.obtenerPersonal().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
        this.isLoading = false;
        console.log('response empleados',response);
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
        this.isLoading = false;
      }
    );
  }


  cambiarEstado(item:any){

    // item.activo = !item.activo;
    // this.apiDataAccess.actualizarDatos(item).subscribe(
    //   () => {
    //     this.triggerAlert(`Proveedor de diesel ${ item.activo ? 'activado' : 'desactivado'} exitosamente!`, 'success');
    //   },
    //   error => {
    //     console.log(error);
    //     this.triggerAlert('Error al cambiar el estado de Proveedor de diesel', 'danger');
    //   }
    // );
  }

  filtrarActivos(clave: boolean) {
    if (!clave) {
      this.datosFiltrados = this.datos;
    } else {

      this.datosFiltrados = this.datosFiltrados.filter(ruta => {
        return ruta.activo;
      });
    }
  }

  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Empleado',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudEmpleadoComponent, {
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
      TITULO_MODAL: 'Empleado',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudEmpleadoComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Empleado',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudEmpleadoComponent, {
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
