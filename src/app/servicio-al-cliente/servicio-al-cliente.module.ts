import { NgModule } from '@angular/core';
//import { ModalModule } from 'ngx-bootstrap/modal';

//modulos
import { SharedModuleModule } from '../shared-module/shared-module.module';

//componentes
import { VerClienteComponent } from './Components/catalogoCliente/ver-cliente/ver-cliente.component';
import { EditarClienteComponent } from './Components/catalogoCliente/editar-cliente/editar-cliente.component';
import { ClientesViewComponent } from './Components/catalogoCliente/clientes-view/clientes-view.component';
import { FormCrearClienteComponent } from './Components/catalogoCliente/crear-cliente/crear-cliente.component';


@NgModule({
  declarations: [
    VerClienteComponent,
    EditarClienteComponent,
    ClientesViewComponent,
    FormCrearClienteComponent
  ],
  imports: [
    SharedModuleModule
  ]
})
export class ServicioAlClienteModule { }
