import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { ApiRhService } from 'src/app/DataAccess/api-rh.service';
import { RelClienteOperadorVetadoDTO, RelClienteOperadorVetado } from 'src/app/models/Operaciones/RelClienteOperadorVet';
import { ParametrosDropdownClientes, ParametrosDropdownOperadores } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';
import { getDisplayColumnConfig } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';

@Component({
  selector: 'app-modal-crud-cte-opev',
  templateUrl: './modal-crud-cte-opev.component.html',
  styleUrls: ['./modal-crud-cte-opev.component.css'],
})
export class ModalCrudCteOpevComponent implements OnInit {
  // Configuración general del modal
  TITULO_MODAL = 'Relación de cliente con el operador vetado';
  TIPO_MODAL = '';
  IS_EDITABLE = false;
  isCreate = false;
  isLoading = false;

  // Variables del formulario
  formulario: FormGroup = new FormGroup({});
  clienteOperadores!: RelClienteOperadorVetado;
  relClienteOperadores!: RelClienteOperadorVetadoDTO;
  idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');
  idUsuario = localStorage.getItem('idUsuario') ?? '';

  // Alertas
  alertType = '';
  alertMessage = '';
  showAlert = false;

  // Cliente
  clienteSelected: any = {};
  parametrosClientes = ParametrosDropdownClientes;
  columnConfigsClientes = this.getColumnConfigsClientes();
  displayColumnConfCliente = getDisplayColumnConfig('id_cliente', ['nombre']);
  tableConfigsCliente = this.getTableConfig(this.columnConfigsClientes, this.displayColumnConfCliente);

  // Operador
  operadorSelected: any[] = [];
  parametrosOperadores = ParametrosDropdownOperadores;
  columnConfigsOperadores = this.getColumnConfigsOperadores();
  displayColumnConfOperador = getDisplayColumnConfig('idPersonal', ['nombreCompleto'], 'idPersonal');
  tableConfigsOperador = this.getTableConfig(this.columnConfigsOperadores, this.displayColumnConfOperador);

  constructor(
    private fb: FormBuilder,
    public apiOperacionesService: ApiOperacionesService,
    public ApiRhService: ApiRhService,
    private cdr: ChangeDetectorRef,
    public modal: MatDialogRef<ModalCrudCteOpevComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeModal();
  }

  /**
   * Inicializa las configuraciones del modal.
   */
  private initializeModal() {

    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    // this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';
    this.relClienteOperadores = this.data.DATA || new RelClienteOperadorVetadoDTO();
    this.TIPO_MODAL === 'CREATE' ? this.prepareCreateMode() : this.prepareEditOrDetailMode();
  }

  /**
   * Prepara el modo de creación.
   */
  private prepareCreateMode() {
    this.isCreate = true;
    this.IS_EDITABLE = true;
    this.clienteOperadores = new RelClienteOperadorVetado();
    this.initializeForm();
  }

  /**
   * Prepara los modos de edición o detalle.
   */
  private prepareEditOrDetailMode() {
    console.log('this.data.DATA', this.data.DATA);
    this.IS_EDITABLE = this.TIPO_MODAL === 'EDIT';
    this.setValuesDropdowns();
  }

  /**
   * Inicializa el formulario.
   */
  private initializeForm() {
    this.formulario = this.fb.group({
      id: new FormControl(this.clienteOperadores.id),
      idCliente: new FormControl(this.clienteOperadores.idCliente, [Validators.required]),
      idPersonal: new FormControl(this.clienteOperadores.idPersonal, [Validators.required]),
      activo: new FormControl(this.clienteOperadores.activo),
      creadoPor: new FormControl(this.idUsuario),
      modificadoPor: new FormControl(this.idUsuario),
      creado: new FormControl(this.clienteOperadores.creado),
      modificado: new FormControl(this.clienteOperadores.modificado)
    });
  }

  /**
   * Establece valores en los dropdowns según la información recibida.
   */
  private setValuesDropdowns() {
    const dataModal = this.data.DATA;

    this.clienteSelected = {
      id_cliente: dataModal.idCliente,
      nombre: dataModal.cliente,
    };

    //
    this.operadorSelected = (dataModal.personal || []).map((operador: any) => ({
      idPersonal: operador.idPersonal,
      nombreCompleto: `${operador.nombre}`,
    }));

    console.log('this.operadorSelected', this.operadorSelected);

    this.formulario.patchValue({
      idCliente: this.clienteSelected.id_cliente,
      idPersonal: this.operadorSelected.map((op) => op.idPersonal),
    });

    this.cdr.detectChanges();
  }

  /**
   * Configuración de columnas para dropdown de clientes.
   */
  private getColumnConfigsClientes() {
    return {
      id_cliente: { displayName: 'ID', showFilter: true, visible: true },
      nombre: { displayName: 'Nombre', showFilter: true, visible: true },
      rfc: { displayName: 'RFC', showFilter: true, visible: true },
    };
  }

  /**
   * Configuración de columnas para dropdown de operadores.
   */
  private getColumnConfigsOperadores() {
    return {
      idPersonal: { displayName: 'ID', showFilter: true, visible: true },
      nombreCompleto: { displayName: 'Nombre', showFilter: true, visible: true },
      rfc: { displayName: 'RFC', showFilter: true, visible: true },
    };
  }

  /**
   * Configuración de columnas visibles.
   */
  private getDisplayColumnConfig(identificador: string, columnas: string[], idMulti?: string) {
    return { identificador, separadorColumnas: ' - ', columnas, idMulti: idMulti || 'PRUEBA' };
  }

  /**
   * Configuración de la tabla.
   */
  private getTableConfig(columnConfigs: any, displayColumnConfig: any) {
    return {
      tableConfigEjecutivo: {
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
   * Manejador del evento de selección de cliente.
   */
  onSeleccionaCliente(cliente: any) {
    this.clienteSelected = cliente;
    this.formulario.patchValue({ idCliente: cliente.id_cliente });
  }

  /**
   * Manejador del evento para añadir un operador.
   */
  onAddPersonalOperador(operador: any) {
    this.operadorSelected.push(operador);
    this.formulario.patchValue({ idPersonal: this.operadorSelected.map((op) => op.idPersonal) });
  }

  /**
   * Manejador del evento para eliminar un operador.
   */
  onDeletePersonalOperador(operador: any) {
    this.operadorSelected.splice(operador, 1);
    console.log('this.operadorSelected', this.operadorSelected);
  }

  /**
   * Manejador del evento de envío del formulario.
   */
  onSubmit() {
    this.isLoading = true;
    console.log('Operador Selected', this.operadorSelected);

    const formData = this.operadorSelected.map((operador) => ({
      ...this.formulario.value,
      idCliente: this.clienteSelected.id_cliente,
      idPersonal: operador.idPersonal,
      creadoPor: this.idUsuario,
      modificadoPor: this.idUsuario,
    }));
    console.log('formData', formData);

    // Lógica para manejar creación o actualización.
    (this.isCreate
      ? this.apiOperacionesService.postCteOperadorVetado(formData)
      : this.apiOperacionesService.putCteOperadorVetado(formData)
    ).subscribe({
      next: () => this.showAlerts('Operación exitosa', 'success'),
      error: () => this.showAlerts('Ocurrió un error', 'error'),
      complete: () => (this.isLoading = false),
    });
  }

  // Método para editar un registro
  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      // this.storageService.itemActual.subscribe((itemStorage) => {
      //   if (itemStorage) {
      //     this.formulario.patchValue(itemStorage);
      //   }
      // });
    }
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

  /**
   * Cierra el modal.
   */
  cerrarModal() {
    this.modal.close();
  }
}
