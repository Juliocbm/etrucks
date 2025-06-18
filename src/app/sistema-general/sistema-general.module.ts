import { NgModule } from '@angular/core';

//modulos
import { SharedModuleModule } from '../shared-module/shared-module.module';

import { ElementoDetCrearComponent } from './components/catalogoElementosDetalle/elemento-det-crear/elemento-det-crear.component'; 
import { ElementoDetVerComponent } from './components/catalogoElementosDetalle/elemento-det-ver/elemento-det-ver.component'
import { ElementoDetComponent } from './components/catalogoElementosDetalle/elemento-det/elemento-det.component'
import { ElementoDetEditarComponent } from './components/catalogoElementosDetalle/elemento-det-editar/elemento-det-editar.component'

@NgModule({
    declarations: [
        ElementoDetCrearComponent,
        ElementoDetVerComponent,
        ElementoDetComponent,
        ElementoDetEditarComponent
    ],
    imports: [
      SharedModuleModule
    ],
  })
  export class SistemaGeneralModule { }