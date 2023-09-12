import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiServicioClienteService } from '../../../../DataAccess/api-servicio-cliente.service';
import { Cliente } from '../../../../models/ServicioAlCliente/cliente';
import { Router } from '@angular/router';
import { ClienteService } from '../../../Services/cliente.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.component';

import { GeneralParametersService } from '../../../../shared-module/services/general-parameters.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './clientes-view.component.html',
  styleUrls: ['./clientes-view.component.css']
})
export class ClientesViewComponent implements OnInit, OnDestroy {
  //datos: any | undefined;
  datos: Cliente[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Cliente[] = [];
  modalRef: BsModalRef | undefined;

  private companySubscription: Subscription | undefined; // Cambio aquí
  selectedCompany: string | null = null; // Inicializar como null


  constructor(
    private apiService: ApiServicioClienteService,
    private router: Router,
    private clienteService: ClienteService,
    private modalService: BsModalService,
    private generalParametersService: GeneralParametersService) { }

  ngOnInit(): void {
    
    this.companySubscription = this.generalParametersService.selectedCompany$.subscribe(
      company => {
        this.selectedCompany = company;
      }
    );

    this.apiService.obtenerDatos().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
        console.log(this.selectedCompany);
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.companySubscription) {
      this.companySubscription.unsubscribe();
    }
  }


  filtrarDatos(term: string) {
    if (!term) {
      this.datosFiltrados = this.datos;
    } else {
      term = term.toLowerCase();
      this.datosFiltrados = this.datos.filter(cliente => {
        return cliente.nombre.toLowerCase().includes(term)
          || cliente.rfc.toLowerCase().includes(term)
          || cliente.razonSocial.includes(term)
          || cliente.noCliente.toString().includes(term);
      });
    }
  }

  filtrarPorFecha(event: { startDate: Date, endDate: Date }) {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    // Establecer la hora, minutos, segundos y milisegundos en 0
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999); // Establecerlo al final del día
  
    this.datosFiltrados = this.datos.filter(dato => {
      const fechaCreacion = new Date(dato.fechaCreacion);
      fechaCreacion.setHours(0, 0, 0, 0); // Ignorar la parte de la hora
      return fechaCreacion >= startDate && fechaCreacion <= endDate;
    });
  }
  
  onDateRangeCleared() {
    this.datosFiltrados = this.datos;
  }
  

  filtrarActivos(clave: boolean) {
    if (!clave) {
      this.datosFiltrados = this.datos;
    } else {

      this.datosFiltrados = this.datosFiltrados.filter(marca => {
        return marca.activo;
      });
    }
  }

  goToVerCliente(cliente: Cliente) {
    this.clienteService.changeCliente(cliente);
    this.router.navigate(['/clientes/verCliente']);
  }

  goToEditarCliente(cliente: Cliente) {
    this.clienteService.changeCliente(cliente);
    this.router.navigate(['/clientes/editarCliente']);
  }

  goToCrearCliente() {
    this.router.navigate(['/clientes/crearCliente']);
  }

  promptDelete(id: string): void {
    this.modalRef = this.modalService.show(ConfirmationModalComponent);
    this.modalRef.content.message = "¿Estás seguro de que quieres eliminar este registro?";
    this.modalRef.content.confirmText = "Sí";
    this.modalRef.content.declineText = "No";

    this.modalRef.content.onConfirm = () => {
      this.borrarCliente(id);
    };
    this.modalRef.content.onDecline = () => {
      // Acciones en caso de que el usuario decline, si es necesario.
    };
  }


  cambiarEstadoUnidad(cliente: Cliente) {
    const nuevoEstado = !cliente.activo;
    this.apiService.actualizarDatos({ ...cliente, activo: nuevoEstado }).subscribe(
      () => {
        cliente.activo = nuevoEstado;
        this.triggerAlert(`Unidad ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente!`, 'success');
      },
      error => {
        console.log(error);
        this.triggerAlert('Error al cambiar el estado de la unidad', 'danger');
      }
    );
  }

  borrarCliente(id: string) {
    this.apiService.borrarCliente(id).subscribe(data => {
      console.log(data);
      this.triggerAlert("Cliente eliminado exitosamente!", "success");
      this.datosFiltrados = this.datosFiltrados.filter((i: Cliente) => i.idCliente !== id);
      console.log(this.datosFiltrados);
    }, error => {
      console.log(error);
      this.triggerAlert("Ocurrio un error al intentar eliminar el cliente!", "danger");
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
