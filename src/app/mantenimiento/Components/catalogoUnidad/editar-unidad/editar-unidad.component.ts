import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Unidad } from './../../../../models/Mantenimiento/unidad';
import { UnidadService } from '../../../Services/unidad.service'; // Importa tu servicio API aquí
import { ApiUnidadService } from '../../../../DataAccess/api-services-unidad.service';

@Component({
  selector: 'app-editar-unidad',
  templateUrl: './editar-unidad.component.html',
  styleUrls: ['./editar-unidad.component.css']
})
export class EditarUnidadComponent {
  unidadForm: FormGroup = new FormGroup({});
  cliente: Unidad;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private fb: FormBuilder, private clienteService: UnidadService, private apiUnidadesService: ApiUnidadService)
  {
    this.cliente = new Unidad();
  }

  ngOnInit() {
    this.clienteService.unidadActual.subscribe(cliente => this.cliente = cliente);


    this.unidadForm = this.fb.group({
      idUnidad: [this.cliente.idUnidad],
      idCompania: [this.cliente.idCompania],
      clave: [this.cliente.clave],
      descripcion: [this.cliente.descripcion],
      noSerie: [this.cliente.noSerie],
      modelo: [this.cliente.modelo],
      placas: [this.cliente.placas],
      idMarca: [this.cliente.idMarca],
      idTipoUnidad: [this.cliente.idTipoUnidad],
      activo: [this.cliente.activo],
      creadoPor: [this.cliente.creadoPor],
      modificadoPor: [this.cliente.modificadoPor],
      fechaCreacion: [new Date()],
      fechaModificacion: [new Date()]

    });
  }

  onSubmit() {
    console.log(this.unidadForm.value);
    this.apiUnidadesService.actualizarDatos(this.unidadForm.value).subscribe(data => {
      console.log(this.unidadForm.value);
      this.triggerAlert("Unidades actualizado exitosamente!", "success");
    }, error => {
      console.log(error.error.errors);
      this.triggerAlert("Fallo al actualizar la unidad!", "danger");
    });
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
