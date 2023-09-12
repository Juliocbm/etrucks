import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Liquidacion,DetalleLiquidacion } from './../../models/Despacho/Liquidacion';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {
  obtenerLiquidacion() {
    throw new Error('Method not implemented.');
  }

  // Asegúrate de proporcionar un objeto con las propiedades adecuadas al constructor de Liquidacion
  private liquidacionSource = new BehaviorSubject(new Liquidacion());
  liquidacionActual = this.liquidacionSource.asObservable();

  constructor() { }

  changeLiquidacion(liquidacion: Liquidacion) {
    this.liquidacionSource.next(liquidacion);
  }
}
