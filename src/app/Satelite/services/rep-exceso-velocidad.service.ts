import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { repExcesoVelocidad } from 'src/app/models/satelite/repExcesoVelocidad';

@Injectable({
  providedIn: 'root'
})
export class RepExcesoVelocidadService {
  private repExcesoVelocidadSource = new BehaviorSubject(new repExcesoVelocidad());
  repExcesoVelocidadActual = this.repExcesoVelocidadSource.asObservable();

  constructor(){}
  changeRepExcesoVelocidadSource(rep: repExcesoVelocidad){
      this.repExcesoVelocidadSource.next(rep);
  }

}
