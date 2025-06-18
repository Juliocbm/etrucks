import { Component, ViewChild } from '@angular/core';
import { RolModulos } from './../../../../models/Administrador/Menu';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from './../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { StorageService } from '../../../../Services/StorageService';
import { ModalCrudRolPermisoComponent } from '../modal-crud-rol-permiso/modal-crud-rol-permiso.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../../../Services/Modal.service';
import { finalize, tap, map } from 'rxjs';
import { AlertService, Alert } from '../../../../Services/alerts.service';
import { FullTableV2Component } from '../../../../shared-module/components/full-tableV2/full-table.component';

@Component({
  selector: 'app-rol-permiso-view',
  templateUrl: './rol-permiso-view.component.html',
  styleUrls: ['./rol-permiso-view.component.css']
})
export class RolPermisoViewComponent {
 showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: RolModulos[] = [];
  datos: RolModulos[] = [];
  isLoading: boolean = false;
  observableRoles;
  @ViewChild(FullTableV2Component) tableComponent!: FullTableV2Component;
  NOMBRE_PANTALLA:string = 'Permisos de rol';

  constructor(
    private apiAdminAccess: ApiAdministradorService,
    private storageService: StorageService<RolModulos>,
    public dialog: MatDialog,
    private modalService: ModalService,
    private alertService: AlertService
  ) {
    this.observableRoles = this.apiAdminAccess.obtenerRoles.bind(this.apiAdminAccess);
  }

  columnConfigs: { [key: string]: ColumnConfig } = {
    idRol: {
      displayName: 'Id', 
      type: 'number', 
      showFilter: true, 
      visible: true,
      char: 'Id', 
    },
    nombre: {
      displayName: 'Nombre rol',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    descripcion: {
      displayName: 'Descipción',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    activo: {
      displayName: 'Estatus',
      type: 'boolean',
      trueValue: 'Activo',
      falseValue: 'Inactivo',
      visible: true,
    },
    fechaModificacion: {
      displayName: 'Modificado',
      type: 'date',
      format: 'dd/MMM/yyyy',
      showFilter: true,
      startDate: null,
      endDate: null,
      visible: true,
      widthColumn: '120px'
    },
    usuarioModificadoPor: {
      displayName: 'Modificado por',
      type: 'default',
      showFilter: true,
      visible: true,
      widthColumn: '120px'
    },
  };

  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver',
      callback: (item) => this.obtenerRolPorId(item, 0),
    },
    {
      name: 'edit',
      title: 'Configurar',
      icon: 'settings',
      tooltip: 'Configurar',
      callback: (item) => this.obtenerRolPorId(item, 1),
      showCondition: (item) => item.activo,
    }
  ];

  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5
  };

  ngOnInit() {
    this.storageService.init('rolActual');
  }

  retriveData = () => {
    this.tableComponent.loadData();
  };

  onDetailClick(rowData: any)  {
    this.modalService.openModal(
      ModalCrudRolPermisoComponent,
      rowData,
      'DETAIL',
      () => this.tableComponent.loadData(),
      this.NOMBRE_PANTALLA,
      '1000px',
      '800px'
    );
  }

  onEditClick(rowData: any) {
    this.modalService.openModal(
      ModalCrudRolPermisoComponent,
      rowData,
      'EDIT',
      () => this.tableComponent.loadData(),
      this.NOMBRE_PANTALLA,
      '1000px',
      '800px'
    );
  }

  obtenerRolPorId(rowData: any, accion: number) {
    this.apiAdminAccess
      .obtenerRolById(rowData.idRol)
      .pipe(
        tap((response) => {
          if (accion == 0) this.onDetailClick(response);
          else this.onEditClick(response);
        }),
        finalize(() => {})
      )
      .subscribe();
  }

}
