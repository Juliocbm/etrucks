import { NgModule } from '@angular/core';

//modulos
import {  SharedModuleModule  } from '../shared-module/shared-module.module';

//componentes
/* import { CrearLiquidacionComponent } from './Components/catalogoLiquidacion/crear-liquidacion/crear-liquidacion.component'; */
//import { LiquidacionViewComponent } from './Components/catalogoLiquidacion/liquidacion-view/liquidacion-view.component';
import { EditarLiquidacionComponent } from './Components/catalogoLiquidacion/editar-liquidacion/editar-liquidacion.component';
import { VerLiquidacionComponent } from './Components/catalogoLiquidacion/ver-liquidacion/ver-liquidacion.component';
import { LiquidacionViewComponent } from './Components/Liquidacion/liquidacion-view/liquidacion-view.component';
import { SeleccionaOperadorComponent } from './Components/Liquidacion/seleccion-operador/seleccion-operador.component';
import { CrearLiquidacionComponent } from './Components/Liquidacion/crear-liquidacion/crear-liquidacion.component';
import { SeleccionViajesComponent } from './Components/Liquidacion/seleccion-viajes/seleccion-viajes.component';

@NgModule({
  declarations: [
    LiquidacionViewComponent,
    VerLiquidacionComponent,
    EditarLiquidacionComponent,
    SeleccionaOperadorComponent,    
    CrearLiquidacionComponent, SeleccionViajesComponent
  ],
  imports: [
    SharedModuleModule
  ],
})
export class DespachoModule { }
