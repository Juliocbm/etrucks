import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ElementoDetalle } from '../../../app/models/SistemaGeneral/ElementoDetalle';


@Injectable({
  providedIn: 'root'
})
export class CatalogoGeneralService {

  constructor() { }

  private regGeneralSource = new BehaviorSubject(new ElementoDetalle());
  regGeneralSourceActual = this.regGeneralSource.asObservable();

  changeRegistroGeneral(registro: ElementoDetalle) {
    this.regGeneralSource.next(registro);
  }
  
  
}
