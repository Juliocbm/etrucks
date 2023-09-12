import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Marca } from '../../models/Mantenimiento/marca';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  private marcaSource = new BehaviorSubject(new Marca());
  marcaActual = this.marcaSource.asObservable();

  constructor() { }

  changeMarca(marca: Marca) {
    this.marcaSource.next(marca);
  }


}
