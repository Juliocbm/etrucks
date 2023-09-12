import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Viaje } from '../../../../Interfaces/InformacionOperador';

@Component({
  selector: 'app-seleccion-viajes',
  templateUrl: './seleccion-viajes.component.html',
  styleUrls: ['./seleccion-viajes.component.css']
})
export class SeleccionViajesComponent {
  datosFiltradosViajes: Viaje[] = [];
  viajesCheck: Viaje[] = [];

  private originalViajesTotales: Viaje[] = [];

  /* @Input() ViajesTotales: Viaje[] = []; */
  @Input() 
  set ViajesTotales(viajes: Viaje[]) {
    this.originalViajesTotales = [...viajes];
    this.datosFiltradosViajes = [...viajes];
  }
  @Output() viajesSeleccionados = new EventEmitter<Viaje[]>();

  
 filtrarDatos(term: string) {
    if (!term) {
      this.datosFiltradosViajes = [...this.originalViajesTotales];
    } else {
      term = term.toLowerCase();
      this.datosFiltradosViajes = this.originalViajesTotales.filter(viaje => {
        return viaje.no_viaje.toString().includes(term);
      });
    }
  }

  toggleSelection(viaje: Viaje, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
  
    if (inputElement.checked) {
      // Añadir el viaje a ViajesSeleccionados
      this.viajesCheck.push(viaje);
      this.viajesSeleccionados.emit(this.viajesCheck);
    } else {
      // Remover el viaje de ViajesSeleccionados
      const index = this.viajesCheck.indexOf(viaje);
      if (index > -1) {
        this.viajesCheck.splice(index, 1);
        this.viajesSeleccionados.emit(this.viajesCheck);
      }
    }
  }
  

}


