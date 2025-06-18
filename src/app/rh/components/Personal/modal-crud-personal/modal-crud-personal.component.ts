import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Personal } from '../../../../models/RH/personal';
import { Categoria } from '../../../../models/RH/Categoria';
import { Departamento } from '../../../../models/RH/Departamento';
import { Sucursal } from '../../../../models/Despacho/Sucursal';
import { StorageService } from '../../../../Services/StorageService';
import { ApiMantenimientoService } from '../../../../DataAccess/api-mantenimiento.service';
import { DisplayColumnConfigDF } from '../../../../shared-module/Interfaces/DisplayColumnConfigDF';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ApiDespachoService } from '../../../../DataAccess/api-despacho.service';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { ApiRecursosHumanosService } from '../../../../DataAccess/api-recursos-humanos.service';
import {validarDominioCorreoAsync, validarFormatoCorreoAsync,patterRfc } from '../../../../shared-module/validations/validates';
import { map,forkJoin } from 'rxjs';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { PersonalGafeteComponent } from '../../empleado/personal-gafete/personal-gafete.component';


@Component({
  selector: 'app-modal-crud-personal',
  templateUrl: './modal-crud-personal.component.html',
  styleUrls: ['./modal-crud-personal.component.css']
})
export class ModalCrudPersonalComponent {

