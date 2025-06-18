import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiSistemaGeneralService } from '../../../../DataAccess/api-sistema-general.service';
import { ElementoDetalle } from '../../../../models/SistemaGeneral/ElementoDetalle';
import { CatalogoGeneralService } from '../../../services/catalogo-general.service'

@Component({
  selector: 'app-elemento-det-editar',
  templateUrl: './elemento-det-editar.component.html',
  styleUrls: ['./elemento-det-editar.component.css']
})
export class ElementoDetEditarComponent {

  catElementoDetForm: FormGroup = new FormGroup({});
  elementoDetalle: ElementoDetalle;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  

  constructor(private fb: FormBuilder, private apiDataAcces: ApiSistemaGeneralService,private serviceCatGeneral: CatalogoGeneralService) {
   
    this.elementoDetalle = new ElementoDetalle();
    this.catElementoDetForm = this.fb.group({
      idCatGeneral: this.elementoDetalle.idCatGeneral,
      idCatGenDetalle: this.elementoDetalle.idCatGenDetalle,
      idElemento: this.elementoDetalle.idElemento,
      clave: this.elementoDetalle.clave,
      nombre: this.elementoDetalle.nombre,
      activo: this.elementoDetalle.activo,
      fechaCreacion: this.elementoDetalle.fechaCreacion,
      creadoPor: this.elementoDetalle.creadoPor,
      fechaModificacion: new Date(),
      modificadoPor: this.elementoDetalle.modificadoPor
    });
  }
  
  ngOnInit() {
    this.serviceCatGeneral.regGeneralSourceActual.subscribe(registroGeneral => this.elementoDetalle = registroGeneral);
    console.log(this.elementoDetalle);

    // Inicializar el formulario
    this.catElementoDetForm.patchValue({
      idCatGeneral: this.elementoDetalle.idCatGeneral,
      idCatGenDetalle: this.elementoDetalle.idCatGenDetalle,
      idElemento: this.elementoDetalle.idElemento,
      clave: this.elementoDetalle.clave,
      nombre: this.elementoDetalle.nombre,
      activo: this.elementoDetalle.activo,
      fechaCreacion: this.elementoDetalle.fechaCreacion,
      creadoPor: this.elementoDetalle.creadoPor,
      fechaModificacion: new Date(),
      modificadoPor: this.elementoDetalle.modificadoPor
    });
  }

  onSubmit(): void {
    
    if (this.catElementoDetForm.valid) {
      console.log(this.catElementoDetForm.value);
      // Si el formulario es válido, envía los datos
      this.apiDataAcces.actualizarDatos(this.catElementoDetForm.value).subscribe(data => {
        console.log(this.catElementoDetForm.value);
        this.triggerAlert("Elemento actualizado exitosamente!", "success");
      }, error => {
        console.log(error.error.errors);
        this.triggerAlert("Fallo al actualizar el elemento!", "danger");
      });
    } else {
      // Si el formulario no es válido, muestra una alerta o mensaje de error
      this.triggerAlert("Por favor, complete el formulario correctamente antes de guardar.", "warning");
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
