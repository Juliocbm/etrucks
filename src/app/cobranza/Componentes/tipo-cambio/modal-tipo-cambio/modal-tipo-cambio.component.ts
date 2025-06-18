import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, AlertType } from '../../../../Services/alerts.service';
import { TipoCambio } from '../../../Models/TipoCambio/TipoCambio';
import { ApiDespachoService } from '../../../../DataAccess/api-despacho.service';
import { ApiCfdiService } from '../../../../DataAccess/api-cfdi.service';
import { FormValidationService } from 'src/app/shared-module/services/form-validation.service';
import { FieldsFormConfig } from 'src/app/shared-module/Interfaces/FieldsFormConfig';
import { fieldsFormTipoCambio } from '../configCrudTipoCambio';



@Component({
  selector: 'app-modal-tipo-cambio',
  templateUrl: './modal-tipo-cambio.component.html',
  styleUrls: ['./modal-tipo-cambio.component.css']
})

export class ModalTipoCambioComponent implements OnInit {
  formulario!: FormGroup;
  tipoModal: string = '';
  tituloModal: string = 'Tipo de Cambio';
  isEditable = false;
  
  fieldsFormTipoCambio = fieldsFormTipoCambio;
  
  initialFormValues: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalTipoCambioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiDespachoService: ApiDespachoService,
    private alertService: AlertService,
    public validateFormService: FormValidationService,
    public apiCfdi: ApiCfdiService,
  ) {}

  ngOnInit(): void {
    this.tipoModal = this.data?.TIPO_MODAL ?? 'DETAIL';
    this.isEditable = this.tipoModal !== 'DETAIL';

    console.log('tipoModal', this.tipoModal);
    console.log('esEditable', this.isEditable);

    this.formulario = this.fb.group({
      id: [this.data?.id],
      fecha: [this.tipoModal === 'CREATE' ? new Date() : new Date(this.data?.fecha)],
      valor: [this.data?.valor ?? '', [Validators.required, Validators.min(0), Validators.max(30)]],
      activo: [this.data?.activo ?? true],
      creadoPor: [this.data?.creadoPor],
      usuarioCreadoPor: [this.data?.usuarioCreadoPor],
      fechaCreacion: [this.data?.fechaCreacion],
      usuarioModificadoPor: [this.data?.usuarioModificadoPor],
      fechaModificacion: [this.data?.fechaModificacion],
    });
    
    this.initialFormValues = this.formulario.value;
  }

  cerrar() {
    this.dialogRef.close();
  }

  limitarDecimales(event: any, maxDecimals: number): void {
    const input = event.target;
    const value = input.value;
  
    // Si tiene punto decimal...
    if (value.includes('.')) {
      const [_, decimalPart] = value.split('.');
      if (decimalPart.length > maxDecimals) {
        input.value = value.slice(0, -(decimalPart.length - maxDecimals));
        this.formulario.get('valor')?.setValue(+input.value); // Actualiza el formControl también
      }
    }
  }
  

  onSubmit() {
    const formValido = this.validateFormService.isFormValid(this.formulario, this.initialFormValues, this.tipoModal, fieldsFormTipoCambio); 
    if (!formValido){
      /* this.alertService.error("El formulario no es válido"); */
      return;
    }

    const data: TipoCambio = this.formulario.getRawValue();


    if (this.tipoModal === 'CREATE') {
      this.apiCfdi.crearTipoCambio(data).subscribe();
      
    } else if (this.tipoModal === 'EDIT') {
      this.apiCfdi.actualizarTipoCambio(data).subscribe();
    }
  }
}
