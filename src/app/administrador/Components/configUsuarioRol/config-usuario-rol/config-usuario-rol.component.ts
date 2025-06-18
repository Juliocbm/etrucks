import { Component } from '@angular/core';
import { Usuario } from './../../../../models/Administrador/Usuario';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from './../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { StorageService } from '../../../../Services/StorageService';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfigUsuarioRolComponent } from '../modal-config-usuario-rol/modal-config-usuario-rol.component';
import { finalize, tap } from 'rxjs';
import { ModalService } from '../../../../Services/Modal.service';


@Component({
  selector: 'app-config-usuario-rol',
  templateUrl: './config-usuario-rol.component.html',
  styleUrls: ['./config-usuario-rol.component.css'],
})
export class ConfigUsuarioRolComponent {
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Usuario[] = [];
  datos: Usuario[] = [];
  NOMBRE_PANTALLA: string = 'Asignar rol';


  constructor(
    private apiAdminAccess: ApiAdministradorService,
    private storageService: StorageService<Usuario>,
    public dialog: MatDialog,
    private modalService: ModalService
  ) {
  
  }

  columnConfigs: { [key: string]: ColumnConfig } = {
    usuario1: {
      displayName: 'Usuario',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    nombres: {
      displayName: 'Nombres',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    apellidoPat: {
      displayName: 'Apellido paterno',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    apellidoMat: {
      displayName: 'Apellido materno',
      type: 'default',
      visible: true,
    },
  };

  tableActions: TableAction[] = [
    {
      name: 'Configurar roles',
      title: 'Configurar roles',
      icon: 'settings',
      tooltip: 'Configurar roles',
      callback: (item) => this.onEditClick(item),
    },
  ];

  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5,
  };

  ngOnInit() {
    this.storageService.init('usuarioActual');
    this.retriveData();
  }

  retriveData = () => {
    // this.apiAdminAccess
    //   .obtenerUsuariosV2()
    //   .pipe(
    //     tap((usuarios) => {
    //       this.datos = usuarios;
    //       this.datosFiltrados = this.datos;
    //     }),
    //     finalize(() => {
         
    //     })
    //   )
    //   .subscribe();
  };

  onEditClick(rowData: any) {
    this.storageService.changeItem(rowData);

    this.modalService.openModal(
      ModalConfigUsuarioRolComponent,
      rowData,
      'EDIT',
      this.retriveData,
      this.NOMBRE_PANTALLA
    );
  }

  cambiarEstado(item: any) {}
}
