import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModuleModule } from '../shared-module/shared-module.module';

//Catalogo SAT
import { CpMunicipioView } from './Components/cp-municipio/view-cpMunicipio/cpMunicipio-view.component';
import { CpMunicipioVer } from './Components/cp-municipio/ver-cpMunicipio/cpMunicipio-ver.component';
import { CpMunicipioCrear } from './Components/cp-municipio/crear-cpMunicipio/cpMunicipio-crear.component';
import { CpMunicipioEditar } from './Components/cp-municipio/editar-cpMunicipio/cpMunicipio-editar.component';


@NgModule({
  declarations: [
    CpMunicipioView,
    CpMunicipioVer,
    CpMunicipioCrear,
    CpMunicipioEditar
  ],
  imports: [
    CommonModule,
    SharedModuleModule
  ]
})
export class CatalogoSatModule { }
