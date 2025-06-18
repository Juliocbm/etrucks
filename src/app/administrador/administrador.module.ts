import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

//Administrador Components

  import { ModalCrudRolComponent } from './Components/catalogoRol/modal-crud-rol/modal-crud-rol.component';
  import { CatalogoRolComponent} from './Components/catalogoRol/catalogo-rol/catalogo-rol.component';
  //CatalogoUsuario
  import { CatalogoUsuarioComponent } from './Components/catalogoUsuarios/catalogo-usuario/catalogo-usuario.component';
  import { ModalCrudUsuarioComponent } from './Components/catalogoUsuarios/modal-crud-usuario/modal-crud-usuario.component';
  //ConfigUsuarioRol
  import { ConfigUsuarioRolComponent } from './Components/configUsuarioRol/config-usuario-rol/config-usuario-rol.component';
  import { ModalConfigUsuarioRolComponent } from './Components/configUsuarioRol/modal-config-usuario-rol/modal-config-usuario-rol.component';
  //RolPermisos
  import { RolPermisosComponent } from './Components/rolPermisos/rol-permisos/rol-permisos.component';

//SharedModule
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ModalCrudRolComponent,
    CatalogoRolComponent,
    CatalogoUsuarioComponent,
    ModalCrudUsuarioComponent,
    ConfigUsuarioRolComponent,
    ModalConfigUsuarioRolComponent,
    RolPermisosComponent
  ],
  imports: [
    CommonModule,
    SharedModuleModule,
    NgMultiSelectDropDownModule,
    AppRoutingModule
  ]
})  
export class AdministradorModule { }