  formulario: FormGroup = new FormGroup({});
  personal: Personal = new Personal();
  departamentos:Departamento[] = [];
  categorias:Categoria[] = [];
  sucursales:Sucursal[] = [];
  departamentoSelect: Departamento | undefined = new Departamento;
  categoriaSelect: Categoria| undefined = new Categoria;
  sucursalSelect:Sucursal | undefined = new Sucursal;
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = true;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  columnConfigsSucursal: { [key: string]: ColumnConfig } = {
    idSucursal: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true,visible: true, customRender: (rowData) => `${rowData.nombre} ` }
  };

  displayColumnConfSucursal: DisplayColumnConfigDF =
  {
    identificador: 'idSucursal',
    separadorColumnas: ' - ',
    columnas: [ 'nombre']
  };

  columnConfigsDepartamento: { [key: string]: ColumnConfig } = {
    idDepartamento: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true,visible: true, customRender: (rowData) => `${rowData.nombre} ` }
  };

  displayColumnConfDepartamento: DisplayColumnConfigDF =
  {
    identificador: 'idDepartamento',
    separadorColumnas: ' - ',
    columnas: [ 'nombre']
  };

  columnConfigsCategoria: { [key: string]: ColumnConfig } = {
    idCategoria: { displayName: 'Id', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true,visible: true, customRender: (rowData) => `${rowData.nombre} ` }
  };

  displayColumnCategoria: DisplayColumnConfigDF =
  {
    identificador: 'idCategoria',
    separadorColumnas: ' - ',
    columnas: [ 'nombre']
  };

  constructor(private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudPersonalComponent>,
    private storageService: StorageService<Personal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private apiDespachoService: ApiDespachoService,
    private notificacionService: NotificacionService,
    private router: Router,
    public dialog: MatDialog,
    private ApiRHService: ApiRecursosHumanosService
   ) {
  }

  ngOnInit() {
    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('Personal');

    this.storageService.itemActual.subscribe(personal => {
      if (personal) {
        console.log('PERSONAL', personal);
        this.personal = personal;
      } else {
        console.log("No hay un elemento guardado en session");
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.personal = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.personal = new Personal();
      this.departamentoSelect = new Departamento();
      this.categoriaSelect = new Categoria();
      this.departamentoSelect = new Departamento();
      this.IS_EDITABLE = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    forkJoin([
      this.apiHandler.getDatosAsync(this.ApiRHService.obtenerCategorias.bind(this.ApiRHService), 'categorias'),
      this.apiHandler.getDatosAsync(this.ApiRHService.obtenerDepartamentos.bind(this.ApiRHService), 'departamentos'),
      this.apiHandler.getDatosAsync(this.apiDespachoService.obtenerSucursales.bind(this.apiDespachoService), 'sucursales'),
    ]).subscribe(([categorias,departamentos, sucursales]) => {
      this.categorias = categorias;
      this.departamentos = departamentos;
      this.sucursales = sucursales;

      console.log('SUCURSAL', this.sucursales);

      if(this.TIPO_MODAL != 'CREATE')
      {
          this.categoriaSelect = this.categorias.find(c => c.idCategoria == this.personal.idCategoria);
          this.departamentoSelect = this.departamentos.find(d => d.idDepartamento == this.personal.idDepartamento);
          this.sucursalSelect = this.sucursales.find(s => s.idSucursal == this.personal.idSucursal);
      }

      this.isLoading = false;
    });

    this.formulario = this.fb.group({
      idPersonal: [this.personal.idPersonal,],
      nombre: [this.personal.nombre,[Validators.required]],
      apellidoPaterno: [this.personal.apellidoPaterno,[Validators.required]],
      apellidoMaterno: [this.personal.apellidoMaterno,[Validators.required]],
      idSucursal: [this.personal.idSucursal,[Validators.required]],
      idCompania: [this.personal.idCompania],
      idDepartamento: [this.personal.idDepartamento,[Validators.required]],
      idCategoria: [this.personal.idCategoria,[Validators.required]],
      email: [this.personal.email,{
        validators: [Validators.required],
        asyncValidators: [validarDominioCorreoAsync(), validarFormatoCorreoAsync()],
        updateOn: 'change' // Ejecuta la validación asincrónica cuando el valor cambia
      }],
      noNomina: [this.personal.noNomina,[Validators.required, Validators.min(1)]],
      activo: [this.personal.activo],
      fechaCreacion: [this.personal.fechaCreacion],
      creadoPor: [this.personal.creadoPor],
      fechaModificacion: [this.personal.fechaModificacion],
      modificadoPor: [this.personal.modificadoPor],
      usuarioCreadoPor:[this.personal.usuarioCreadoPor],
      usuarioModificadoPor:[this.personal.usuarioModificadoPor],
      fechaCreacionForm: [formatDate(this.personal.fechaCreacion,'yyyy-MM-dd hh:mm','en-US')],
      fechaModificacionForm: [formatDate(this.personal.fechaModificacion,'yyyy-MM-dd hh:mm','en-US')],
      rfc: [this.personal.rfc, {
        validators: [Validators.pattern(patterRfc),Validators.required],
        updateOn: 'change'
      }],
    });

  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {
          // Resetear los valores del formulario con itemStorage
          this.formulario.reset({
            idPersonal: itemStorage.idPersonal,
            nombre: itemStorage.nombre,
            apellidoPaterno: itemStorage.apellidoPaterno,
            apellidoMaterno: itemStorage.apellidoMaterno,
            idSucursal: itemStorage.idSucursal,
            idCompania: itemStorage.idCompania,
            idDepartamento: itemStorage.idDepartamento,
            idCategoria: itemStorage.idCategoria,
            email: itemStorage.email,
            noNomina: itemStorage.noNomina,
            activo: itemStorage.activo,
            creadoPor: itemStorage.creadoPor,
            modificadoPor: itemStorage.modificadoPor,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: itemStorage.fechaModificacion,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            fechaCreacionForm: [formatDate(itemStorage.fechaCreacion,'yyyy-MM-dd hh:mm','en-US')],
            fechaModificacionForm: [formatDate(itemStorage.fechaModificacion,'yyyy-MM-dd hh:mm','en-US')],
            rfc: itemStorage.rfc
          });
        } else {
          console.log("No hay un permisionario guardado en sesion.");
        }
      });
    }
  }

  cerrarModal() {
    this.modal.close();
  }

  onSeleccionaSucursal(sucursal: Sucursal) {
    this.sucursalSelect = sucursal;
  }

  onSeleccionaDepartamento(departamento: Departamento) {
    this.departamentoSelect = departamento;
  }

  onSeleccionaCategoria(categoria: Categoria) {
    this.categoriaSelect = categoria;
  }

  // Enviar This.Personal al component personal-gafete
  verGafete() {
    console.log('verGafete', this.personal);
    this.storageService.changeItem(this.personal);

    this.onImprimirGafeteClick(this.personal);
  }

  onImprimirGafeteClick(rowData: any) {
    console.log('onImprimirGafeteClick', rowData);
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Imprimir Gafete',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(PersonalGafeteComponent, {
      width: '800px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('result', result);
      this.retriveData();
    });
  }

  retriveData() {
    this.modal.close();
  }


  onSubmit(){

    this.formulario.value.idSucursal = this.sucursalSelect?.idSucursal;
    this.formulario.value.idCategoria = this.categoriaSelect?.idCategoria;
    this.formulario.value.idDepartamento = this.departamentoSelect?.idDepartamento;

    console.log('SUBMIT: ',  this.formulario.value);

    if (this.formulario.valid) {

      this.isLoading = true; // Muestra el indicador de carga

      const dataForm = this.formulario.value as Personal; //convertimos el formulario a el tipo de dato necesario

      if (this.TIPO_MODAL == 'EDIT' || this.TIPO_MODAL == 'DETAIL') {

        console.log('submit actualizar: ', dataForm);

        // Llama al método del servicio para actualizar
        this.ApiRHService.actualizarPersonal(dataForm).subscribe(
          (response) => {
            if(!response.success){
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            }else{
              this.isLoading = false;
              this.notificacionService.showNotification('Personal actualizada exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            }
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification('Error al actualizar Personal. Por favor, intenta de nuevo más tarde.', 'error');
            console.error('Error al actualizar:', error);
          }
        );
      } else {
        console.log('submit crear: ', dataForm);
        // Llama al método del servicio para crear

        this.ApiRHService.enviarPersonal(dataForm).subscribe(
          (response) => {
            if(!response.success){
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            }else{
              this.isLoading = false;
              this.notificacionService.showNotification('Personal creada exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              this.initializeRequiredData(); //resetea campos de formulario
            }
          },
          (error) => {
            console.log('ERROR CREAR', error.error.errors);
            this.isLoading = false;
            this.notificacionService.showNotification('Error al crear Personal. Por favor, intenta de nuevo más tarde.', 'error');

          }
        );
      }
    } else {
      // console.log('formulario no valido');
      this.notificacionService.showNotification('Formulario no valido', 'error');
      this.displayFormErrors();
    }
  }

  displayFormErrors(): void {
    Object.keys(this.formulario.controls).forEach(key => {
      const controlErrors = this.formulario.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log(`Key control: ${key}, keyError: ${keyError}, error value:`, controlErrors[keyError]);
        });
      }
    });
  }
}
