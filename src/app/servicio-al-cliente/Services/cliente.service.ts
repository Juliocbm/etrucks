import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cliente } from '../../models/ServicioAlCliente/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private clienteSource = new BehaviorSubject(new Cliente());
  clienteActual = this.clienteSource.asObservable();

  constructor() { }

  changeCliente(cliente: Cliente) {
    this.clienteSource.next(cliente);
  }


}
