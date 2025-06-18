import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExcesoVelocidadComponent } from './components/exceso-velocidad/exceso-velocidad.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ReporteSeguimientoViajeComponent } from './components/reporteViajes/reporte-seguimiento-viaje/reporte-seguimiento-viaje.component';
import { ModalDetalleViajeComponent } from './components/reporteViajes/modal-detalle-viaje/modal-detalle-viaje.component';
import { SucursalGeocercaViewComponent } from './components/sucursal-geocerca/sucursal-geocerca-view/sucursal-geocerca-view.component';
import { ModalCrudSucursalGeocercaComponent } from './components/sucursal-geocerca/modal-crud-sucursal-geocerca/modal-crud-sucursal-geocerca.component';
import { SucursalGeocercaMapComponent } from './components/sucursal-geocerca/sucursal-geocerca-map/sucursal-geocerca-map.component';
import { TrazabilidadViajesViewComponent } from './components/trazabilidad/trazabilidad-viajes-view/trazabilidad-viajes-view.component';
import { TrazabilidadViajesDetailComponent } from './components/trazabilidad/trazabilidad-viajes-detail/trazabilidad-viajes-detail.component';
@NgModule({
  declarations: [
    ExcesoVelocidadComponent,
    ReporteSeguimientoViajeComponent,
    ModalDetalleViajeComponent,
    SucursalGeocercaViewComponent,
    ModalCrudSucursalGeocercaComponent,
    SucursalGeocercaMapComponent,
    TrazabilidadViajesViewComponent,
    TrazabilidadViajesDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ]
})
export class SateliteModule { }
