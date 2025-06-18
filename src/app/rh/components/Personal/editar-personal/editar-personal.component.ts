// import { ApiRecursosHumanosService } from './../../../../DataAccess/api-recursos-humanos.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Personal } from './../../../../models/RecursosHumanos/personal';
import { StorageService } from '../../../../Services/StorageService';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { Personal } from 'src/app/models/RH/personal';

@Component({
  selector: 'app-editar-personal',
  templateUrl: './editar-personal.component.html',
  styleUrls: ['./editar-personal.component.css']
})
export class EditarPersonalComponent implements OnInit {
  personalForm: FormGroup = new FormGroup({});
  personal: Personal = new Personal();
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private fb: FormBuilder, private apiRecHumanosService: ApiRecursosHumanosService, private storageService: StorageService<Personal>
    ) { }

  onInputToUppercase(event: any, field: string) {
    if (field === 'nombre') {
      this.personalForm.get('nombre')?.setValue(event.target.value.toUpperCase());
    } else if (field === 'apellidoPaterno') {
      this.personalForm.get('apellidoPaterno')?.setValue(event.target.value.toUpperCase());
    } else if (field === 'apellidoMaterno') {
      this.personalForm.get('apellidoMaterno')?.setValue(event.target.value.toUpperCase());
    }
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.storageService.init('personalActual');

    this.storageService.itemActual.subscribe(personal => {
      if (personal) {
        this.personal = personal;
      } else {
        console.log("Al no haber un elemento en guardado en sesion, debemos redirigir a otra pantalla o mostrar mensaje.");
      }
    });

    this.personalForm = this.fb.group({
      idPersonal: [this.personal.idPersonal],
      nombre: [this.personal.nombre, Validators.required],
      apellidoPaterno: [this.personal.apellidoPaterno, Validators.required],
      apellidoMaterno: [this.personal.apellidoMaterno, Validators.required],
      email: [this.personal.email],
      idSucursal: [this.personal.idSucursal],
      idCompania: [this.personal.idCompania, Validators.required],
      idDepartamento: [this.personal.idDepartamento],
      idCategoria: [this.personal.idCategoria, Validators.required],
      noNomina: [this.personal.noNomina],
      activo: [this.personal.activo],
      fechaCreacion: [this.personal.fechaCreacion],
      creadoPor: [this.personal.creadoPor],
      fechaModificacion: [this.personal.fechaModificacion],
      modificadoPor: [this.personal.modificadoPor],
    });
  }

  onSubmit() {
    console.log(this.personalForm.value);
    this.apiRecHumanosService.actualizarPersonal(this.personalForm.value).subscribe(
      (data) => {
        console.log(data);
        console.log(this.personalForm.value);
        this.triggerAlert('Sucursal actualizada exitosamente!', 'success');
      },
      (error) => {
        console.log(error.error.errors);
        this.triggerAlert('Fallo al actualizar la sucursal!', 'danger');
      }
    );
  }


  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}
