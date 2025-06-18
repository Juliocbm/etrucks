import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Servicios
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { TimeService } from 'src/app/shared-module/services/time.service';

// Modelos
import { Visita, VisitaDTO } from 'src/app/models/Operaciones/Visita';
import { Sucursal } from 'src/app/models/RH/sucursal';
import { Proveedor } from 'src/app/models/Operaciones/Proveedores';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';

// Interfaces
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { DisplayColumnConfigDF, getDisplayColumnConfig } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { StorageService } from 'src/app/Services/StorageService';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { forkJoin, Observable } from 'rxjs';
import { ParametrosDropdownEstatusSolicitud, ParametrosDropdownProveedores, ParametrosDropdownSucursalesVisitas, ParametrosDropdownTipoDocumento } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-modal-crud-vistas',
  templateUrl: './modal-crud-vistas.component.html',
  styleUrls: ['./modal-crud-vistas.component.css']
})
export class ModalCrudVistasComponent implements OnInit {
  // Configuraciones generales del modal
  TITULO_MODAL = 'Registro de Visitas';
  TIPO_MODAL = '';
  IS_EDITABLE = false;
  isCreate = false;
  isLoading = false;

  // Variables del formulario
  visitaForm!: FormGroup;
  visita: VisitaDTO = new VisitaDTO();
  esEmpleado: boolean = false;

  // Alertas
  alertType = '';
  alertMessage = '';
  showAlert = false;

  // Identificadores
  idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');
  usuario: string = localStorage.getItem('usuario') || '';
  idUsuario: string = localStorage.getItem('idUsuario') || '';


  // Configuraciones de dropdowns
  // sucursales: Sucursal[] = [];
  proveedores: Proveedor[] = [];

  // Filtros de dropdowns
  proveedorControl = new FormControl();
  filteredProveedores!: Observable<any[]>;

  // Selecciones de dropdowns
  sucursalSelected: any = {};
  proveedorSelected: any = {};
  tipoVisitaSelected: any = {};
  tipoDocumentoSelected: any = {};
  estatusSolicitudSelected: any = {};

  // Configuraciones de dropdown para Sucursales
  public parametrosSucursales = ParametrosDropdownSucursalesVisitas;
  columnConfigSucursales = this.getColumnConfigSucursales();
  displayColumnConfigSucursales = getDisplayColumnConfig('idSucursal', ['nombre']);
  tableConfigSucursales: { [key: string]: any } = this.getTableConfig(
    this.columnConfigSucursales,
    this.displayColumnConfigSucursales
  );

  // Configuraciones de dropdown para Proveedores
  public parametrosProveedores = ParametrosDropdownProveedores;
  columnConfigProveedores = this.getColumnConfigProveedores();
  displayColumnConfigProveedores = getDisplayColumnConfig('id_proveedor', ['nombre_proveedor']);
  tableConfigProveedores: { [key: string]: any } = this.getTableConfig(
    this.columnConfigProveedores,
    this.displayColumnConfigProveedores
  );

  // Configuraciones de dropdown para Tipo de Documento
  public parametrosTipoDocumento = ParametrosDropdownTipoDocumento;
  columnConfigTipoDocumento = this.getColumnConfigTipoDocumento();
  displayColumnConfigTipoDocumento = getDisplayColumnConfig('id', ['codigo']);
  tableConfigTipoDocumento: { [key: string]: any } = this.getTableConfig(
    this.columnConfigTipoDocumento,
    this.displayColumnConfigTipoDocumento
  );

  // Configuraciones de dropdown para Estatus de Solicitud
  public parametrosEstatusSolicitud = ParametrosDropdownEstatusSolicitud;
  columnConfigEstatusSolicitud = this.getColumnConfigEstatusSolicitud();
  displayColumnConfigEstatusSolicitud = getDisplayColumnConfig('id', ['nombre']);
  tableConfigEstatusSolicitud: { [key: string]: any } = this.getTableConfig(
    this.columnConfigEstatusSolicitud,
    this.displayColumnConfigEstatusSolicitud
  );

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService<Visita>,
    private cdr: ChangeDetectorRef,
    public modal: MatDialogRef<ModalCrudVistasComponent>,
    private timeService: TimeService,
    public apiOperacionesService: ApiOperacionesService,
    public apiRecursosHumanos: ApiRecursosHumanosService,
    private apiHandler: ApiServiceHandler,

