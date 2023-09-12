import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard'


import { ClientesViewComponent } from './servicio-al-cliente/Components/catalogoCliente/clientes-view/clientes-view.component';
import { FormCrearClienteComponent } from './servicio-al-cliente/Components/catalogoCliente/crear-cliente/crear-cliente.component'
import { VerClienteComponent } from './servicio-al-cliente/Components/catalogoCliente/ver-cliente/ver-cliente.component';
import { EditarClienteComponent } from './servicio-al-cliente/Components/catalogoCliente/editar-cliente/editar-cliente.component';


import { VerMarcaComponent } from './mantenimiento/Components/catalogoMarca/ver-marca/ver-marca.component';
import { EditarMarcaComponent } from './mantenimiento/Components/catalogoMarca/editar-marca/editar-marca.component';
import { MarcasViewComponent } from './mantenimiento/Components/catalogoMarca/marcas-view/marcas-view.component';
import { FormCrearMarcaComponent } from './mantenimiento/Components/catalogoMarca/crear-marca/crear-marca.component';


import { UnidadViewComponent } from './mantenimiento/Components/catalogoUnidad/unidad-view/unidad-view.component'
import { CrearUnidadComponent } from './mantenimiento/Components/catalogoUnidad/crear-unidad/crear-unidad.component'
import { VerUnidadComponent } from './mantenimiento/Components/catalogoUnidad/ver-unidad/ver-unidad.component'
import { EditarUnidadComponent } from './mantenimiento/Components/catalogoUnidad/editar-unidad/editar-unidad.component'
import { LoginComponent } from './security/components/login/login.component';


//componentes
//import { LiquidacionViewComponent } from '../app/despacho/Components/catalogoLiquidacion/liquidacion-view/liquidacion-view.component';
import { CrearLiquidacionComponent } from '../app/despacho/Components/Liquidacion/crear-liquidacion/crear-liquidacion.component';
import { VerLiquidacionComponent } from '../app/despacho/Components/catalogoLiquidacion/ver-liquidacion/ver-liquidacion.component';
import { EditarLiquidacionComponent } from '../app/despacho/Components/catalogoLiquidacion/editar-liquidacion/editar-liquidacion.component';

import { LiquidacionViewComponent } from '../app/despacho/Components/Liquidacion/liquidacion-view/liquidacion-view.component';
//import { SeleccionaOperadorComponent } from '../app/despacho/Components/Liquidacion/selecciona-operador/selecciona-operador.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesViewComponent, canActivate: [AuthGuard] },
  { path: 'clientes/crearCliente', component: FormCrearClienteComponent },
  { path: 'clientes/verCliente', component: VerClienteComponent },
  { path: 'clientes/editarCliente', component: EditarClienteComponent },

  { path: 'marcas', component: MarcasViewComponent },
  { path: 'marcas/crearMarca', component: FormCrearMarcaComponent },
  { path: 'marcas/verMarca', component: VerMarcaComponent },
  { path: 'marcas/editarMarca', component: EditarMarcaComponent },

  { path: 'unidades',component: UnidadViewComponent, canActivate: [AuthGuard]  },
  { path: 'unidades/crearUnidad',component: CrearUnidadComponent },
  { path: 'unidades/verUnidad',component: VerUnidadComponent },
  { path: 'unidades/editarUnidad',component: EditarUnidadComponent },

  //{ path: 'liquidaciones',component: LiquidacionViewComponent },
  { path: 'liquidaciones/crearLiquidacion',component: CrearLiquidacionComponent },
  { path: 'liquidaciones/verLiquidacion',component: VerLiquidacionComponent },
  { path: 'liquidaciones/editarLiquidacion',component: EditarLiquidacionComponent },

  //JCBM
  { path: 'liquidaciones',component: LiquidacionViewComponent },

  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
