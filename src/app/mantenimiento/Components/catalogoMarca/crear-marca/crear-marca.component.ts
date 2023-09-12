import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiMarcaService } from '../../../../DataAccess/api-servicio-marca.service';
import { Marca } from '../../../../models/Mantenimiento/marca';

@Component({
  selector: 'app-crear-marca',
  templateUrl: './crear-marca.component.html',
  styleUrls: ['./crear-marca.component.css']
})
export class FormCrearMarcaComponent {

  marca : Marca;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private apiMarcaService: ApiMarcaService) 
  { 
    this.marca = new Marca();
  }

  ngOnInit() {
    this.resetForm();
  }

  onSubmit(marcaForm: NgForm) {
    console.log(this.marca);
    this.marca.fechaCreacion = new Date();
    this.marca.fechaModificacion = new Date();
    console.log(this.marca.fechaCreacion);
    
    this.apiMarcaService.enviarDatos(this.marca).subscribe(data => {
      console.log(data);
      this.resetForm(marcaForm);
      //this.toastr.success('Operación exitosa', 'Cliente registrado');
      this.triggerAlert("Marca creado exitosamente!", "success");
    }, error => {
      console.log(error.error.errors);
      this.triggerAlert("Operación fallida!","danger");
    });
  }

  resetForm(marcaForm?: NgForm)
  {
    if(marcaForm != null)
    marcaForm.reset();
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
