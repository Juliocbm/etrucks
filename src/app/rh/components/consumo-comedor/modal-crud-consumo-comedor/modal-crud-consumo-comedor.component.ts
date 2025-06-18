import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { ApiComedorService } from 'src/app/DataAccess/Comedor/api-comedor.service';
import { ApiPersonalService } from 'src/app/DataAccess/HgTools/api-personal.service';
import { VwConsumoModel } from 'src/app/models/RH/Comedor/consumo';
import { Sucursal } from 'src/app/models/RH/sucursal';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { getDisplayColumnConfig } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { NotificacionService } from 'src/app/shared-module/services/notificacion.service';
import {
  ParametrosDropdownComidaMenu,
  ParametrosDropdownEmpleado,
  ParametrosDropdownSucursales,
} from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-modal-crud-consumo-comedor',
  templateUrl: './modal-crud-consumo-comedor.component.html',
  styleUrls: ['./modal-crud-consumo-comedor.component.css'],
})
export class ModalCrudConsumoComedorComponent implements OnInit {
  // Configuraciones generales del modal
  TITULO_MODAL = 'Registro de Consumos';
  TIPO_MODAL = '';
  IS_EDITABLE = false;
  isCreate = false;
  isLoading = false;

  // Variables del formulario
  consumoComedorForm!: FormGroup;
  consumoComedor!: VwConsumoModel;
  public sucursal: Sucursal[] = [];
  obtenerPersonal: any = [];
  esEmpleado: boolean = false;

  // Alertas
  alertType = '';
  alertMessage = '';
  showAlert = false;

  // Identificadores
  idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');
  usuario: string = localStorage.getItem('usuario') || '';
  idUsuario: string = localStorage.getItem('idUsuario') || '';

  // Parametros Generales
  selectEstatusConsumo: any = {};
  selectedComidaMenu: any = {};
  sucursalSelected: any = {};
  personalSelected: any = {};

  // Configuraciones de dropdown para Sucursales
  public parametrosSucursales = ParametrosDropdownSucursales;
  columnConfigSucursales = this.getColumnConfigSucursales();
  displayColumnConfigSucursales = getDisplayColumnConfig('idSucursal', [
    'nombre',
  ]);
  tableConfigSucursales: { [key: string]: any } = this.getTableConfig(
    this.columnConfigSucursales,
    this.displayColumnConfigSucursales
  );
  onSeleccionaSucursal(sucursal: any) {
    const selectElement = event?.target as HTMLSelectElement;

    this.sucursalSelected = sucursal;
    this.consumoComedorForm.patchValue({
      idSucursal: sucursal.idSucursal,
    });
  }

  // Configuraciones de dropdown para Menus
  parametrosMenus = ParametrosDropdownComidaMenu;
  columnConfigMenus = this.getColumnConfigMenus();
  displayColumnConfigMenus = getDisplayColumnConfig('idMenu', ['comidaMenu']);
  tableConfigMenus: { [key: string]: any } = this.getTableConfig(
    this.columnConfigMenus,
    this.displayColumnConfigMenus
  );
  onSeleccionaMenu(menu: any) {
    const selectElement = event?.target as HTMLSelectElement;

    this.selectedComidaMenu = menu;
    this.consumoComedorForm.patchValue({
      idMenu: menu.idMenu,
    });
  }

  // Configuraciones de dropdown para Personal

