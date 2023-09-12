import { NgModule } from '@angular/core';

//modulos
import { SharedModuleModule } from '../shared-module/shared-module.module';

//componentes
import { VerMarcaComponent } from './Components/catalogoMarca/ver-marca/ver-marca.component';
import { EditarMarcaComponent } from './Components/catalogoMarca/editar-marca/editar-marca.component';
import { MarcasViewComponent } from './Components/catalogoMarca/marcas-view/marcas-view.component';
import { FormCrearMarcaComponent } from './Components/catalogoMarca/crear-marca/crear-marca.component';

//componentes de Unidad
import { VerUnidadComponent } from './Components/catalogoUnidad/ver-unidad/ver-unidad.component';
import { EditarUnidadComponent } from './Components/catalogoUnidad/editar-unidad/editar-unidad.component';
import { UnidadViewComponent } from './Components/catalogoUnidad/unidad-view/unidad-view.component';
import { CrearUnidadComponent } from './Components/catalogoUnidad/crear-unidad/crear-unidad.component';

@NgModule({
  declarations: [
    VerUnidadComponent,
    EditarUnidadComponent,
    UnidadViewComponent,
    CrearUnidadComponent,
    VerMarcaComponent,
    EditarMarcaComponent,
    MarcasViewComponent,
    FormCrearMarcaComponent
  ],
  imports: [
    SharedModuleModule
  ],
})
export class MantenimientoModule { }
