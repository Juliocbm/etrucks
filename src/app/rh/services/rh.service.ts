import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { repAdeudosModel } from 'src/app/models/RH/repAdeudos';

@Injectable({
  providedIn: 'root'
})
export class RhService {
  private repExcesoVelocidadSource = new BehaviorSubject(new repAdeudosModel());
  repExcesoVelocidadActual = this.repExcesoVelocidadSource.asObservable();

  constructor(){}
  changeRepExcesoVelocidadSource(rep: repAdeudosModel){
      this.repExcesoVelocidadSource.next(rep);
  }

}
