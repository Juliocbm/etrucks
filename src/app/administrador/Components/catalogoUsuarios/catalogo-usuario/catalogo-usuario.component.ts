import { Component } from '@angular/core';
import { Usuario } from './../../../../models/Administrador/Usuario';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from './../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Routes } from '../../../../app-routes.constants';
import { ModalCrudUsuarioComponent } from '../modal-crud-usuario/modal-crud-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/Services/StorageService';
import { map,tap, finalize } from 'rxjs/operators';
import { AlertService, Alert } from '../../../../Services/alerts.service';
import { AuthService } from '../../../../security/services/auth.service';
@Component({
  selector: 'app-catalogo-usuario',
  templateUrl: './catalogo-usuario.component.html',
  styleUrls: ['./catalogo-usuario.component.css']
})
export class CatalogoUsuarioComponent {

  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Usuario[] = [];
  datos: Usuario[] = [];
  isLoading: boolean = false;
  createRoute: string = Routes.usuarios.create();
  observableUsuarios;
  MENU_ACTUAL: any;

  constructor(
    private apiAdminAccess:ApiAdministradorService,
    private storageService: StorageService<Usuario>,
    private router: Router,
    public dialog: MatDialog,
    private alertService: AlertService,
    private authService: AuthService,
  ){
     this.observableUsuarios = this.apiAdminAccess.obtenerUsuariosV2.bind(this.apiAdminAccess);
    this.MENU_ACTUAL = this.authService.getMenuByCveMenu('USUARIOS');
  }

  columnConfigs: { [key: string]: ColumnConfig } = {
    usuario1: { displayName: 'Usuario', type: 'default', showFilter: true, visible: true  },
    nombres:{ displayName: 'Nombres', type: 'default', showFilter: true, visible: true  },
    apellidoPat: { displayName: 'Apellido paterno' , type: 'default', showFilter: true, visible: true  },
    apellidoMat: { displayName: 'Apellido materno', type: 'default', visible: true },
    activo: { displayName: 'Estatus', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', visible: true },
    fechaModificacion: { displayName: 'Modificado', type: 'date', showFilter: true, startDate: null, endDate: null, visible: true },
    usuarioModificadoPor: { displayName: 'Modificado por', type: 'default', showFilter: true, visible: true }
  };

  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.UsuarioPorId(item, 0)
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Editar',
      callback: (item) => this.UsuarioPorId(item, 1),
      showCondition: (item) => item.activo,
    },
    {
      name: 'eliminar',
      title: 'Eliminar',
      icon: 'delete',
      tooltip: 'Eliminar',
      callback: (item) => this.onEliminarClick(item),
      showCondition: (item) => item.activo,
      permission: 'Eliminar',
    }
  ];

  tableConfigs: TableConfig =
    {
      pageSizeOptions: [5, 15, 30],
      headerColumFontSize: 10,
      createCallback: () => this.onCreateClick()
    };


  ngOnInit(){
    this.storageService.init('usuarioActual');
    console.log(this.createRoute);

    this.retriveData();
  }

  retriveData(){

    this.apiAdminAccess.obtenerUsarios().subscribe(
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


  onEliminarClick(rowData: any) {
    this.alertService
      .question('¿Eliminar registro de usuario: ' + rowData.usuario1 + '?')
      .pipe(
        map((isConfirmed) => {
          if (isConfirmed) {
            //Llama al método del servicio para actualizar
            this.isLoading = true; // Muestra el indicador de carga

            const dataForm = rowData as Usuario; //convertimos el formulario a el tipo de dato necesario

            dataForm.activo = false;
            // Llama al método del servicio para actualizar
            this.apiAdminAccess
              .deleteUsuario(dataForm.id)
              .pipe(
                tap((data) => {
                  this.alertService.success('default.success.eliminado');
                  this.retriveData();
                }),
                finalize(() => {
                  this.isLoading = false;
                })
              )
              .subscribe();
          } else {
            this.alertService.warning('default.warning.cancelar');
          }
        })
      )
      .subscribe();
  }


  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Roles',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudUsuarioComponent, {
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
      TITULO_MODAL: 'Usuarios',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudUsuarioComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Usuarios',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudUsuarioComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  UsuarioPorId(rowData: any, accion: number) {
    const idUsuario = rowData.id;

    this.apiAdminAccess
      .obtenerUsuarioById(idUsuario)
      .pipe(
        tap((response) => {
          if (accion == 0) this.onDetailClick(response.item);
          else this.onEditClick(response.item);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

}
