import { Sistemas } from 'src/app/Interfaces/SistemasItems';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario, UsuarioRol } from './../../../../models/Administrador/Usuario';
import { Compania } from './../../../../models/Administrador/Compania';
import { Rol } from './../../../../models/Administrador/Rol';
import { StorageService } from '../../../../Services/StorageService';
import { ApiAdministradorService } from '../../../../DataAccess/api-administrador.service';
import { DisplayColumnConfigDF } from '../../../../shared-module/Interfaces/DisplayColumnConfigDF';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { TableAction } from './../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { validarDominioCorreoAsync, validarFormatoCorreoAsync } from '../../../../shared-module/validations/validates';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-modal-config-usuario-rol',
  templateUrl: './modal-config-usuario-rol.component.html',
  styleUrls: ['./modal-config-usuario-rol.component.css'],
})
export class ModalConfigUsuarioRolComponent {
  formulario: FormGroup = new FormGroup({});
  usuario: Usuario = new Usuario();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = true;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  isCreate: boolean = false;
  dropdownList: any[] = [];
  companias: any[] = [];
  idUsuario: string = '';
  idCompania = 0;
  dropdownSettings = {};
  rolAsignado: any[] = [];
  rolListado: any[] = [];
  rolListadoOriginal: any[] = [];

  sistemaSelect: Sistemas | undefined = new Sistemas();
  sistemaSelected: Sistemas[] = [];
  public sistemas: Sistemas[] = [];
  nomSistema: string = '';
  idSistema: number = 4;
  idSisTrucks: number = 1;

  columnsConfigured: boolean = false;

  tableConfigsRol: TableConfig = {
    pageSizeOptions: [3],
    headerColumFontSize: 5,
    heightRow: 'auto',
  };

  columnConfigsRol: { [key: string]: ColumnConfig } = {
    idRol: {
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
    },
    sistema: {
      displayName: 'Sistema',
      type: 'default',
      visible: true,
      showFilter: true,
    },
  };

  columnConfigsRolSelect: { [key: string]: ColumnConfig } = {
    idRol: {
      displayName: 'Id',
      type: 'default',
      visible: false,
      showFilter: true,
    },
    nombre: {
      displayName: 'Nombre',
      type: 'default',
      visible: true,
      showFilter: true,
    },
    sistema: {
      displayName: 'Sistema',
      type: 'default',
      visible: true,
      showFilter: true,
    },
  };

  tableActionsCatalogo: TableAction[] = [
    {
      name: 'Asignar',
      title: 'Asignar',
      icon: 'add',
      tooltip: 'Asignar',
      callback: (item) => this.asignarRol(item),
    },
  ];

  tableActionsAsignados: TableAction[] = [
    {
      name: 'Desasignar',
      title: 'Desasignar',
      icon: 'clear',
      tooltip: 'Desasignar',
      callback: (item) => this.desasignarRol(item),
    },
  ];

  constructor(
    private fb: FormBuilder,
    public modal: MatDialogRef<ModalConfigUsuarioRolComponent>,
    private storageService: StorageService<Usuario>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private apiAdminAccess: ApiAdministradorService
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
    this.idCompania = Number(localStorage.getItem('CompaniaSelect')) ?? 0;
  }

  cerrarModal() {
    this.modal.close();
  }

