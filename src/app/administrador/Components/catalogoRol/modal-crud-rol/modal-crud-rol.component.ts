import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Menu,
  Modulo,
  RolModulos,
  MenuDTO
} from './../../../../models/Administrador/Menu';
import {
  Rol,
  RolPermiso
} from './../../../../models/Administrador/Rol';
import { StorageService } from '../../../../Services/StorageService';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { finalize, tap, catchError, of } from 'rxjs';
import { AlertService, Alert } from '../../../../Services/alerts.service';
import { DisplayColumnConfigDF } from '../../../../shared-module/Interfaces/DisplayColumnConfigDF';
import {
  ParametrosMenu
} from '../../../../shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-modal-crud-rol',
  templateUrl: './modal-crud-rol.component.html',
  styleUrls: ['./modal-crud-rol.component.css'],
})
export class ModalCrudRolComponent {
  formulario: FormGroup = new FormGroup({});
  rol: Rol = new Rol();
  modulos: Menu[] = [];
  pantallas: MenuDTO[] = [];
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  showAlert = false;
  idCompania: number = 0;
  idUsuario: string = '';
  moduloSelect: Modulo = new Modulo();
  rolModulos: RolModulos = new RolModulos();
  check: boolean = false;
  registros: any[] = []; // Tu arreglo de datos
  registrosPorPagina: number = 10; // Número de registros por página
  paginaActual: number = 1; // Página actual
  nomModulo: string = '';
  modulosSelect: Modulo[] = [];
  alertMessage: Alert | null = null; // Variable para almacenar la alerta
  alert: string = '';
  alertType: string = '';
  rolPermisoSelect: RolPermiso[] = [];
  asignarModulo: boolean = false;
  sistemas: any[] = []; // Para almacenar los sistemas cargados

  ParametrosMenu = ParametrosMenu;

  constructor(
    private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudRolComponent>,
    private storageService: StorageService<RolModulos>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiAdminAccess: ApiAdministradorService,
    private apiHandler: ApiServiceHandler,
    private alertService: AlertService
  ) {
    // Suscribirse a las alertas emitidas por el servicio
    this.alertService.alert$.subscribe((alert: Alert) => {
      this.alert = alert.message;
    });

    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
    this.idUsuario = localStorage.getItem('idUsuario') || '';
  }

  columnConfigsMenu: { [key: string]: ColumnConfig } = {
    id: {
      displayName: 'Id',
      type: 'default',
      showFilter: true,
      visible: false,
    },
    nombre: {
      displayName: 'Nombre',
      type: 'default',
      showFilter: true,
      visible: true,
      customRender: (rowData) => `${rowData.nombre} `,
    },
  };

  displayColumnConfMenu: DisplayColumnConfigDF = {
    identificador: 'id',
    separadorColumnas: ' - ',
    columnas: ['nombre'],
  };

  tableConfigs: TableConfig = {
    pageSizeOptions: [2, 5, 10, 15, 20],
    headerColumFontSize: 5,
    heightRow: 'auto',
  };

  tableConfigsPantallas: TableConfig = {
    pageSizeOptions: [5],
    headerColumFontSize: 5,
    heightRow: 'auto',
  };

  columnConfigsRol: { [key: string]: ColumnConfig } = {

    idPadre: {
      displayName: 'Id',
      type: 'default',
      visible: false,
      showFilter: false,
    },
    nombre: {
      displayName: 'Nombre',
      type: 'default',
      visible: true,
      showFilter: true,
      disabledInput: true,
      widthColumn: '20%',
      functionEvent: (event, permiso) =>
        this.fncSelectPermisoMenu(event, permiso),
    },
    permisos: {
      displayName: 'Permisos',
      type: 'collapse',
      visible: true,
      showFilter: false,
      subArrayCollapse: 'permisos',
      nomSubItemCollapse: 'permiso',
      valueSubItemCollapse: 'asignado',
      isOpenCollapse: true,
      disabledInput: false,
      functionEvent: (event, permiso) =>
        this.fncSelectPermisoMenu(event, permiso),
    },
    asignar: {
      displayName: 'Todos',
      type: 'boolean',
      editable: true,
      visible: true,
      showFilter: false,
      event: true,
      disabledInput: true,
      widthColumn: '10%',
      functionEvent: (event) => this.fncTodosPermisos(event),
    }
  };