  columnPersonalConfigs: { [key: string]: ColumnConfig } = {
    idPersonal: {
      displayName: 'Id',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    nombreCompleto: {
      displayName: 'Personal',
      type: 'default',
      showFilter: true,
      visible: true,
    },
  };

  displayColPersonal = getDisplayColumnConfig('idPersonal', ['nombreCompleto']);

  parametrosPersonal = ParametrosDropdownEmpleado;

  tablieConfigPersonal: { [key: string]: any } = {
    tableConfig: {
      columns: this.columnPersonalConfigs,
      displayColumnConfig: this.displayColPersonal,
      paginator: true,
      sort: true,
      filter: true,
      selection: true,
      selectionMode: 'single',
    },
  };
  onSeleccionaPersonal(personal: any) {
    const selectElement = event?.target as HTMLSelectElement;

    this.personalSelected = personal;
    this.consumoComedorForm.patchValue({
      idPersonal: personal.idPersonal,
    });
  }

  constructor(
    private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudConsumoComedorComponent>,
    private storageService: StorageService<VwConsumoModel>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    public apiOperacionesService: ApiOperacionesService,
    public apiRecursosHumanos: ApiRecursosHumanosService,
    public apiPersonal: ApiPersonalService,
    private notificacionService: NotificacionService,
    public apiComedor: ApiComedorService
  ) {}

  ngOnInit(): void {
    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.TIPO_MODAL = TIPO_MODAL;
    this.TITULO_MODAL = TITULO_MODAL;

    this.consumoComedor = restOfData;
    console.log('consumoComedor', this.consumoComedor);

    if (this.TIPO_MODAL == 'CREATE') {
      this.consumoComedor = new VwConsumoModel();
      this.isCreate = true;
      this.IS_EDITABLE = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
      this.setValuesDropdowns();
    } else {
      this.IS_EDITABLE = false;
      this.setValuesDropdowns();
    }

    this.initializeForm();
    this.getInfo();
  }

  getInfo() {
    forkJoin([
      this.apiHandler.getDatosAsync(
        () => this.apiComedor.obtenerSucursales(1),
        'sucursal'
      ),
      this.apiHandler.getDatosAsync(
        () => this.apiRecursosHumanos.obtenerPersonal(true),
        'personal'
      ),
    ]).subscribe(([sucursal, personal]) => {
      this.sucursal = sucursal;
      this.obtenerPersonal = personal;
    });
  }

  async cambiarModuloSistema(event: any) {
    const idSucursal = event.value;
    const nomSucursal = event.source.triggerValue;
    this.sucursalSelected = this.sucursal.find(
      (s) => s.idSucursal == idSucursal
    );

    console.log('CHANGE SUCURSAL', idSucursal);
  }

  cerrarModal() {
    this.modal.close();
  }

  initializeForm() {
    // Inicializar formulario
    this.consumoComedorForm = this.fb.group({
      idConsumo: [this.consumoComedor.idConsumo],
      idSucursal: [this.consumoComedor.idSucursal],
      nombreSucursal: [this.consumoComedor.nombreSucursal],
      idMenu: [this.consumoComedor.idMenu],
      comidaMenu: [this.consumoComedor.comidaMenu],
      idPersonal: [this.consumoComedor.idPersonal],
      nombrePersonal: [this.consumoComedor.nombrePersonal],
      precio: [this.consumoComedor.precio],
      porcentajeSubsidio: [this.consumoComedor.porcentajeSubsidio],
      fechaIngreso: [this.consumoComedor.fechaIngreso],
      idEstatus: [this.consumoComedor.idEstatus],
      estatusConsumo: [this.consumoComedor.estatusConsumo],
      activo: [this.consumoComedor.activo],
      fechaCreacion: [this.consumoComedor.fechaCreacion],
      creadoPor: [this.consumoComedor.creadoPor],
      usuarioCreadoPor: [this.consumoComedor.usuarioCreadoPor],
      fechaModificacion: [this.consumoComedor.fechaModificacion],
      modificadoPor: [this.consumoComedor.modificadoPor],
      usuarioModificadoPor: [this.consumoComedor.usuarioModificadoPor],
    });
  }

  // Crear o editar un consumo
  async onSubmit() {
    this.isLoading = true;
    const data = this.consumoComedorForm.value;
    console.log('data', data);

    if (this.TIPO_MODAL == 'CREATE') {
      this.apiComedor.postComedorConsumo(data).subscribe(
        (response) => {
          this.isLoading = false;
          this.showAlerts('Consumo creado correctamente', 'success');
          this.modal.close();
        },
        (error) => {
          this.isLoading = false;
          this.showAlerts('Error al crear el consumo', 'error');
        }
      );
    } else {
    }
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;

    if (!isEditable) {
      this.storageService.itemActual.subscribe((itemStorage) => {
        if (itemStorage) {
        }
      });
    }
  }

  /**
   * Establece los valores de los dropdowns.
   */
  private setValuesDropdowns() {
    const dataModal = this.consumoComedor;

    // Sucursal
    this.sucursalSelected = {
      idSucursal: dataModal.idSucursal,
      nombre: dataModal.nombreSucursal,
    };

    // Comida Menu
    this.selectedComidaMenu = {
      idMenu: dataModal.idMenu,
      comidaMenu: dataModal.comidaMenu,
    };

    // Personal
    this.personalSelected = {
      idPersonal: dataModal.idPersonal,
      nombreCompleto: dataModal.nombrePersonal,
    };

    // Integrar en el formulario si es diferente de editar: UsuarioCreadoPor, UsuarioModificadoPor
    // if (this.TIPO_MODAL != 'EDIT') {
    //   this.consumoComedorForm.patchValue({
    //     usuarioCreadoPor: this.consumoComedor.usuarioCreadoPor,
    //     usuarioModificadoPor: this.consumoComedor.usuarioModificadoPor
    //   });
    // }
  }

  /**
   * Muestra una alerta.
   */
  private showAlerts(mensaje: string, tipo: string) {
    this.alertMessage = mensaje;
    this.alertType = tipo;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3000);
  }

  private getTableConfig(columnConfigs: any, displayColumnConfig: any) {
    return {
      tableConfig: {
        columns: columnConfigs,
        displayColumnConfig,
        paginator: true,
        sort: true,
        filter: true,
        selection: true,
        selectionMode: 'single',
      },
    };
  }

  /**
   * Obtiene la configuración de columnas para sucursales.
   */
  private getColumnConfigSucursales() {
    return {
      idSucursal: {
        displayName: 'ID',
        showFilter: true,
        visible: true,
        type: 'string',
      },
      nombre: {
        displayName: 'Nombre',
        showFilter: true,
        visible: true,
        type: 'string',
      },
    };
  }

  /**
   * Obtiene la configuración de columnas para menus.
   */
  private getColumnConfigMenus() {
    return {
      idMenu: {
        displayName: 'ID',
        showFilter: true,
        visible: true,
        type: 'string',
      },
      comidaMenu: {
        displayName: 'Comida',
        showFilter: true,
        visible: true,
        type: 'string',
      },
    };
  }
}
