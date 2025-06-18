import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Banco } from '../../../../models/RH/Banco';
import { ElementoDetalle } from '../../../../models/SistemaGeneral/ElementoDetalle';
import { StorageService } from '../../../../Services/StorageService';
import { DisplayColumnConfigDF } from '../../../../shared-module/Interfaces/DisplayColumnConfigDF';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { ApiServiceHandler } from '../../../../DataAccess/apiServiceHandler';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ApiRecursosHumanosService } from '../../../../DataAccess/api-recursos-humanos.service';


@Component({
  selector: 'app-modal-crud-banco',
  templateUrl: './modal-crud-banco.component.html',
  styleUrls: ['./modal-crud-banco.component.css']
})
export class ModalCrudBancoComponent {
  formulario: FormGroup = new FormGroup({});
  banco: Banco = new Banco();
  TITULO_MODAL: string = '';
  TIPO_MODAL: string = '';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = false;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  tiposMoneda: ElementoDetalle[] = [];
  CAT_GRAL_TIPO_MONEDA = '64BA5C56-6CE1-43F1-9275-826D767C6ECE';

constructor(private fb: FormBuilder,
    public modal: MatDialogRef<ModalCrudBancoComponent>,
    private storageService: StorageService<Banco>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiHandler: ApiServiceHandler,
    private notificacionService: NotificacionService,
    private apiGeneralService: ApiSistemaGeneralService,
    private apiRh: ApiRecursosHumanosService,) {
  }

  ngOnInit() {
    this.getItemLocalStorage();
    this.initializeRequiredData();
  }

 getItemLocalStorage() {
    this.storageService.init('bancoActual');

    this.storageService.itemActual.subscribe(banco => {
      if (banco) {
        this.banco = banco;
        
      } else {
        console.log("No hay un elemento guardado en session");
      }
    });
  }

  initializeRequiredData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Título por Defecto';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';

    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.banco = restOfData;
  
    if (this.TIPO_MODAL == 'CREATE') {
      this.IS_EDITABLE = true;
      this.banco = new Banco();
     
    } else if (this.TIPO_MODAL == 'EDIT') {
      this.IS_EDITABLE = true;
    } else {
      this.IS_EDITABLE = false;
    }

    this.apiHandler.getDatosAsync(() => this.apiGeneralService.obtenerRegistro(this.CAT_GRAL_TIPO_MONEDA,true), 'tipoMoneda')
    .subscribe(tipoMoneda => {
      this.tiposMoneda = tipoMoneda;
    });

    this.formulario = this.fb.group({
      idBanco: [this.banco.idBanco],
      idCompania: [this.banco.idCompania],
      compania: [this.banco.compania],
      claveSat: [this.banco.claveSat, [Validators.required]],
      nombre: [this.banco.nombre, [Validators.required]],
      razonSocial: [this.banco.razonSocial,[Validators.required]],
      idTipoMoneda: [this.banco.idTipoMoneda],
      cuenta: [this.banco.cuenta],
      clabe: [this.banco.clabe],
      tipoMoneda: [this.banco.tipoMoneda],
      creadoPor:  [this.banco.creadoPor],
      activo: [this.banco.activo],
      fechaCreacion: [this.banco.fechaCreacion],
      fechaModificacion: [this.banco.fechaModificacion],
      usuarioCreadoPor: [this.banco.usuarioCreadoPor],
      usuarioModificadoPor: [this.banco.usuarioModificadoPor],
     
    });
  }

  editableChange(isEditable: boolean) {
    this.IS_EDITABLE = isEditable;
    if (!isEditable) {
      this.storageService.itemActual.subscribe(itemStorage => {
        if (itemStorage) {
          this.formulario.reset({
          
            idBanco: itemStorage.idBanco,
            idCompania: itemStorage.idCompania,
            compania: itemStorage.compania,
            claveSat: itemStorage.claveSat,
            nombre: itemStorage.nombre, 
            razonSocial:itemStorage.razonSocial,
            idTipoMoneda: itemStorage.idTipoMoneda,
            tipoMoneda: itemStorage.tipoMoneda,
            creadoPor:  itemStorage.creadoPor,
            activo: itemStorage.activo,
            fechaCreacion: itemStorage.fechaCreacion,
            fechaModificacion: itemStorage.fechaModificacion,
            usuarioCreadoPor: itemStorage.usuarioCreadoPor,
            usuarioModificadoPor: itemStorage.usuarioModificadoPor,
            cuenta: itemStorage.cuenta, 
            clabe: itemStorage.clabe
          });
        } else {
          console.log("No hay un permisionario guardado en sesion.");
        }
      }   );
    }
  }

  onSubmit() {
    console.log('submit crear: ',  this.formulario.value);

    if (this.formulario.valid) {

      this.isLoading = true; // Muestra el indicador de carga

      const dataForm = this.formulario.value as Banco; //convertimos el formulario a el tipo de dato necesario

      if (this.TIPO_MODAL == 'EDIT' || this.TIPO_MODAL == 'DETAIL') {

        
        // Llama al método del servicio para actualizar 
        this.apiRh.actualizarBanco(dataForm).subscribe(
          (response) => {
              this.isLoading = false;
              this.notificacionService.showNotification('Banco contable actualizado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
          },
          (error) => {
            this.isLoading = false;
            this.notificacionService.showNotification('Error al actualizar Concepto contable. Por favor, intenta de nuevo más tarde.', 'error');
            console.error('Error al actualizar:', error);
          }
        );
      } else {
        console.log('submit crear: ', dataForm);
        // Llama al método del servicio para crear
       
        this.apiRh.enviarBanco(dataForm).subscribe(
          (response) => {
            if(!response.success){
              this.isLoading = false;
              this.notificacionService.showNotification(response.message, 'warning');
            }else{
              this.isLoading = false;
              this.notificacionService.showNotification('Banco creado exitosamente.', 'success');
              this.storageService.changeItem(dataForm); //actualiza el item guardado en localhost
              this.initializeRequiredData(); //resetea campos de formulario
            }
          },
          (error) => {
            console.log('ERROR CREAR', error.error.errors);
            this.isLoading = false;
            this.notificacionService.showNotification('Error al crear Concepto contable. Por favor, intenta de nuevo más tarde.', 'error');

          }
        );
      }
    } else {
      console.log('formulario no valido');
      this.notificacionService.showNotification('Formulario no valido', 'error');
    }
  }

  cerrarModal() {
    this.modal.close();
  }
}