  columnConfigsRolDetail: { [key: string]: ColumnConfig } = {
    idPadre: {
      displayName: 'Id',
      type: 'default',
      visible: false,
      showFilter: false,
    },
    nombre: {
      displayName: 'Nombre de pantalla',
      type: 'default',
      visible: true,
      showFilter: true,
      disabledInput: true,
      functionEvent: (event, permiso) =>
        this.fncSelectPermisoMenu(event, permiso),
    },
    permisos: {
      displayName: 'Permisos',
      type: 'collapse',
      visible: true,
      showFilter: true,
      subArrayCollapse: 'permisos',
      nomSubItemCollapse: 'permiso',
      valueSubItemCollapse: 'asignado',
      isOpenCollapse: true,
      disabledInput: true,
      functionEvent: (event, permiso) =>
        this.fncSelectPermisoMenu(event, permiso),
    },
    asignar: {
      displayName: 'Todos los permisos',
      type: 'boolean',
      editable: true,
      visible: true,
      showFilter: false,
      event: true,
      disabledInput: true,
      functionEvent: (event) => this.fncTodosPermisos(event),
    },
  };

  ngOnInit() {
    this.initializeRequiredData();
    this.cargarSistemas();
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.rol = restOfData;

    console.log('initializeRequiredData', this.rol);

    if (this.TIPO_MODAL == 'CREATE') {
      this.rol = new Rol();
      this.IS_EDITABLE = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
      this.rolPermisoSelect = this.rol.rolPermisos;
    } else {
      this.IS_EDITABLE = false;
      this.rolPermisoSelect = this.rol.rolPermisos;
    }

    this.formulario = this.fb.group({
      id: [this.rol.id],
      nombre: [this.rol.nombre, [Validators.required]],
      descripcion: [this.rol.descripcion, [Validators.required]],
      modulo: [''],
      activo: [true],
      fechaCreacion: [this.rol.fechaCreacion],
      fechaModificacion: [this.rol.fechaModificacion],
      creadoPor: [this.rol.creadoPor],
      modificadoPor: [this.rol.modificadoPor],
      usuarioCreadoPor: [this.rol.usuarioCreadoPor],
      usuarioModificadoPor: [this.rol.usuarioModificadoPor],
      idSistema: [this.rol.idSistema, [Validators.required]],
      idCompania: [this.rol.idCompania],
    });
    

   
  }

  cargarPantallas(event: any) {
    this.asignarModulo = false;
    this.moduloSelect = event;
    console.log('MODULO SELECT', this.moduloSelect);
    this.apiHandler
      .getDatosAsync(() => this.apiAdminAccess.MenuPorIdPadre(event.id), 'menu')
      .subscribe((menu) => {

        console.log('cargarPantallas', menu);
        if (menu.length == 0) return false;

        this.nomModulo = this.moduloSelect.nombre;
        this.pantallas = [...menu];

        const pantallasAsignadas = this.pantallas.filter((p) =>
          this.rolPermisoSelect.some((rp) => rp.idMenu === p.id)
        );

        pantallasAsignadas.forEach((pantalla) => {
          pantalla.permisos.forEach((permiso) => {
            if (
              this.rolPermisoSelect.some(
                (rp) =>
                  rp.idPermiso === permiso.idPermiso &&
                  rp.idMenu === pantalla.id
              )
            ) {
              permiso.asignado = true;
            }
          });

          const allAssigned = pantalla.permisos.every(
            (permiso) => permiso.asignado === true
          );
          pantalla.asignar = allAssigned;
        });

        this.asignarModulo = this.pantallas.every(
          (pantalla) => pantalla.asignar === true
        );
        return;
      });
  }

