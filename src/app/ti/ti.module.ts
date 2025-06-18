import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleModule } from '../shared-module/shared-module.module';

import { MttoEquipoComputoView } from './Components/reportes/mttoEquipoComputo/mttoEquipoComputo-view.component';
import { MonitorTimbradoComponent } from './Components/monitor/monitor-timbrado/monitor-timbrado.component';
import { BloqueosdbComponent } from './Components/monitor/bloqueosdb/bloqueosdb.component';
import { DashboardComponent } from './Components/cfdi/dashboard/dashboard.component';
import { DashboardComponentLis } from './Components/lis/dashboard/dashboard-envio-xml.component';

import { ZamComponent } from './Components/cfdi/dashboard/Zam-tab/zam/zam.component';



// import { UbicacionesComponent } from './Components/cfdi/dashboard/Ubicaciones-tab/ubicaciones/ubicaciones.component';
// import { RemisionComponent } from './Components/cfdi/dashboard/remision-tab/remision/remision.component';
// import { PedidoComponent } from './Components/cfdi/dashboard/pedido-tab/pedido/pedido.component';
// import { MercanciasComponent } from './Components/cfdi/dashboard/mercancias-tab/mercancias/mercancias.component';
// import { InternacionalComponent } from './Components/cfdi/dashboard/internacional-tab/internacional/internacional.component';
// import { DocRelacionadosComponent } from './Components/cfdi/dashboard/docrelacionados-tab/docRelacionados/docRelacionados.component';


import { ConceptosComponent } from './Components/cfdi/dashboard/Conceptos-tab/conceptos/conceptos.component';

import { ModalErrorsValidationsComponent } from './Components/cfdi/dashboard/modal-errors-validations/modal-errors-validations/modal-errors-validations.component'
import { ErrorDetailModalComponent } from './Components/cfdi/error-detail-modal/error-detail-modal.component';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import { ListadoFacturasErrorComponent } from './Components/lis/Listado-facturas-error/listado-facturas-error/listado-facturas-error.component';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';

import { UbicacionesComponent } from './Components/cfdi/dashboard/Ubicaciones-tab/ubicaciones/ubicaciones.component';
import { RemisionComponent } from './Components/cfdi/dashboard/Remision-tab/remision/remision.component';
import { PedidoComponent } from './Components/cfdi/dashboard/Pedido-tab/pedido/pedido.component';
import { MercanciasComponent } from './Components/cfdi/dashboard/Mercancias-tab/mercancias/mercancias.component';
import { InternacionalComponent } from './Components/cfdi/dashboard/Internacional-tab/internacional/internacional.component';
import { DocRelacionadosComponent } from './Components/cfdi/dashboard/DocRelacionados-tab/docRelacionados/docRelacionados.component';

import { ListadoLiquidacionesComponent } from './Components/cfdiLiquidacion/Listado-liquidaciones/listado-liquidaciones/listado-liquidaciones.component';

@NgModule({
  declarations: [
    MttoEquipoComputoView,
    MonitorTimbradoComponent,
    BloqueosdbComponent,
    DashboardComponent,
    DashboardComponentLis,
    ErrorDetailModalComponent,
    ListadoFacturasErrorComponent,
    ListadoLiquidacionesComponent,

    ZamComponent,
    UbicacionesComponent,
    RemisionComponent,
    PedidoComponent,
    MercanciasComponent,
    InternacionalComponent,
    DocRelacionadosComponent,
    ConceptosComponent,
    ModalErrorsValidationsComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    MatTableModule, 
    MatButtonModule,
    MatStepperModule,
    MatTabsModule,
    MatSortModule,
    MatExpansionModule
  ]
})
export class TIModule { }
