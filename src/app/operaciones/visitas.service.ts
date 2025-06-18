import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Visita } from '../models/Operaciones/Visita';

@Injectable({
  providedIn: 'root'
})
export class VisitasService {
  private registroVisitaSource = new BehaviorSubject(new Visita());
  registroVisitaActual = this.registroVisitaSource.asObservable();

  constructor() { }
  changeRegistroVisitaSource(rep: Visita){
      this.registroVisitaSource.next(rep);
  }
}