    @Inject(MAT_DIALOG_DATA) public data: any,

    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {
    this._locale = 'es-ES';
    this._adapter.setLocale(this._locale);
    this.getInfo();
  }

  ngOnInit(): void {
    this.initializeModal();
  }

  /**
   * Inicializa las configuraciones del modal.
   */
  private async initializeModal() {
    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    console.log('restOfData:', this.data);


    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Registro de Visitas';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';
    this.visita = restOfData || new VisitaDTO();
    this.data.TIPO_MODAL === 'CREATE' ? this.prepareCreateMode() : this.prepareEditOrDetailMode();

  }

  /* Obtiene la informacion necesaria (SUCURSALES) */
  private getInfo(){
    forkJoin([
      this.apiHandler.getDatosAsync(() => this.apiRecursosHumanos.obtenerSucursales() , 'sucursales'),
      // this.apiHandler.getDatosAsync(() => this.apiOperacionesService.getProveedores(this.idCompania), 'proveedores'),
    ]).subscribe(([ sucursal ]) => {
      console.log('sucursal:', sucursal);
      // this.sucursales = sucursal;
      // this.proveedores = proveedor.orderBy('nombre_proveedor');
    });
  }


  /**
 * Prepara el modo de creación.
 */
  private prepareCreateMode() {
    // console.log('prepareCreateMode');
    this.initForm();
    this.isCreate = true;
    this.IS_EDITABLE = true;
    this.visita = new VisitaDTO();
  }

  /**
 * Prepara los modos de edición o detalle.
 */
  private prepareEditOrDetailMode() {
    this.initForm();
    this.IS_EDITABLE = this.TIPO_MODAL === 'EDIT';
    this.setValuesDropdowns();
  }


  /**
   * Inicializa el formulario.
   */
  private initForm() {
    this.visitaForm = this.fb.group({
      id: [this.visita.idVisita || 0],
      esEmpleado: [this.visita.esEmpleado || false],
      idPersonal: [this.visita.idPersonal || null ],
      nombreVisitante: [this.visita.nombreVisitante || '' , Validators.required],
      tipoDocumentoID: [this.visita.tipoDocumentoID || 1, Validators.required],
      documentoIdentidad: [this.visita.documentoIdentidad || '', Validators.required],
      fechaVisita: [ this.timeService.formatDate( this.timeService.applyTimeZoneToDate(this.visita.fechaVisita ? new Date(this.visita.fechaVisita): new Date())), Validators.required],
      sucursalID: [this.visita.sucursalID || 1, Validators.required],
      tipoVisita: [this.visita.tipoVisita || '', Validators.required],
      motivoVisita: [this.visita.motivoVisita || ''],
      referencia: [this.visita.referencia || ''],
      accesoPermitido: [this.visita.accesoPermitido || true],
      horaEntrada: [this.timeService.formatTime(this.visita.horaEntrada ? new Date(this.visita.horaEntrada): new Date()), Validators.required],
      horaSalida: [this.timeService.formatTime(this.visita.horaSalida ? new Date(this.visita.horaSalida): new Date()), Validators.required],
      observaciones: [this.visita.observaciones || ''],
      idProveedor: [this.visita.idProveedor || 0],
      estatusSolicitudId: [this.visita.estatusSolicitudId || 1 ],
      correoDestinatario: [this.visita.correoDestinatario || ''],

      idCompania: [this.visita.idCompania || this.idCompania ],
      activo: [this.visita.activo || true],
      creado: [this.visita.creado || this.timeService.getDateTimeNow() ] ,
      creadoPor: [this.visita.creadoPor || this.idUsuario ],
      modificado: [this.visita.modificado || this.timeService.getDateTimeNow() ],
      modificadoPor: [this.visita.modificadoPor || this.idUsuario ],
    });

    console.log('Visita form:', this.visitaForm.value );

    if (this.TIPO_MODAL !== 'CREATE') {
      this.setValuesDropdowns();
    }
  }


