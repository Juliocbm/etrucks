import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { Usuario } from 'src/app/models/Administrador/Usuario';
import { Cliente, MarcaTracktor, RelClienteMarcaTracktorDTO } from 'src/app/models/Operaciones/RelClienteMarcaTracktorDTO';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { StorageService } from 'src/app/Services/StorageService';
import { ParametrosDropdownClientesCTEMarca, ParametrosDropdownMarcas } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { TimeService } from 'src/app/shared-module/services/time.service';

@Component({
  selector: 'app-modal-crud-cte-mrca',
  templateUrl: './modal-crud-cte-mrca.component.html',
  styleUrls: ['./modal-crud-cte-mrca.component.css']
})
export class ModalCrudCteMrcaComponent implements OnInit {

  CteMarcaForm!: FormGroup;
  marcass = new FormControl(''); // LISTA DE MARCAS


  CteMarcaTracktor: RelClienteMarcaTracktorDTO = new RelClienteMarcaTracktorDTO();
  Clientes: Cliente[] = [];
  Marcas: MarcaTracktor[] = [];
  usuario: Usuario = new Usuario();
  idUsuario: string = "";
  public idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');
  public isLoading: boolean = false;

  showAlert = false;
  alertMessage = '';
  alertType = '';
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isCreate: boolean = false;
  dropdownList: any[] = [];
  idSistema: number = 0;

  parametrosClientes = ParametrosDropdownClientesCTEMarca;
  