  ngOnInit() {
    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('usuarioActual');
    this.storageService.itemActual.subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        console.log('USUARIO', this.usuario);
      } else {
        console.log('No hay un elemento guardado en session');
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.usuario = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.usuario = new Usuario();
      this.isCreate = true;
      this.IS_EDITABLE = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    this.idSistema = 4;
    let nomColumn = 'permiso';

    this.formulario = this.fb.group({
      id: [this.usuario.id],
      usuario1: [this.usuario.usuario1, [Validators.required]],
      contraseña: [this.usuario.contraseña],
      nombres: [this.usuario.nombres, [Validators.required]],
      apellidoPat: [this.usuario.apellidoPat, [Validators.required]],
      apellidoMat: [this.usuario.apellidoMat, [Validators.required]],
      email: [
        this.usuario.email,
        {
          validators: [Validators.required],
          asyncValidators: [
            validarDominioCorreoAsync(),
            validarFormatoCorreoAsync(),
          ],
          updateOn: 'change', // Ejecuta la validación asincrónica cuando el valor cambia
        },
      ],
      usuarioRols: [this.usuario.usuarioRols],
      companiasSelect: [this.usuario.companiasSelect],
      activo: [this.usuario.activo],
      creadoPor: [this.usuario.creadoPor],
      fechaCreacion: [this.usuario.fechaCreacion],
      fechaModificacion: [this.usuario.fechaModificacion],
      usuarioCreadoPor: [this.usuario.usuarioCreadoPor],
      usuarioModificadoPor: [this.usuario.usuarioModificadoPor],
      idSistema: [this.usuario.idSistema],
    });

    forkJoin([
      this.apiHandler.getDatosAsync(
        () => this.apiAdminAccess.obtenerRol(this.idSistema),
        'roles'
      ),
      this.apiHandler.getDatosAsync(
        this.apiAdminAccess.obtenerCompanias.bind(this.apiAdminAccess),
        'companias'
      ),
      this.apiHandler.getDatosAsync(
        this.apiAdminAccess.obtenerSistemas.bind(this.apiAdminAccess),
        'sistemas'
      ),
    ]).subscribe(([roles, companias, sistemas]) => {

      console.log('ROLES', roles);
      if (sistemas != null) {
        this.sistemas = sistemas.filter(
          (s: any) => s.idSistema != this.idSisTrucks
        );
        this.formulario.get('idSistema')?.setValue(this.idSistema);
      }

      if (companias != null) {
        this.companias = companias;
        this.companias.forEach((c: Compania) => {
          this.agregarColumnConfig(nomColumn + c.nombreClave, {
            displayName: c.nombreClave,
            type: 'boolean',
            editable: true,
            visible: true,
            showFilter: false,
          });
        });
      }

      if (roles != null) {
        const rolesSistema = roles.filter(
          (r: any) => r.idSistema != this.idSisTrucks
        );
        this.rolListado = rolesSistema.map((role: any) => {
          const mappedRole: any = {};
          Object.keys(this.columnConfigsRolSelect).forEach((key) => {
            mappedRole[key] = role.hasOwnProperty(key) ? role[key] : false;
          });
          return mappedRole;
        });

        this.rolListadoOriginal = rolesSistema.map((role: any) => {
          const mappedRole: any = {};
          Object.keys(this.columnConfigsRolSelect).forEach((key) => {
            mappedRole[key] = role.hasOwnProperty(key) ? role[key] : false;
          });
          return mappedRole;
        });

        this.iniCompaniaRol();

        this.isLoading = false;
        this.columnsConfigured = true;
      }
    });
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe((itemStorage) => {
        if (itemStorage) {
          // Resetear los valores del formulario con itemStorage
          this.formulario.reset({
            id: itemStorage.id,
            usuario1: itemStorage.usuario1,
            contraseña: itemStorage.contraseña,
            nombres: itemStorage.nombres,
            apellidoPat: itemStorage.apellidoPat,
            apellidoMat: itemStorage.apellidoMat,
            email: itemStorage.email,
            usuarioRols: itemStorage.usuarioRols,
            companiasSelect: itemStorage.companiasSelect,
            activo: itemStorage.activo,
            creadoPor: itemStorage.creadoPor,
            modificadoPor: itemStorage.modificadoPor,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: new Date(),
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            idSistema: itemStorage.idSistema,
          });
        } else {
          console.log('No hay un permisionario guardado en sesion.');
        }
      });
    }
  }

  asignarRol(data: any, compActual: boolean = true): void {

    console.log('ASIGNAR ROL', data);
    if (compActual) {
      this.asignarCompaniaAct(data);
    }
    const rolAsignado = this.rolAsignado.find((r) => r.idRol == data.idRol);
    if (rolAsignado === undefined) {
    this.rolAsignado = [...this.rolAsignado, data];
    this.rolAsignado = this.ordernarRoles(this.rolAsignado);
    const index = this.rolListado.indexOf(data);
    if (index > -1) {
      this.rolListado.splice(index, 1);
      // Reasignar para detección de cambios en Angular
      this.rolListado = [...this.rolListado];
    }
  }
  }

  desasignarRol(data: any): void {
    // Encuentra el índice del elemento a eliminar
    const index = this.rolAsignado.indexOf(data);
    if (index > -1) {
      this.rolAsignado.splice(index, 1);
      // Reasignar para detección de cambios en Angular
      this.rolAsignado = [...this.rolAsignado];
    }

    // Recorrer las propiedades del objeto data
    for (const key in data) {
      if (data.hasOwnProperty(key) && key !== 'nombre') {
        data[key] = false;
      }
    }

    this.rolListado = [...this.rolListado, data];
    this.rolListado = this.ordernarRoles(this.rolListado);
  }

  async cambiarModuloSistema(event: any) {
    this.idSistema = event.value;
    this.nomSistema = event.source.triggerValue;
    this.sistemaSelect = this.sistemas.find(
      (s) => s.idSistema == this.idSistema
    );

    console.log('CHANGE SISTEMA', this.idSistema);

    this.apiHandler
      .getDatosAsync(
        () => this.apiAdminAccess.obtenerRol(this.idSistema),
        'rolSistema'
      )
      .subscribe((rolSistema) => {
        this.rolListado = rolSistema;
      });
  }

  onSubmit() {

    if (!this.formulario.valid) {
      console.log('formulario no valido');
      this.notificacionService.showNotification(
        'Formulario no valido',
        'error'
      );
      return false;
    }

    if (this.rolAsignado.length <= 0) {
      this.notificacionService.showNotification(
        'Debe seleccionar al menos una rol.',
        'error'
      );
      return false;
    }

    if (!this.validarRolCompania()) {
      this.notificacionService.showNotification(
        'Debe seleccionar al menos una compañia por rol.',
        'error'
      );
      return false;
    }

    const dataForm = this.formulario.value as Usuario;

    console.log('submit: ', dataForm);

    this.isLoading = true; // Muestra el indicador de carga

   if (this.TIPO_MODAL == 'EDIT') {

      // Llama al método del servicio para actualizar
      this.apiAdminAccess.putUsuario(dataForm).subscribe(
        (response) => {
          if (!response.success) {
            this.isLoading = false;
            this.notificacionService.showNotification(response.message, 'warning');
            this.cerrarModal();
          } else {
            this.isLoading = false;
            this.notificacionService.showNotification('Usuario actualizada exitosamente.', 'success');
            this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
          }
        },
        (error) => {
          this.isLoading = false;
          this.notificacionService.showNotification('Error al actualizar Usuario. Por favor, intenta de nuevo más tarde.', 'error');
          console.error('Error al actualizar:', error);
        }
      );
    } else {
      console.log('submit crear: ', dataForm);
      // Llama al método del servicio para crear

      this.apiAdminAccess.postUsuario(dataForm.idSistema ,dataForm).subscribe(
        (response) => {
          if (!response.success) {
            this.isLoading = false;
            this.notificacionService.showNotification(response.message, 'warning');
            this.cerrarModal();
          } else {
            this.isLoading = false;
            this.notificacionService.showNotification('Usuario creada exitosamente.', 'success');
            this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            // this.resetForm(); //resetea campos de formulario
          }
        },
        (error) => {
          console.log('ERROR CREAR', error.error.errors);
          this.isLoading = false;
          this.notificacionService.showNotification('Error al crear Usuario. Por favor, intenta de nuevo más tarde.', 'error');

        }
      );
    } 

    return;
  }

  verificarCamposInvalidos() {
    const camposInvalidos = [];
    const controles = this.formulario.controls;
    for (const nombre in controles) {
      if (controles[nombre].invalid) {
        camposInvalidos.push(nombre);
      }
    }
    console.log('Campos inválidos:', camposInvalidos);
  }

  validarRolCompania(): boolean {
    let isValid = true;
    this.rolAsignado.forEach((rol: any) => {
      let hasValidProperty = false;

      for (const key in rol) {
        if (rol.hasOwnProperty(key) && key !== 'nombre' && rol[key] === true) {
          hasValidProperty = true;
          break;
        }
      }

      if (!hasValidProperty) {
        isValid = false;
      }

      this.companias.forEach((c: Compania) => {
        const rolExists = this.usuario.usuarioRols.find(
          (ur: any) => ur.idRol == rol.idRol && ur.idCompania == c.idCompania
        );
        const nomPropiedad = 'permiso' + c.nombreClave;

        if (rolExists && rol[nomPropiedad] === true) {
          rolExists.activo = true;
          rolExists.modificadoPor = this.idUsuario;
        } else if (rol[nomPropiedad] === true) {
          console.log('AGREGAR ROL', c.idCompania, rol.idRol);
          this.agregaRolCompania(c.idCompania, rol.idRol);
        }
      });
    });

    return isValid;
  }


  iniCompaniaRol() {
    //Mostrar solo compañias activas
    let rol: any;
    let existsAsignado: boolean = true;
    const usRolActivo = this.usuario.usuarioRols.filter((ur) => ur.activo);

    console.log('ROL ACTIVO', usRolActivo);
    usRolActivo.forEach((ur) => {
      existsAsignado = true;
      ur.activo = false;
      rol = this.rolListadoOriginal.find((r) => r.id == ur.idRol);

      if (rol === undefined) {
        rol = this.rolListadoOriginal.find((r) => r.idRol == ur.idRol);
        existsAsignado = false;
      }

      if (rol) {
        const compania = this.companias.find(
          (c) => c.idCompania == ur.idCompania
        );
        if (compania) {
          const nomPropiedad = 'permiso' + compania.nombreClave;
          rol[nomPropiedad] = true;
        }
      }

      if (!existsAsignado) {
        this.asignarRol(rol, false);
      }
    });
  }

  agregaRolCompania(idCompania: number, idRol: number) {
    let rol = new UsuarioRol();
    rol.idUsuario = this.usuario.id;
    rol.idCompania = idCompania;
    rol.idRol = idRol;
    rol.creadoPor = this.idUsuario;
    rol.modificadoPor = this.idUsuario;
    rol.activo = true;
    this.usuario.usuarioRols.push(rol);
  }

  asignarCompaniaAct(data: any) {
    const companiaAct = this.companias.find(
      (c) => c.idCompania == this.idCompania
    );
    if (companiaAct) {
      const nomPropiedad = 'permiso' + companiaAct.nombreClave;
      data[nomPropiedad] = true;
    }
  }

  ordernarRoles(array: any[]): any[] {
    array.sort((a, b) => {
      if (a.nombre < b.nombre) {
        return -1;
      }
      if (a.nombre > b.nombre) {
        return 1;
      }
      return 0;
    });

    return array;
  }

  agregarColumnConfig(key: string, config: ColumnConfig) {
    this.columnConfigsRolSelect[key] = config;
  }
}