  fncAsignarModulo(event: any) {
    this.asignarModulo = event.checked;

    const pantallasmodulo = this.pantallas.filter((p) => p.idPadre === this.moduloSelect.id);
 
    pantallasmodulo.forEach((pantalla) => {
      pantalla.asignar = this.asignarModulo;
      pantalla.permisos.forEach((permiso) => {
        permiso.asignado = this.asignarModulo;
        this.fncValidaAgregarPermiso(this.asignarModulo, permiso);
      });

    });

    // Agregar o eliminar el permiso base del módulo
    this.manejarPermisoBaseModulo(this.moduloSelect, this.asignarModulo);
  }

  fncSelectPermisoMenu(event: any, permiso: any) {
    // Asegurar que el permiso tenga la propiedad idPadre
    if (!permiso.idPadre && this.moduloSelect) {
      permiso.idPadre = this.moduloSelect.id;
    }

    permiso.asignado = event.checked;
    this.fncValidaAgregarPermiso(event.checked, permiso);

    let pantalla = this.pantallas.find((p) => p.id === permiso.idMenu);
    if (pantalla == null) return;

    const allAssigned = pantalla?.permisos.every(
      (permiso) => permiso.asignado === true
    );
    pantalla.asignar = allAssigned ?? false;

    // Agregar o eliminar el permiso base del módulo
    this.manejarPermisoBaseModulo(this.moduloSelect, event.checked);
  }

  fncValidaAgregarPermiso(asignar: boolean, permiso: any) {
    if (asignar) {
      const permisoExistente = this.rolPermisoSelect.find(
        (p) => p.idMenu === permiso.idMenu && p.idPermiso === permiso.idPermiso
      );

      if (permisoExistente != null) return;

      let rolPermiso = new RolPermiso();
      rolPermiso.idPadre = permiso.idPadre || this.moduloSelect?.id;
      rolPermiso.idMenu = permiso.idMenu;
      rolPermiso.idPermiso = permiso.idPermiso;
      rolPermiso.idRol = this.rol.id;
      rolPermiso.activo = true;
      rolPermiso.creadoPor = this.idUsuario;
      rolPermiso.modificadoPor = this.idUsuario;
      rolPermiso.fechaCreacion = new Date();
      rolPermiso.fechaModificacion = new Date();
      this.rolPermisoSelect.push(rolPermiso);
    } else {
      const permisoExistente = this.rolPermisoSelect.find(
        (item) => item.idMenu === permiso.idMenu && item.idPermiso === permiso.idPermiso
      );

      if(permisoExistente != null){
        const indexPercep = this.rolPermisoSelect.indexOf(permisoExistente);
        if (indexPercep > -1) {
          this.rolPermisoSelect.splice(indexPercep, 1);
        }
      }
    }
  }

  fncTodosPermisos(pantalla: any) {
    pantalla.permisos.forEach((permiso: any) => {
      permiso.asignado = pantalla.asignar;
      this.fncValidaAgregarPermiso(pantalla.asignar, permiso);
    });
  }

  onSubmit() {
    if (!this.validaFormulario()) {
      return;
    }

    const dataForm = this.formulario.value as Rol; //convertimos el formulario a el tipo de dato necesario
    dataForm.rolPermisos = this.rolPermisoSelect;

    console.log('ROL PERMISOS', dataForm);
     if (this.TIPO_MODAL == 'EDIT' || this.TIPO_MODAL == 'DETAIL') {
        // Llama al método del servicio para actualizar
        this.apiAdminAccess
          .putRol(dataForm)
          .pipe(
            tap((data) => {}),
            finalize(() => {})
          )
          .subscribe();
      } else {
        // Llama al método del servicio para crear
        this.apiAdminAccess
          .postRol(dataForm)
          .pipe(
            tap((data) => {
              // this.initializeRequiredData(); //resetea campos de formulario
            }),
            finalize(() => {})
          )
          .subscribe();
      }  
    return;
  }

