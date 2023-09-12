import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Cliente } from '../../../../models/ServicioAlCliente/cliente';
import { ClienteService } from '../../../Services/cliente.service';
import { ApiServicioClienteService } from '../../../../DataAccess/api-servicio-cliente.service';

@Component({
  selector: 'app-editar-cliente',
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css']
})
export class EditarClienteComponent {
  clienteForm: FormGroup = new FormGroup({});
  cliente: Cliente;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private apiClienteService: ApiServicioClienteService) 
  {
    this.cliente = new Cliente();
  }

  ngOnInit() {
    this.clienteService.clienteActual.subscribe(cliente => this.cliente = cliente);


    this.clienteForm = this.fb.group({
      idCliente: [this.cliente.idCliente],
      noCliente: [this.cliente.noCliente],
      nombre: [this.cliente.nombre],
      activo: [this.cliente.activo],
      creadoPor: [this.cliente.creadoPor],
      modificadoPor: [this.cliente.modificadoPor],
      razonSocial: [this.cliente.razonSocial],
      rfc: [this.cliente.rfc],
      dirCalle: [this.cliente.dirCalle],
      dirCodigoP: [this.cliente.dirCodigoP],
      dirColonia: [this.cliente.dirColonia],
      dirCorreo: [this.cliente.dirCorreo],
      dirEstado: [this.cliente.dirEstado],
      dirLocalidad: [this.cliente.dirLocalidad],
      dirMunicipio: [this.cliente.dirMunicipio],
      dirNoExt: [this.cliente.dirNoExt],
      dirNoInt: [this.cliente.dirNoInt],
      dirReferencias: [this.cliente.dirReferencias],
      dirTelefono: [this.cliente.dirTelefono],
      logoPath: [this.cliente.logoPath],
      fechaModificacion: [new Date()]
    });
  }

  onSubmit() {
    console.log(this.clienteForm.value);
    this.apiClienteService.actualizarDatos(this.clienteForm.value).subscribe(data => {
      console.log(this.clienteForm.value);
      this.triggerAlert("Cliente actualizado exitosamente!", "success");
    }, error => {
      console.log(error.error.errors);
      this.triggerAlert("Fallo al actualizar cliente!", "danger");
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
