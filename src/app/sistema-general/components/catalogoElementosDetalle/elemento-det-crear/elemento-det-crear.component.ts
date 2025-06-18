import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ElementoDetalle } from '../../../../models/SistemaGeneral/ElementoDetalle';
import { CatalogoGeneralService } from '../../../services/catalogo-general.service'

@Component({
  selector: 'app-elemento-det-crear',
  templateUrl: './elemento-det-crear.component.html',
  styleUrls: ['./elemento-det-crear.component.css']
})
export class ElementoDetCrearComponent {
  catElementoDetForm: FormGroup;
  elementoDetalle: ElementoDetalle;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  // ID_CAT_PADRE = 'F497F867-4AB7-4704-99EF-0783E4B45CAF';

  constructor(
    private fb: FormBuilder,
    private apiDataAcces: ApiSistemaGeneralService,
    private serviceCatGeneral: CatalogoGeneralService
  ) {
    this.elementoDetalle = new ElementoDetalle();

      this.catElementoDetForm = this.fb.group({
      clave: this.elementoDetalle.clave,
      nombre: this.elementoDetalle.nombre,
      activo: true,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      idCatGeneral: this.elementoDetalle.idCatGeneral 
    });

  }

  ngOnInit(): void {

    this.serviceCatGeneral.regGeneralSourceActual.subscribe(registroGeneral => this.elementoDetalle = registroGeneral);
    this.resetForm();

    this.catElementoDetForm.patchValue({
      idCatGeneral: this.elementoDetalle.idCatGeneral,
    });

  
  }

  onSubmit(): void {
    console.log(this.catElementoDetForm.value);
    if (this.catElementoDetForm.valid) {
     
        this.apiDataAcces.enviarRegistro(this.catElementoDetForm.value).subscribe(
        data => {
          console.log(data);
          this.resetForm(this.catElementoDetForm);
          this.triggerAlert('Registro creado exitosamente!', 'success');
        },
        error => {
          this.triggerAlert(`Fallo al crear el registro! ${error.error}`, 'danger');
        }
      );
    } else {
      this.triggerAlert('Por favor, complete el formulario correctamente antes de guardar.', 'warning');
    }
  }

  resetForm(catGeneralForm?: FormGroup): void {
    if (catGeneralForm != null) {
      catGeneralForm.reset();
    }
  }

  triggerAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

}
