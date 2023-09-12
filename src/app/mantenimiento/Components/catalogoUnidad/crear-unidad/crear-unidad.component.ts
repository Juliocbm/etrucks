import { Component } from '@angular/core';
import { ApiUnidadService } from '../../../../DataAccess/api-services-unidad.service';
import { Unidad } from './../../../../models/Mantenimiento/unidad';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-crear-unidad',
  templateUrl: './crear-unidad.component.html',
  styleUrls: ['./crear-unidad.component.css']
})

export class CrearUnidadComponent {

  unidad : Unidad;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private apiUnidadService: ApiUnidadService){
    this.unidad = new Unidad();
  }

  ngOnInit() {
    this.resetForm();
  }

  onSubmit(unidadForm: NgForm) {
    console.log(this.unidad);
    this.unidad.fechaCreacion = new Date();
    this.unidad.fechaModificacion = new Date();

    this.apiUnidadService.enviarDatos(this.unidad).subscribe(data => {
      console.log(data);
      this.resetForm(unidadForm);
      this.triggerAlert("Unidad creado exitosamente!", "success");
    }, error => {
      console.log(error.error.errors);
      this.triggerAlert("Operación fallida!","danger");

      const unidadErrorMessage = error?.error?.errors?.[0];
      const idMarcaErrorMessage = error?.error?.$['.unidad']?.[0];

      if (unidadErrorMessage) {
        this.triggerAlert(unidadErrorMessage, "danger");
        console.log(unidadErrorMessage);
      } else if (idMarcaErrorMessage) {
        this.triggerAlert(idMarcaErrorMessage, "danger");
        console.log(unidadErrorMessage);
      } else {
        this.triggerAlert("Error al guardar la información en la API.", "danger");
        console.log(unidadErrorMessage);
      }
    });
  }

  resetForm(unidadForm?: NgForm){
    if(unidadForm != null)
    unidadForm.reset();
  }

 // Esta función se llama para mostrar la alerta
 triggerAlert(message: string, type : string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

}
