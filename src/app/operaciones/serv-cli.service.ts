import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bitacora } from '../models/Serv. Cliente/Bitacora';

@Injectable({
  providedIn: 'root'
})
export class ServCliService {
  private RegServicioCLienteSource = new BehaviorSubject(new Bitacora());
  RegServicioCLienteActual = this.RegServicioCLienteSource.asObservable();

  constructor(){}
  changeRegistroBitacoraSource(rep: Bitacora){
      this.RegServicioCLienteSource.next(rep);
  }
}