  columnConfigsClientes : { [key: string]: ColumnConfig } = {
    estatus: { displayName: 'Estatus', type: 'default', showFilter: true, visible: true },
    id_cliente: { displayName: 'ID', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    rfc: { displayName: 'RFC', type: 'default', showFilter: true, visible: true }
  };
  displayColumnConfCliente: DisplayColumnConfigDF =
  {
    identificador: 'id_cliente',
    separadorColumnas: ' - ',
    columnas: ['id_cliente', 'nombre', 'rfc', 'estatus']
  };
  clienteSelected: any = {};
  onSeleccionaCliente(data: any) {
    console.log('Evento:', data);
    this.clienteSelected = data;
    this.CteMarcaForm.patchValue({
      idCliente: data.id_cliente
    });
    console.log('Cliente:', this.CteMarcaForm.value);
  }
  tableConfigsCliente: { [key: string]: any } = {
    tableConfigEjecutivo: {
      columns: this.columnConfigsClientes,
      displayColumnConfig: this.displayColumnConfCliente,
      filterType: 'default',
      paginator: true,
      sort: true,
      filter: true,
      selection: true,
      selectionMode: 'single',
      customActions: [],
      customFilters: [],
      customFiltersApply: []
    }
  };

  parametrosMarcas = ParametrosDropdownMarcas;
  
  columnConfigsMarcas : { [key: string]: ColumnConfig } = {
    estatus: { displayName: 'Estatus', type: 'default', showFilter: true, visible: true },
    id_marca_tractor: { displayName: 'ID', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    rfc: { displayName: 'RFC', type: 'default', showFilter: true, visible: true }
  };
  displayColumnConfMarca: DisplayColumnConfigDF = {
    identificador: 'id_marca_tractor',
    separadorColumnas: ' - ',
    columnas: ['id_marca_tractor', 'nombre', 'rfc', 'estatus']
  };
  marcaSelected: any = {};
  onSeleccionaMarca(data: any) {
    console.log('Evento:', data);
    this.marcaSelected = data;
    // this.CteMarcaForm.patchValue({
    //   idMarcaTracktor: event.idMarcaTracktor
    // });
  }
  tableConfigsMarca: { [key: string]: any } = {
    tableConfigEjecutivo: {
      columns: this.columnConfigsMarcas,
      displayColumnConfig: this.displayColumnConfMarca,
      filterType: 'default',
      paginator: true,
      sort: true,
      filter: true,
      selection: true,
      selectionMode: 'single',
      customActions: [],
      customFilters: [],
      customFiltersApply: []
    }
  };



  constructor(
    private fb: FormBuilder,  // Utilizamos FormBuilder
    private storageService: StorageService<any>,
    public modal: MatDialogRef<ModalCrudCteMrcaComponent>,
    private apiHandler: ApiServiceHandler,
    public apiOperacionesService: ApiOperacionesService,
    private timeService: TimeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.idUsuario = localStorage.getItem('idUsuario') ?? '';
  }

  ngOnInit(): void {
    this.initializeRequiredData()
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    console.log('Data:', restOfData.DATA );
    this.CteMarcaTracktor = restOfData.DATA;

    if (this.TIPO_MODAL == 'CREATE') {
      this.IS_EDITABLE = true;
      this.CteMarcaTracktor = new RelClienteMarcaTracktorDTO();
      console.log('CteMarcaTracktor:', this.CteMarcaTracktor);
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    console.log('Tipo de Modal:', this.TIPO_MODAL);
    console.log('Estatus edicion:', this.IS_EDITABLE);

    this.getInfo();

    this.idSistema = parseInt(localStorage.getItem('idSistema') || '0');
    this.createForm();  // Inicializar el formulario
  }

  // Get Clientes y MarcaTractor
  async getInfo(){
    forkJoin([
      // this.apiHandler.getDatosAsync(() => this.apiOperacionesService.getClientes(this.idCompania), 'clientes'),
      this.apiHandler.getDatosAsync(() => this.apiOperacionesService.getMarcas(this.idCompania), 'marcas'),
    ]).subscribe(([ marcas ]) => {
      // this.Clientes = clientes;
      this.Marcas = marcas.items;
      console.log('Marcas:', this.Marcas);
    });
  }

  // Función para guardar la información
  createForm() {
    // console.log('CteMarcaTracktor:', this.CteMarcaTracktor );
    // console.log('CteMarcaTracktor:', this.CteMarcaTracktor?.marcas );

    // Obtener los IDs de marcas que ya están seleccionadas
    const marcasSeleccionadas = this.CteMarcaTracktor.marcas
    // console.log('Marcas seleccionadas:', marcasSeleccionadas);

    this.CteMarcaForm = this.fb.group({
      id: [Number(this.CteMarcaTracktor.id)],
      idCliente: [Number(this.CteMarcaTracktor.idCliente)],
      idMarcaTracktor: [ marcasSeleccionadas ],
      activo: [Boolean(this.CteMarcaTracktor.activo)],
      creado: [ this.timeService.toTimeZone(this.CteMarcaTracktor.creado ? new Date() : undefined) ],
      creadoPor: [this.idUsuario],
      modificado: [ this.timeService.toTimeZone(this.CteMarcaTracktor.modificado ? new Date() : undefined) ],
      modificadoPor: [this.idUsuario]
    });
  }

  // Función para editar la información
  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    console.log('Editable:', isEditable);
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        console.log('ItemStorage:', itemStorage);
        if (itemStorage) {
          console.log('ItemStorage:', itemStorage);

          this.CteMarcaForm.reset({
            id: Number(itemStorage.id),
            idCliente: Number(itemStorage.idCliente),
            idMarcaTracktor: Number(itemStorage.idMarcaTracktor),
            activo: Boolean(itemStorage.activo),
            creado: this.timeService.toTimeZone(itemStorage.creado ? new Date() : undefined),
            creadoPor: itemStorage.creadoPor,
            modificado: this.timeService.toTimeZone(itemStorage.modificado ? new Date() : undefined),
            modificadoPor: itemStorage.modificadoPor
          });
          console.log('Visita:', this.CteMarcaForm.value);
        }
        else {
          this.CteMarcaForm.reset();
        }
      }
      );
    }
  }

  // Función para subir la información
  onSubmit() {
    this.isLoading = true;
    if (this.TIPO_MODAL == 'CREATE') {

      // Crear la lista de relaciones
      const relaciones = (Array.isArray(this.marcass.value) ? this.marcass.value : []).map((marcaId: any) => {
        return {
          ...this.CteMarcaForm.value,
          idMarcaTracktor: marcaId,
        };
      });

      // Enviar la lista completa al backend
      this.apiOperacionesService.postClienteMarcaTractor(relaciones).subscribe(
        (res: any) => {
          console.log('Respuesta del servidor:', res);
          this.showAlertMessage('Registro guardado correctamente', 'success');
          this.modal.close();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al guardar relaciones:', error);
          this.showAlertMessage('Ocurrió un error al guardar el registro, puede existir datos duplicados.', 'warning');
          this.isLoading = false;
        }
      );
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.apiOperacionesService.putClienteMarcaTractor(this.CteMarcaForm.value).subscribe((res: any) => {
        console.log('Respuesta:', res);
        this.showAlertMessage('Registro actualizado correctamente', 'success');
        this.isLoading = false;
        this.cerrarModal();
      }, (error: any) => {
        console.log('Error:', error);
        this.showAlertMessage('Error al actualizar el registro', 'danger');
        this.isLoading = false;
      });
    }
  }

  cerrarModal() {
    this.modal.close();
  }

  // Función para mostrar alertas
  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }


}
