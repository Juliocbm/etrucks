import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Unidad } from './../../models/Mantenimiento/unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  private unidadSource = new BehaviorSubject(new Unidad());
  unidadActual = this.unidadSource.asObservable();

  constructor() { }

  changeUnidad(unidad: Unidad) {
    this.unidadSource.next(unidad);
  }
}