  validaFormulario(): boolean {
    if (!this.formulario.valid) {
      this.formulario.markAllAsTouched();
      this.alertService.error('default.formulario.error.invalido');
      return false;
    }

    if (this.rolPermisoSelect.length == 0) {
      this.alertService.error('administrador.catalogos.roles.error.permisos');
      return false;
    }

    return true;
  }

  cerrarModal() {
    this.modal.close();
  }

  // Método para cargar sistemas desde la API
  cargarSistemas() {
    this.apiAdminAccess.obtenerSistemas()
      .pipe(
        tap((data) => {
          this.sistemas = data || [];
        }),
        catchError((error) => {
          this.alertService.error('Error al cargar sistemas');
          return of([]);
        })
      )
      .subscribe();
  }

  // Nueva función para manejar el permiso base del módulo
  private manejarPermisoBaseModulo(pantalla: any, asignar: boolean) {
    const permisoBase: RolPermiso = {
      idPadre: pantalla.idPadre,
      idMenu: pantalla.id,
      idPermiso: 1,
      idRol: this.rol.id,
      idRolPermiso: 0, // Valor por defecto para nuevos permisos
      activo: true,
      creadoPor: this.idUsuario,
      modificadoPor: this.idUsuario,
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    };


      // Verificar si ya existe el permiso base
      const permisoHijo = this.rolPermisoSelect.find(
        (p) => p.idPadre === pantalla.id 
      );

      // Verificar si ya existe el permiso base
      const moduloExistente = this.rolPermisoSelect.find(
        (p) => p.idMenu === pantalla.id 
      );

      if (permisoHijo && !moduloExistente) {
        this.rolPermisoSelect.push(permisoBase);
      } else {
        const index = this.rolPermisoSelect.findIndex(
          (p) => p.idMenu === pantalla.id && p.idPermiso === 1
        );
        if (index > -1) {
          this.rolPermisoSelect.splice(index, 1);
        }
      }

      
   /*  } else {
      // Eliminar el permiso base si existe
      const index = this.rolPermisoSelect.findIndex(
        (p) => p.idMenu === pantalla.id && p.idPermiso === 1
      );
      if (index > -1) {
        this.rolPermisoSelect.splice(index, 1);
      }
    } */
  }

  // Nueva función para manejar el permiso base de la pantalla
  private manejarPermisoBasePantalla(pantalla: any, asignar: boolean) {
    const permisoBase: RolPermiso = {
      idPadre: pantalla.idPadre,
      idMenu: pantalla.id,
      idPermiso: 1,
      idRol: this.rol.id,
      idRolPermiso: 0, // Valor por defecto para nuevos permisos
      activo: true,
      creadoPor: this.idUsuario,
      modificadoPor: this.idUsuario,
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    };

    if (asignar) {
      // Verificar si ya existe el permiso base
      const permisoExistente = this.rolPermisoSelect.find(
        (p) => p.idMenu === pantalla.id && p.idPermiso === 1
      );

      if (!permisoExistente) {
        this.rolPermisoSelect.push(permisoBase);
      }
    } else {
      // Verificar si hay otros permisos asignados
      const otrosPermisosAsignados = pantalla.permisos.some(
        (p: any) => p.asignado && p.idPermiso !== 1
      );

      // Si no hay otros permisos asignados, eliminar el permiso base
      if (!otrosPermisosAsignados) {
        const index = this.rolPermisoSelect.findIndex(
          (p) => p.idMenu === pantalla.id && p.idPermiso === 1
        );
        if (index > -1) {
          this.rolPermisoSelect.splice(index, 1);
        }
      }
    }
  }
}
