import { Component } from '@angular/core';
import { Menu } from 'src/app/models/Administrador/Menu';
import { ApiComedorService } from 'src/app/DataAccess/Comedor/api-comedor.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from '../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from '../../../../shared-module/Interfaces/TableConfig';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Routes } from '../../../../app-routes.constants';
import { ModalCrudMenuComponent } from '../modal-crud-menu/modal-crud-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/Services/StorageService';
import { MenuComedorModel } from 'src/app/models/RH/Comedor/Menu';


@Component({
  selector: 'app-catalogo-menu',
  templateUrl: './catalogo-menu.component.html',
  styleUrls: ['./catalogo-menu.component.css']
})
export class CatalogoMenuComponent {

  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: MenuComedorModel[] = [];
  datos: MenuComedorModel[] = [];
  isLoading: boolean = false;
  createRoute: string = Routes.menuComedor.create();

  constructor(
    private apiComedor:ApiComedorService,
    private storageService: StorageService<MenuComedorModel>,
    private router: Router,
    public dialog: MatDialog){

  }

  columnConfigs: { [key: string]: ColumnConfig } = {
    descripcion: { displayName: 'Descripcion', type: 'default', showFilter: true, visible: true  },
    precio:{ displayName: 'Precio', type: 'default', showFilter: true, visible: true  },
    porcentajeSubsidio: { displayName: 'Subsidio' , type: 'default', showFilter: true, visible: true  },
    sucursal: { displayName: 'Sucursal', type: 'default', visible: true },
    // email: { displayName: 'email', type: 'number', showFilter: true, visible: true  },
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
    this.storageService.init('menuActual');
    console.log(this.createRoute);

    this.retriveData();
  }

  retriveData(){

    this.apiComedor.obtenerMenu().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
        this.isLoading = false;
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


  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Platillo',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudMenuComponent, {
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
      TITULO_MODAL: 'Platillo',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudMenuComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Platillo',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudMenuComponent, {
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
