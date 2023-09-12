import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MarcaService } from '../../../Services/marca.service';
import { ApiMarcaService } from '../../../../DataAccess/api-servicio-marca.service';
import { Marca } from '../../../../models/Mantenimiento/marca';

@Component({
  selector: 'app-editar-marca',
  templateUrl: './editar-marca.component.html',
  styleUrls: ['./editar-marca.component.css']
})
export class EditarMarcaComponent {
  marcaForm: FormGroup = new FormGroup({});
  marca: Marca;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private fb: FormBuilder, private marcaService: MarcaService, private apiMarcaService: ApiMarcaService)
  {
    this.marca = new Marca();
  }

  ngOnInit() {
    this.marcaService.marcaActual.subscribe(marca => this.marca = marca);


    this.marcaForm = this.fb.group({
      idMarca: [this.marca.idMarca],
      nombre: [this.marca.nombre],
      descripcion: [this.marca.descripcion],
      idTipoMarca: [this.marca.idTipoMarca],
      activo: [this.marca.activo],
      fechaCreacion: [this.marca.fechaCreacion],
      creadoPor: [this.marca.creadoPor],
      fechaModificacion: [this.marca.fechaModificacion ? this.marca.fechaModificacion : new Date()], // Asumiendo que quieres establecer la fecha actual si no hay una fecha previa de modificación.
      modificadoPor: [this.marca.modificadoPor]
    });

  }

  onSubmit() {
    console.log(this.marcaForm.value);
    this.apiMarcaService.actualizarDatos(this.marcaForm.value).subscribe(data => {
      console.log(this.marcaForm.value);
      this.triggerAlert("Marca actualizado exitosamente!", "success");
    }, error => {
      console.log(error.error.errors);
      this.triggerAlert("Fallo al actualizar marca!", "danger");
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
