import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleModule } from '../shared-module/shared-module.module';
import { PedidosPrioridadComponent } from './Pedidos/pedidos-prioridad/pedidos-prioridad.component';
import { ViewClientesAlternosEdiComponent } from './catalogos/crud-clientes-alternos-edi/view-clientes-alternos-edi/view-clientes-alternos-edi.component';
import { ModalCrudClientesAlternosEdiComponent } from './catalogos/crud-clientes-alternos-edi/modal-crud-clientes-alternos-edi/modal-crud-clientes-alternos-edi.component';

@NgModule({
  declarations: [
    PedidosPrioridadComponent,
    ViewClientesAlternosEdiComponent,
    ModalCrudClientesAlternosEdiComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ]
})
export class ServicioClienteModule { }