  /**
   * Cambio el formulario a modo edición.
   */
  editableChange(event: boolean) {
    console.log('event:', event);
    this.IS_EDITABLE = Boolean(event);

    if (!this.IS_EDITABLE) {
      this.visitaForm.disable();

      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {
          // this.visitaForm.reset();
          console.log('itemStorage:', itemStorage);
        }
      });
    } else {
      this.visitaForm.enable();
      this.setValuesDropdowns();
    }

  }


  /**
   * Establece los valores de los dropdowns.
   */
  private setValuesDropdowns() {
    // console.log('this.data.DATA', this.visita);
    const dataModal = this.visita;
    console.log('dataModal:', dataModal);

    // Sucursal
    this.sucursalSelected = {
      idSucursal: dataModal.sucursalID,
      nombre: dataModal.nombre
    };

    // Proveedor
    this.proveedorSelected = {
      id_proveedor: dataModal.idProveedor,
      nombre_proveedor: dataModal.proveedor,
    };

    // Tipo de Documento
    this.tipoDocumentoSelected = {
      id: dataModal.tipoDocumentoID,
      codigo: dataModal.tipoDocumento
    };

    // Estatus de Solicitud
    this.estatusSolicitudSelected = {
      id: dataModal.estatusSolicitudId,
      nombre: dataModal.estatusSolicitud
    };

    // Tipo de visita
    this.tipoVisitaSelected = dataModal.tipoVisita;


    this.visitaForm.patchValue({
      ...dataModal,
      // fechaVisita: this.timeService.formatDate( this.timeService.applyTimeZoneToDate(dataModal.fechaVisita || undefined)),
      fechaVisita: this.timeService.formatDate( this.timeService.applyTimeZoneToDate(dataModal.fechaVisita ? new Date(dataModal.fechaVisita) : new Date())),
      horaEntrada: this.timeService.formatTime(dataModal.horaEntrada ? new Date(dataModal.horaEntrada): new Date()),
      horaSalida: this.timeService.formatTime(dataModal.horaSalida ? new Date(dataModal.horaSalida): new Date())
    });

    console.log('Visita form:', this.visitaForm.value );
  }

  /**
   * Manejador del evento de selección de sucursal.
   */
  onSeleccionaSucursal(sucursal: any) {
    const selectElement = event?.target as HTMLSelectElement;

    this.sucursalSelected = sucursal;
    this.visitaForm.patchValue({
      sucursalID: sucursal.idSucursal
    });
  }

  /**
   * Manejador del evento de selección de proveedor.
   */
  onSeleccionaProveedor(proveedor: Proveedor) {
    this.proveedorSelected = proveedor;
    this.visitaForm.patchValue({
      idProveedor: proveedor.id_proveedor
    });
  }

  /**
   * Manejador del evento de selección de tipo de documento.
   */
  onSeleccionaTipoDocumento(tipoDocumento: any) {
    this.tipoDocumentoSelected = tipoDocumento;
    this.visitaForm.patchValue({
      tipoDocumentoID: tipoDocumento.id
    });
  }


  /**
   * Manejador del evento de selección de Estatus de Solicitud.
   */
  onSeleccionaEstatusSolicitud(estatusSolicitud: any) {
    this.estatusSolicitudSelected = estatusSolicitud;
    this.visitaForm.patchValue({
      estatusSolicitudID: estatusSolicitud.id
    });
  }


  /**
   * Manejador del evento de selección de Motivo de Visita.
   */
  onChangeTipoVisita(tipoVisita: any) {
    const selectElement = event?.target as HTMLSelectElement;
    this.tipoVisitaSelected = selectElement.value;
    console.log('Tipo de visita:', this.tipoVisitaSelected);
    this.visitaForm.patchValue({
      tipoVisita: selectElement.value
    });
  }


  /**
   * Manejador del evento de envío del formulario.
   */
  onSubmit() {
    if (this.visitaForm.invalid) {
      this.showAlerts('Por favor, complete todos los campos requeridos', 'warning');
      return;
    }

    this.isLoading = true;
    this.visitaForm.patchValue({
      fechaVisita: this.timeService.toTimeZone(this.visitaForm.value.fechaVisita),
      horaEntrada: this.timeService.toTimeZone( this.timeService.formatTimeToDate(this.visitaForm.value.horaEntrada)),
      horaSalida: this.timeService.toTimeZone( this.timeService.formatTimeToDate(this.visitaForm.value.horaSalida)),

      creado: this.timeService.toTimeZone(),
      creadoPor: this.idUsuario,
      modificado: this.timeService.toTimeZone(),
      modificadoPor: this.idUsuario
    });

    console.log('Visita form:', this.visitaForm.value );
    const formatData = this.visitaForm.value;

    const apiCall = this.TIPO_MODAL === 'CREATE' ? this.apiOperacionesService.postVisita(formatData) : this.apiOperacionesService.putVisita(formatData);

    apiCall.subscribe(
      (response) => {
        console.log('response:', response);
        const successMessage = this.TIPO_MODAL === 'CREATE' ? 'Registro creado exitosamente' : 'Registro actualizado exitosamente';
        this.showAlerts(successMessage, 'success');
        this.isLoading = false;
        this.modal.close(successMessage);
      },
      (error) => {
        console.log('error:', error);
        const errorMessage = this.TIPO_MODAL === 'CREATE' ? 'Error al crear el registro' : 'Error al actualizar el registro';
        this.showAlerts(errorMessage, 'error');
        this.isLoading = false;
      }
    );

  }


  getErrorMessage(): string {
    const control = this.visitaForm.get('documentoIdentidad');

    if (control?.hasError('required')) return 'El documento es requerido.';
    if (control?.hasError('invalidCurp')) return 'El CURP ingresado no es válido.';
    if (control?.hasError('invalidDocument')) return 'El documento no cumple con el formato esperado.';
    if (control?.hasError('invalidDocumentType')) return 'El tipo de documento seleccionado no es válido.';

    return '';
  }


  /**
   * Muestra una alerta.
   */
  private showAlerts(mensaje: string, tipo: string) {
    this.alertMessage = mensaje;
    this.alertType = tipo;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3000);
  }

  /**
   * Obtiene la configuración de columnas para sucursales.
   */
  private getColumnConfigSucursales() {
    return {
      idSucursal: { displayName: 'ID', showFilter: true, visible: true, type: 'string' },
      nombre: { displayName: 'Nombre', showFilter: true, visible: true, type: 'string' }
    };
  }

  /**
   * Obtiene la configuración de columnas para proveedores.
   */
  private getColumnConfigProveedores() {
    return {
      id_proveedor: { displayName: 'ID', showFilter: true, visible: true, type: 'string' },
      num_proveedor: { displayName: 'Número Proveedor', type: 'default', showFilter: true, visible: true },
      nombre_proveedor: { displayName: 'Nombre', showFilter: true, visible: true, type: 'string' },
      fecha_ingreso: { displayName: 'Fecha Ingreso', type: 'date',format: 'dd/mm/yyyy hh:mm a', showFilter: true, visible: true }
    };
  }


  /**
   * Obtiene la configuración de columnas para tipo de documento.
   */
  private getColumnConfigTipoDocumento() {
    return {
      id: { displayName: 'ID', showFilter: true, visible: true, type: 'string' },
      codigo: { displayName: 'Código', showFilter: true, visible: true, type: 'string' }
    };
  }


  /**
   * Obtiene la configuración de columnas para Estatus Solicitud .
   */
  private getColumnConfigEstatusSolicitud() {
    return {
      id: { displayName: 'ID', showFilter: true, visible: true, type: 'string' },
      nombre: { displayName: 'Nombre', showFilter: true, visible: true, type: 'string' }
    };
  }



  /**
   * Obtiene la configuración de columnas visibles.
   */
  private getDisplayColumnConfig(identificador: string, columnas: string[]): DisplayColumnConfigDF {
    return {
      identificador,
      separadorColumnas: ' - ',
      columnas
    };
  }

  /**
   * Obtiene la configuración de la tabla.
   */
  private getTableConfig(columnConfigs: any, displayColumnConfig: any) {
    return {
      tableConfig: {
        columns: columnConfigs,
        displayColumnConfig,
        paginator: true,
        sort: true,
        filter: true,
        selection: true,
        selectionMode: 'single'
      }
    };
  }

  /**
   * Cierra el modal.
   */
  cerrarModal() {
    this.modal.close();
  }
}
