import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiUnidadService } from '../../../../DataAccess/api-services-unidad.service';
import { Unidad } from '../../../../models/Mantenimiento/unidad';
import { Router } from '@angular/router';
import { UnidadService } from '../../../Services/unidad.service'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  //selector: 'app-unidad-view',
  templateUrl: './unidad-view.component.html',
  styleUrls: ['./unidad-view.component.css']
})
export class UnidadViewComponent {
  //datos: any | undefined;
  datos: Unidad[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Unidad[] = [];

  modalRef: BsModalRef | undefined;

  constructor(
  private apiService: ApiUnidadService,
  private router: Router,
  private unidadService: UnidadService,
  private modalService: BsModalService ) { }

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

filtrarDatos(term: string) {
  console.log(term);
  if (!term) {
    this.datosFiltrados = this.datos;
  } else {
    term = term.toLowerCase();
    this.datosFiltrados = this.datos.filter(unidad => {
      return unidad.clave.toLowerCase().includes(term)
      || unidad.descripcion.toLowerCase().includes(term)
      || unidad.modelo.toString().toLowerCase().includes(term)
      || unidad.noSerie.toLowerCase().includes(term)
      || unidad.placas.toLowerCase().includes(term);
    });
  }
  }
  filtrarActivos(clave: boolean) {
    if (!clave) {
      this.datosFiltrados = this.datos;
    } else {

      this.datosFiltrados = this.datosFiltrados.filter(unidad => {
        return unidad.activo;
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


goToVerUnidad(unidad: Unidad) {
  this.unidadService.changeUnidad(unidad);
  this.router.navigate(['/unidades/verUnidad']);
}

goToEditarUnidad(unidad: Unidad) {
  this.unidadService.changeUnidad(unidad);
  this.router.navigate(['/unidades/editarUnidad']);
}

goToCrearUnidad() {
  this.router.navigate(['/unidades/crearUnidad']);
}

  borrarUnidad(id: number,id2: number) {
    changeDetection: ChangeDetectionStrategy.OnPush
    this.apiService.borrarDatos(id,id2).subscribe(data => {

    console.log(id);
    this.triggerAlert("Unidad eliminada exitosamente!", "success");
    this.datos = this.datos.filter((i: Unidad) => i.idUnidad !== id);
    console.log(this.datos);
  }, error => {
    console.log(error.error.errors);
    this.triggerAlert("Ocurrio un error al intentar eliminar la unidad!", "danger");
  });
}


  cambiarEstadoUnidad(unidad: Unidad) {
    const nuevoEstado = !unidad.activo;
    this.apiService.actualizarDatos({ ...unidad, activo: nuevoEstado }).subscribe(
      () => {
        unidad.activo = nuevoEstado;
        this.triggerAlert(`Unidad ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente!`, 'success');
      },
      error => {
        console.log(error);
        this.triggerAlert('Error al cambiar el estado de la unidad', 'danger');
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
