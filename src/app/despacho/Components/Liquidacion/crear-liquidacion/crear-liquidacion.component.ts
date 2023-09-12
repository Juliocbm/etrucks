import { Component } from '@angular/core';
import { ApiLiquidacionService } from '../../../../DataAccess/api-servicio-liquidacion-jcbm.service';
import { Operadores } from '../../../../models/Despacho/Liquidacion';
import { Viaje, Anticipo, Concepto } from '../../../../Interfaces/InformacionOperador';



@Component({
  selector: 'app-crear-liquidacion',
  templateUrl: './crear-liquidacion.component.html',
  styleUrls: ['./crear-liquidacion.component.css']
})
export class CrearLiquidacionComponent {
  showAlert = false;
  alertMessage = '';
  alertType = '';

  //operadorSelected: Operadores | null = null;
  operadorSelected: Operadores = new Operadores(); // Inicializar con un objeto vacío
  viajesTotales: Viaje[] = [];
  viajesSeleccionados: Viaje[] = [];
  // Obtener todos los anticipos
  todosLosAnticipos: Anticipo[] = [];
  conceptos: Concepto[] = [];

  nuevoConcepto: Concepto = {
    id_concepto: 0,  // Puedes generar un ID único o dejarlo como 0 si tu backend lo genera
    desc_concepto: '',
    monto: 0,
    total_concepto: 0,
    cantidad: 0
  };


  constructor(private apiService: ApiLiquidacionService) { }

  getDatosOperador(id_personal: number, compania: number | null): void {
    this.apiService.obtenerViajesAdeudos(id_personal, compania).subscribe(
      response => {
        this.viajesTotales = response.data.viajes;
        this.conceptos = response.data.conceptos;
        console.log("datos de operador", response);
        console.log("conceptos", this.conceptos);
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  getOperadorSelected(operador: Operadores) {
    console.log("Operador seleccionado:", operador);
    this.operadorSelected = operador;

    this.getDatosOperador(operador.id_personal!, 1);
  }

  verViajes(viajes: Viaje[]) {
    this.viajesSeleccionados = viajes;

    this.todosLosAnticipos = this.viajesSeleccionados.map(viaje => viaje.anticipos).flat();

    console.log('anticiposTotales', this.todosLosAnticipos);
  }

  modalEdicionConcepto(concepto: Concepto) {
    this.nuevoConcepto = { ...concepto };
  }

  editarConcepto() {
    // Encuentra el concepto y actualízalo
    const index = this.conceptos.findIndex(
      concepto => concepto.id_concepto === this.nuevoConcepto.id_concepto
    );

    if (index !== -1) {
      this.conceptos[index] = { ...this.nuevoConcepto };
    }

      // Restablecer nuevoConcepto para el próximo uso
      this.nuevoConcepto = {
        id_concepto: 0,
        desc_concepto: '',
        monto: 0,
        total_concepto: 0,
        cantidad: 0
      };

    this.closeModal('editModal');
  }


  eliminarConcepto(id_concepto: number) {
    this.conceptos = this.conceptos.filter(concepto => concepto.id_concepto !== id_concepto);
  }


  agregarConcepto() {
    // Aquí podrías validar el objeto nuevoConcepto antes de agregarlo
    console.log(this.nuevoConcepto);
    this.conceptos.push({ ...this.nuevoConcepto }); // Se agrega una copia del objeto para evitar referencias
    // Restablecer nuevoConcepto para el próximo uso
    this.nuevoConcepto = {
      id_concepto: 0,
      desc_concepto: '',
      monto: 0,
      total_concepto: 0,
      cantidad: 0
    };

    this.closeModal('exampleModal');
  }

  closeModal(id: string){
    // Cerrar el modal
    let modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';

      // También necesitarás eliminar la clase "modal-open" del <body>
      document.body.classList.remove('modal-open');

      // Y eliminar el elemento backdrop del DOM
      let backdrops = document.getElementsByClassName('modal-backdrop');
      while (backdrops.length > 0) {
        backdrops[0].parentNode?.removeChild(backdrops[0]);
      }
    }
  }
}
