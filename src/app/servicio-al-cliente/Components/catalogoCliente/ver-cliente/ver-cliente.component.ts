import { Component } from '@angular/core';
import { Cliente } from '../../../../models/ServicioAlCliente/cliente';
import { ClienteService } from '../../../Services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
  styleUrls: ['./ver-cliente.component.css']
})
export class VerClienteComponent {
  cliente: Cliente;

  constructor(private clienteService: ClienteService, private router: Router) {
    this.cliente = new Cliente();
  }

  ngOnInit() {
    this.clienteService.clienteActual.subscribe(cliente => this.cliente = cliente);
  }

  goToEditarCliente() {
    this.clienteService.changeCliente(this.cliente);
    this.router.navigate(['/clientes/editarCliente']);
  }
}
