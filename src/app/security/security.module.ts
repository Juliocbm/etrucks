
//modulos
import { SharedModuleModule } from '../shared-module/shared-module.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { InstructionsForgotPasswordComponent } from './components/instructions-forgot-password/instructions-forgot-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AccessDeniedComponent,
    InstructionsForgotPasswordComponent
  ],
  imports: [
    CommonModule, 
    SharedModuleModule,
    JwtModule.forRoot({
      config: {
        // opciones de configuración aquí
        tokenGetter: () => {
          return localStorage.getItem('token');
        }
      },
    })
  ]
})
export class SecurityModule { }
