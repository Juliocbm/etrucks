import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { TipoCaja } from 'src/app/models/RH/TipoCaja';
import { StorageService } from 'src/app/Services/StorageService';
import { NotificacionService } from 'src/app/shared-module/services/notificacion.service';

@Component({
  selector: 'app-modal-crud-tipoCaja',
  templateUrl: './modal-crud-tipoCaja.component.html',
  styleUrls: ['./modal-crud-tipoCaja.component.css']
})
export class ModalCrudTipoCajaComponent implements OnInit {

  formulario: FormGroup = new FormGroup({});
  tipoCaja: TipoCaja = new TipoCaja();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = true;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudTipoCajaComponent>,
    private storageService: StorageService<TipoCaja>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private router: Router,
    public dialog: MatDialog,
    private apiRecHumanosService: ApiRecursosHumanosService) { }

  ngOnInit() {
    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

  getItemLocalStorage() {
    this.storageService.init('tipoCajaActual');

    this.storageService.itemActual.subscribe(tipoCaja => {
      if (tipoCaja) {
        console.log('tipoCajaActual', tipoCaja);
        this.tipoCaja = tipoCaja;
      } else {
        console.log("No hay un elemento guardado en session");
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.tipoCaja = restOfData;

    if (this.TIPO_MODAL == 'CREATE') {
      this.tipoCaja = new TipoCaja();
      this.IS_EDITABLE = true;
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    this.isLoading = false;

    this.formulario = this.fb.group({
      idTipoCaja: [this.tipoCaja.idTipoCaja,],
      nombre: [this.tipoCaja.nombre, [Validators.required]],
      clave: [this.tipoCaja.clave, [Validators.required]],

      activo: [this.tipoCaja.activo],
      fechaCreacion: [this.tipoCaja.fechaCreacion],
      creadoPor: [this.tipoCaja.creadoPor],
      fechaModificacion: [this.tipoCaja.fechaModificacion],
      modificadoPor: [this.tipoCaja.modificadoPor],
      usuarioCreadoPor: [this.tipoCaja.usuarioCreadoPor],
      usuarioModificadoPor: [this.tipoCaja.usuarioModificadoPor],
      fechaCreacionForm: [formatDate(this.tipoCaja.fechaCreacion, 'yyyy-MM-dd hh:mm', 'en-US')],
      fechaModificacionForm: [formatDate(this.tipoCaja.fechaModificacion, 'yyyy-MM-dd hh:mm', 'en-US')],
    });

  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {
          // Resetear los valores del formulario con itemStorage
          this.formulario.reset({
            idTipoCaja: itemStorage.idTipoCaja,
            nombre: itemStorage.nombre,
            clave: itemStorage.clave,
            activo: itemStorage.activo,
            creadoPor: itemStorage.creadoPor,
            modificadoPor: itemStorage.modificadoPor,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: itemStorage.fechaModificacion,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            fechaCreacionForm: [formatDate(itemStorage.fechaCreacion, 'yyyy-MM-dd hh:mm', 'en-US')],
            fechaModificacionForm: [formatDate(itemStorage.fechaModificacion, 'yyyy-MM-dd hh:mm', 'en-US')]
          });
        } else {
          console.log("No hay un tipo de caja guardado en sesion.");
        }
      });
    }
  }

  cerrarModal() {
    this.modal.close();
  }

  onSubmit(){

    console.log('SUBMIT: ',  this.formulario.value);

    if (this.formulario.valid) {

      this.isLoading = true; // Muestra el indicador de carga

      const dataForm = this.formulario.value as TipoCaja; //convertimos el formulario a el tipo de dato necesario

      if (this.TIPO_MODAL == 'EDIT' || this.TIPO_MODAL == 'DETAIL') {

        console.log('submit actualizar: ', dataForm);

        // Llama al método del servicio para actualizar
        this.apiRecHumanosService.actualizarTipoCaja(dataForm).subscribe(
          (response) => {
              this.isLoading = false;
              this.notificacionService.showNotification('Tipo caja de ahorro actualizada exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
          },
          (error) => {
            this.isLoading = false;
            if (error.status == 422) {
              this.notificacionService.showNotification(error.error, 'warning');
            } else {
              this.notificacionService.showNotification('Error al actualizar tipo caja de ahorro. Por favor, intenta de nuevo más tarde.', 'error');
            }
            console.error('ERROR ACTUALIZAR:', error);
          }
        );
      } else {
        console.log('submit crear: ', dataForm);
        // Llama al método del servicio para crear

        this.apiRecHumanosService.enviarTipoCaja(dataForm).subscribe(
          (response) => {
            this.isLoading = false;
            this.notificacionService.showNotification('Tipo caja de ahorro creada exitosamente.', 'success');
            this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
            this.initializeRequiredData(); //resetea campos de formulario
          },
          (error) => {
            this.isLoading = false;
            if (error.status == 422) {
              this.notificacionService.showNotification(error.error, 'warning');
            } else {
              this.notificacionService.showNotification('Error al actualizar tipo caja de ahorro. Por favor, intenta de nuevo más tarde.', 'error');
            }
            console.error('ERROR CREAR:', error);

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
