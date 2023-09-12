
//modulos
import { SharedModuleModule } from '../shared-module/shared-module.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
//import { SecurityRoutingModule } from './security-routing.module';

import { JwtModule } from '@auth0/angular-jwt';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule, 
    //SecurityRoutingModule,
    SharedModuleModule,
    JwtModule.forRoot({
      config: {
        // opciones de configuración aquí
      },
    })
  ]
})
export class SecurityModule { }
