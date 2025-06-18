import { Component } from '@angular/core';
import { Personal } from 'src/app/models/RH/personal';
import { NgForm } from '@angular/forms';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';

@Component({
  selector: 'app-crear-personal',
  templateUrl: './crear-personal.component.html',
  styleUrls: ['./crear-personal.component.css']
})
export class CrearPersonalComponent {
  personal: Personal;

  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(
    private apiRecHumanosService: ApiRecursosHumanosService
  ) {
    this.personal = new Personal();
  }

  onInputToUppercase(event: any, field: string) {
    if (field === 'nombre') {
      this.personal.nombre = event.target.value.toUpperCase();
    } else if (field === 'apellidoPaterno') {
      this.personal.apellidoPaterno = event.target.value.toUpperCase();
    } else if (field === 'apellidoMaterno') {
      this.personal.apellidoMaterno = event.target.value.toUpperCase();
    }
  }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(personalForm?: NgForm) {
    if (personalForm != null) {
      personalForm.resetForm();
    }
    this.personal = new Personal();
  }

  onSubmit(personalForm: NgForm) {
    const { idPersonal, ...idWithOutPersonal} =   this.personal;
    this.personal.activo = true;
    console.log(this.personal);

    this.apiRecHumanosService.enviarPersonal(this.personal).subscribe( data => {
      this.triggerAlert('Personal creado exitosamente!', 'success');
    },error => {
      console.error(error);
      this.triggerAlert('Operación fallida!', 'danger');
    });
  }

  // Esta función se llama para mostrar la alerta
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
