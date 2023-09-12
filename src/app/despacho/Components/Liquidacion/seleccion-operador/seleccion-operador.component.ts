import { Component, Output, EventEmitter } from '@angular/core';
import { ApiLiquidacionService } from '../../../../DataAccess/api-servicio-liquidacion-jcbm.service';
import { Operadores } from '../../../../models/Despacho/Liquidacion';

@Component({
  selector: 'app-seleccion-operador',
  templateUrl: './seleccion-operador.component.html',
  styleUrls: ['./seleccion-operador.component.css']
})
export class SeleccionaOperadorComponent {

  operadorSeleccionado: string = ''; // Agrega esta propiedad para el operador seleccionado
  datosOperadores: Operadores[] = [];
  datosFiltradosOperadores: Operadores[] = [];
  operadoresSeleccionados: number[] = [];
  selectedOperador: Operadores | null = null;

  showAlert = false;
  alertMessage = '';
  alertType = '';

  @Output() operadorSelect = new EventEmitter<Operadores>();

  constructor(
    private apiService: ApiLiquidacionService
  ) { }

  ngOnInit(): void {

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

  onOperadorSelectedChange(operador: Operadores) {
    this.selectedOperador = operador;
    this.operadorSelect.emit(operador);
  }
}
