import { Component } from '@angular/core';
import { ApiMarcaService } from '../../../../DataAccess/api-servicio-marca.service';
import { Marca } from '../../../../models/Mantenimiento/marca';
import { Router } from '@angular/router';
import { MarcaService } from '../../../Services/marca.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from '../../../../shared-module/components/confirmation-modal/confirmation-modal.component';



@Component({
  templateUrl: './marcas-view.component.html',
  styleUrls: ['./marcas-view.component.css']
})
export class MarcasViewComponent {
  //datos: any | undefined;
  datos: Marca[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Marca[] = [];

  modalRef: BsModalRef | undefined;

  constructor(
    private apiService: ApiMarcaService,
    private router: Router,
    private MarcaService: MarcaService,
    private modalService: BsModalService) { }

  promptDelete(id: string): void {
    this.modalRef = this.modalService.show(ConfirmationModalComponent);
    this.modalRef.content.message = "¿Estás seguro de que quieres eliminar este registro?";
    this.modalRef.content.confirmText = "Sí";
    this.modalRef.content.declineText = "No";

    this.modalRef.content.onConfirm = () => {
      this.borrarMarca(id);
    };
    this.modalRef.content.onDecline = () => {
      // Acciones en caso de que el usuario decline, si es necesario.
    };
  }

  ngOnInit(): void {
    this.apiService.obtenerDatos().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
        console.log(this.datosFiltrados);
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
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

  filtrarDatos(term: string) {
    if (!term) {
      this.datosFiltrados = this.datos;
    } else {
      term = term.toLowerCase();
      this.datosFiltrados = this.datos.filter(Marca => {
        return Marca.nombre.toLowerCase().includes(term)
        || Marca.descripcion.toLowerCase().includes(term);
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


  goToVerMarca(marca: Marca) {
    this.MarcaService.changeMarca(marca);
    this.router.navigate(['/marcas/verMarca']);
  }

  goToEditarMarca(marca: Marca) {
    this.MarcaService.changeMarca(marca);
    this.router.navigate(['/marcas/editarMarca']);
  }

  goToCrearMarca() {
    this.router.navigate(['/marcas/crearMarca']);
  }

  borrarMarca(id: string) {
    this.apiService.borrarMarca(id).subscribe(data => {
      console.log(data);
      this.triggerAlert("Marca eliminada exitosamente!", "success");
      this.datosFiltrados = this.datosFiltrados.filter((i: Marca) => i.idMarca !== id);
      console.log(this.datosFiltrados);
    }, error => {
      console.log(error);
      this.triggerAlert("Ocurrio un error al intentar eliminar la Marca!", "danger");
    });
  }


  cambiarEstadoMarca(marca: Marca) {
    const nuevoEstado = !marca.activo;
    this.apiService.actualizarDatos({ ...marca, activo: nuevoEstado }).subscribe(
      () => {
        marca.activo = nuevoEstado;
        this.triggerAlert(`Marca ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente!`, 'success');
      },
      error => {
        console.log(error);
        this.triggerAlert('Error al cambiar el estado de la marca', 'danger');
      }
    );
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
