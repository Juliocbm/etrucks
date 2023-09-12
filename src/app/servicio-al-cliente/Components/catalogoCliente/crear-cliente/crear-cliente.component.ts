import { Component } from '@angular/core';
import { ApiServicioClienteService } from '../../../../DataAccess/api-servicio-cliente.service';
import { NgForm } from '@angular/forms';
import { Cliente } from '../../../../models/ServicioAlCliente/cliente';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class FormCrearClienteComponent {

  cliente : Cliente;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private apiClienteService: ApiServicioClienteService) 
  { 
    this.cliente = new Cliente();
  }

  ngOnInit() {
    this.resetForm();
  }

  onSubmit(clienteForm: NgForm) {
    console.log(this.cliente);
    this.cliente.fechaCreacion = new Date();
    this.cliente.fechaModificacion = new Date();
    console.log(this.cliente.fechaCreacion);
    
    this.apiClienteService.enviarDatos(this.cliente).subscribe(data => {
      console.log(data);
      this.resetForm(clienteForm);
      //this.toastr.success('Operación exitosa', 'Cliente registrado');
      this.triggerAlert("Cliente creado exitosamente!", "success");
    }, error => {
      console.log(error.error.errors);
      this.triggerAlert("Operación fallida!","danger");
    });
  }

  resetForm(clienteForm?: NgForm)
  {
    if(clienteForm != null)
    clienteForm.reset();
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
