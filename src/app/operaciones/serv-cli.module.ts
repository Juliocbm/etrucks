import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SharedModuleModule } from '../shared-module/shared-module.module';
import { BitacoraComponent } from './Bitacoras/bitacora/bitacora.component';
import { CrearBitacoraComponent } from './Bitacoras/crear-bitacora/crear-bitacora.component';
import { EditarBitacoraComponent } from './Bitacoras/editar-bitacora/editar-bitacora.component';
import { VerBitacoraComponent } from './Bitacoras/ver-bitacora/ver-bitacora.component';
import { DispOperadorComponent } from './Disp Operadores/disp-operador/disp-operador.component';
import { MPrioridadPedidosComponent } from './monitorPrioriPedidos/m-prioridad-pedidos/m-prioridad-pedidos.component';
import { DialogContentComponent } from './Disp Operadores/dialog/dialog-content.component';
import { FormsModule } from '@angular/forms';
import { VisitasComponent } from './Visitas/visitas/visitas.component';
import { ModalCrudVistasComponent } from './Visitas/modal-crud-vistas/modal-crud-vistas.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { OperadorPedidoTableComponent } from './Disp Operadores/operador-pedido-table/operador-pedido-table.component';
import { ModalCrudCteMrcaComponent } from './ClienteMarcaTractor/modal-crud-cte-mrca/modal-crud-cte-mrca.component';
import { ClienteMarcaTractorComponent } from './ClienteMarcaTractor/cliente-marca-tractor/cliente-marca-tractor.component';
import { VisitaNoLoggedComponent } from './Visitas/visita-no-logged/visita-no-logged.component';
import { ClienteOperadorVetComponent } from './ClienteOperadorVetado/cliente-operador-vet/cliente-operador-vet.component';
import { ModalCrudCteOpevComponent } from './ClienteOperadorVetado/modal-crud-cte-opev/modal-crud-cte-opev.component';

import { demorasRemolquesView } from './DemorasRemolques/demorasRemolques-view.component';
import { SeguridadOpWebAppViewComponent } from './seguridadOperadorWebApp/seguridad-op-web-app-view/seguridad-op-web-app-view.component';
import { ReporteSeguimientoGuiaComponent } from './reporte-seguimiento-guia/reporte-seguimiento-guia.component';


@NgModule({
  declarations: [
    BitacoraComponent,
    CrearBitacoraComponent,
    EditarBitacoraComponent,
    VerBitacoraComponent,
    DispOperadorComponent,
    MPrioridadPedidosComponent,
    DialogContentComponent,
    VisitasComponent,
    ModalCrudVistasComponent,
    OperadorPedidoTableComponent,
    VisitaNoLoggedComponent,
    ClienteMarcaTractorComponent,
    ModalCrudCteMrcaComponent,
    ClienteOperadorVetComponent,
    ModalCrudCteOpevComponent,
    demorasRemolquesView,
    SeguridadOpWebAppViewComponent,
    ReporteSeguimientoGuiaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModuleModule
  ]
})
export class ServCliModule { }
