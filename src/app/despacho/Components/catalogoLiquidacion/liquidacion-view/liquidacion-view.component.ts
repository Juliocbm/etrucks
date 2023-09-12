import { Component } from '@angular/core';
import { Liquidacion, Operadores, DetalleLiquidacion } from './../../../../models/Despacho/Liquidacion';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiLiquidacionService } from '../../../../DataAccess/api-servicio-liquidacion.service';
import { LiquidacionService } from '../../../Services/liquidacion.service';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liquidacion-view',
  templateUrl: './liquidacion-view.component.html',
  styleUrls: ['./liquidacion-view.component.css']
})
export class LiquidacionViewComponent {
  datos: Liquidacion[] = [];
  datosFiltrados: Liquidacion[] = [];
  detalleLiquidacion: DetalleLiquidacion[] = [];
  liquidacionSeleccionada: Liquidacion | null = null;
  operadorSeleccionado: string = ''; // Agrega esta propiedad para el operador seleccionado


  datosOperadores: Operadores[] = [];
  datosFiltradosOperadores: Operadores[] = [];
  operadoresSeleccionados: number[] = [];
  selectedOperador: Operadores | null = null;

  showAlert = false;
  alertMessage = '';
  alertType = '';
  modalRef: BsModalRef | undefined;
  segundoModalIsOpen: BsModalRef | undefined;

  selectedDate: Date = new Date();




  firstModalIsOpen = false; // Variable para controlar el primer modal
  secondModalIsOpen = false; // Variable para controlar el segundo modal

  openFirstModal() {
    this.closeSecondModall();
    this.firstModalIsOpen = true;
  }

  closeFirstModal() {
    this.firstModalIsOpen = false;
  }

  openSecondModall() {
    if (this.operadoresSeleccionados.length > 0) {
      this.closeFirstModal(); // Cerrar primer modal
      this.secondModalIsOpen = true; // Abrir segundo modal
    }else{
      console.log('No se puede seguir');
    }
  }

  closeSecondModall() {
    this.secondModalIsOpen = false;
  }


  constructor(
    private apiService: ApiLiquidacionService,
    private router: Router,
    private LiquidacionService: LiquidacionService,
    private modalService: BsModalService
     ) { }


  ngOnInit(): void {
    this.apiService.obtenerDatos().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );

    this.apiService.obtenerDatosOperadores().subscribe(
      response => {
        this.datosOperadores = response;
        this.datosFiltradosOperadores = this.datosOperadores;
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
      this.datosFiltrados = this.datos.filter(liq => {
        return liq.no_liquidacion?.toPrecision().includes(term)
        || liq.operador?.toLocaleString().toLowerCase().includes(term)
        || liq.liquidado_por?.toLocaleString().toLowerCase().includes(term)
        || liq.monto?.toPrecision().includes(term);
      });
    }
  }

  filtrarActivos(clave: boolean) {
    if (!clave) {
      this.datosFiltrados = this.datos;
    } else {
      this.datosFiltrados = this.datos.filter(unidad => {
        //return unidad.estado === 'A' || unidad.estado === null;
      });
    }
  }

  //Modal de la informacion de Operadores
  filtrarDatosOperadores(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    if (!term) {
      this.datosFiltradosOperadores = this.datosOperadores;
    } else {
      const lowercaseTerm = term.toLowerCase();
      this.datosFiltradosOperadores = this.datosOperadores.filter(operador => {
        return operador.id_personal?.toPrecision().includes(lowercaseTerm)
          || operador.nom_operador?.toLowerCase().includes(lowercaseTerm);
      });
    }
  }

  // Función para manejar el cambio de selección de operador
  onOperadorSelectedChange(event: any, detalle: Operadores) {
    const idOperador = detalle.id_personal;
    if (typeof idOperador === 'number') {
      if (event.target.checked) {
        this.operadoresSeleccionados.push(idOperador);
        this.selectedOperador = detalle;
      } else {
        this.selectedOperador = null;
        const index = this.operadoresSeleccionados.indexOf(idOperador);
        if (index !== -1) {
          this.operadoresSeleccionados.splice(index, 1);
        }
      }
    }
  }

  filtrarPorFecha(event: { startDate: Date, endDate: Date }) {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Establecer la hora, minutos, segundos y milisegundos en 0
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999); // Establecerlo al final del día

    this.datosFiltrados = this.datos.filter(dato => {
      const fechaCreacion = new Date(dato.fecha_liquidacion);
      fechaCreacion.setHours(0, 0, 0, 0); // Ignorar la parte de la hora
      return fechaCreacion >= startDate && fechaCreacion <= endDate;
    });
  }

  onDateRangeCleared() {
    this.datosFiltrados = this.datos;
  }

  goToVerLiquidacion(liquidacion: Liquidacion) {
  this.LiquidacionService.changeLiquidacion(liquidacion);
  this.router.navigate(['liquidaciones/verLiquidacion']);
  }

  goToEditarLiquidacion(liquidacion: Liquidacion) {
  this.LiquidacionService.changeLiquidacion(liquidacion);
  this.router.navigate(['liquidaciones/editarLiquidacion']);
  }

  goToCrearLiquidacion() {
  this.router.navigate(['liquidaciones/crearLiquidacion']);
  }


  /* Esta funcion se llama al Modal para abrir o cerrar en la vista principal y agregado en el navbar */
  modalIsOpen = false;

  openCrearModal(mode: 'crear' | 'editar', liquidacion?: Liquidacion) {
    if (mode === 'crear') {
      this.liquidacionSeleccionada = null; // Reiniciar la liquidación seleccionada
      this.operadorSeleccionado = ''; // Reiniciar el operador seleccionado
      this.modalIsOpen = true;
    } else if (mode === 'editar' && liquidacion) {
      this.liquidacionSeleccionada = liquidacion;
      this.operadorSeleccionado = liquidacion.operador;
      this.modalIsOpen = true;
    }
  }

  // Función para abrir el segundo modal
  openSecondModal() {

    if (this.operadoresSeleccionados.length = 1 ) {
      this.modalIsOpen = false;
      if (this.modalRef) {
        this.modalRef.hide();
      }
      this.modalRef = this.modalService.show('exampleModalToggle2'); // Usamos this.modalRef para manejar el modal abierto
    } else {
      console.log('Selecciona al menos un operador antes de continuar.');
      // Puedes mostrar una alerta o mensaje al usuario si no hay operadores seleccionados
    }
  }

  closeCrearModal() {
    this.modalIsOpen = false;
  }

  closeSecondModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
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
