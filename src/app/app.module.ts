import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//modulos
import { SharedModuleModule } from './shared-module/shared-module.module';
import { DespachoModule } from './despacho/liquidacion.module';
import { ServicioAlClienteModule } from './servicio-al-cliente/servicio-al-cliente.module';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';
import { SecurityModule } from './security/security.module';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    SharedModuleModule,
    DespachoModule,
    ServicioAlClienteModule,
    MantenimientoModule,
    SecurityModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
