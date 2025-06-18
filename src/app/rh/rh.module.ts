import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import  { MatButtonModule } from '@angular/material/button';

import { RepAdeudosComponent } from './components/rep-adeudos/rep-adeudos.component';
import { RepConsumosComponent } from './components/rep-consumos/rep-consumos-view.component';

import { SharedModuleModule } from '../shared-module/shared-module.module';


//SUCURSALES
import { SucursalViewComponent } from './components/Sucursal/sucursal-view/sucursal-view.component';
import { ModalCrudSucursalComponent } from './components/Sucursal/modal-crud-sucursal/modal-crud-sucursal.component';
import { VerPersonalComponent } from './components/Personal/ver-personal/ver-personal.component';
import { PersonalViewComponent } from './components/Personal/personal-view/personal-view.component';
import { ModalCrudPersonalComponent } from './components/Personal/modal-crud-personal/modal-crud-personal.component';
import { EditarPersonalComponent } from './components/Personal/editar-personal/editar-personal.component';
import { CrearPersonalComponent } from './components/Personal/crear-personal/crear-personal.component';
import { PersonalGafeteComponent } from './components/empleado/personal-gafete/personal-gafete.component';

//RH
import { BancoViewComponent } from './components/Banco/banco-view/banco-view.component';
import { ModalCrudBancoComponent } from './components/Banco/modal-crud-banco/modal-crud-banco.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PersonalTrucksViewComponent } from './components/Personal-trucks/personalTrucks-view/personalTrucks-view.component';

import { CatalogoMenuComponent } from './components/comidas-comedor/catalogo-menu/catalogo-menu.component';
import { ModalCrudMenuComponent } from './components/comidas-comedor/modal-crud-menu/modal-crud-menu.component';

import { CatalogoEmpleadoComponent } from './components/empleado/catalogo-empleado/catalogo-empleado.component';
import { ModalCrudEmpleadoComponent } from './components/empleado/modal-crud-empleado/modal-crud-empleado.component';

import { TipoCajaComponent } from './components/tipoCaja/tipoCaja-view/tipoCaja.component';
import { ModalCrudTipoCajaComponent } from './components/tipoCaja/modal-crud-tipoCaja/modal-crud-tipoCaja.component';
import { RepMoperComponent } from './components/rep-moper/rep-moper.component';
import { CategoriaViewComponent } from './components/catalogoCategoria/categoria-view/categoria-view.component';
import { ModalCrudCategoriaComponent } from './components/catalogoCategoria/modal-crud-categoria/modal-crud-categoria.component';
import { DepatamentoViewComponent } from './components/catalogoDepartamento/depatamento-view/depatamento-view.component';
import { DeparmentoCrudModalComponent } from './components/catalogoDepartamento/deparmento-crud-modal/deparmento-crud-modal.component';

import { PersonalBancoViewComponent } from './components/Banco/PersonalBanco/personalBanco-view/personalBanco-view.component';
import { ModalCrudPersonalBancoComponent } from './components/Banco/PersonalBanco/modal-crud-personalBanco/modal-crud-personalBanco.component';
import { ConsumoComedorComponent } from './components/consumo-comedor/consumo-comedor/consumo-comedor.component';
import { ModalCrudConsumoComedorComponent } from './components/consumo-comedor/modal-crud-consumo-comedor/modal-crud-consumo-comedor.component';
import { RepCajaAhorroComponent } from './components/rep-caja-ahorro/rep-caja-ahorro.component';
import { ModalImagenPreviewComponent } from '../shared-module/components/modal-imagen-preview/modal-imagen-preview.component';
import { RepIngresoOperadoresComponent } from './components/rep-ingreso-operadores/rep-ingreso-operadores.component';
import { RepSalarioDiarioComponent } from './components/rep-salario-diario/rep-salario-diario.component';

@NgModule({
  declarations: [
    RepAdeudosComponent,
    RepConsumosComponent,
    CatalogoMenuComponent,
    ModalCrudMenuComponent,
    CatalogoEmpleadoComponent,
    ModalCrudEmpleadoComponent,
    RepAdeudosComponent,
    SucursalViewComponent,

    // Personal
    VerPersonalComponent,
    PersonalViewComponent,
    ModalCrudPersonalComponent,
    EditarPersonalComponent,
    CrearPersonalComponent,
    PersonalGafeteComponent,

    ModalCrudSucursalComponent,
      PersonalGafeteComponent,
      BancoViewComponent,
      ModalCrudBancoComponent,

    //TipoCaja
    TipoCajaComponent,
    ModalCrudTipoCajaComponent,
    RepMoperComponent,

    PersonalBancoViewComponent,
    ModalCrudPersonalBancoComponent,
    CategoriaViewComponent,
    ModalCrudCategoriaComponent,
    DepatamentoViewComponent,
    DeparmentoCrudModalComponent,
    ConsumoComedorComponent,
    ModalCrudConsumoComedorComponent,
    RepCajaAhorroComponent,
    // ModalImagenPreviewComponent
    PersonalTrucksViewComponent,
    // RPT / Ingreso Operadores
    RepIngresoOperadoresComponent,
    RepSalarioDiarioComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    AppRoutingModule,
    NgMultiSelectDropDownModule,
    MatStepperModule,
    MatButtonModule
  ],
  providers: [
    CurrencyPipe
  ]
})
export class RhModule { }

