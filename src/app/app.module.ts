import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

//Modulos
import { SharedModuleModule } from './shared-module/shared-module.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityModule } from './security/security.module';


import { DatePipe } from '@angular/common';

//catalogo sat
import { CatalogoSatModule } from './catalogo-sat/catalogo-sat.module';
import { TIModule } from './ti/ti.module';

//CAT GENERAL
import { SistemaGeneralModule } from './sistema-general/sistema-general.module';

//Satelite
import { SateliteModule } from './Satelite/satelite.module';
import { RhModule } from './rh/rh.module';
import { AdministradorModule } from './administrador/administrador.module';
import { ApiServiceHandler } from './DataAccess/apiServiceHandler';

import { DescargaDocumentosFiscalesComponent } from './cobranza/Componentes/descarga-documentos-fiscales/descarga-documentos-fiscales.component';
import { MatTableModule } from '@angular/material/table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
//import { MenuItemComponent } from './shared-module/components/menu-item/menu-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { ServCliModule } from './operaciones/serv-cli.module';
import { ServicioClienteModule } from './servicio-cliente/servicio-cliente.module';
import { ReportePedidosCobranzaComponent } from './cobranza/Componentes/reporte-pedidos-cobranza/reporte-pedidos-cobranza.component';
import { EdiModule } from './EDI/edi.module';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ModalTipoCambioComponent } from './cobranza/Componentes/tipo-cambio/modal-tipo-cambio/modal-tipo-cambio.component';
import { TipoCambioComponent } from './cobranza/Componentes/tipo-cambio/tipo-cambio/tipo-cambio.component';
import { HomeComponent } from './home/home.component';
import { ActualizacionEstatusDeGuiasComponent } from './cobranza/Componentes/actualizacion-estatus-de-guias/actualizacion-estatus-de-guias.component';

//no crearon module para cobranza -.- jcbm


registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    DescargaDocumentosFiscalesComponent,
    ReportePedidosCobranzaComponent,      
    ModalTipoCambioComponent,
    TipoCambioComponent,
    HomeComponent,
    ActualizacionEstatusDeGuiasComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModuleModule,
    AdministradorModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    SecurityModule,
    CatalogoSatModule,
    TIModule,
    SateliteModule,
    RhModule,
    EdiModule,


    ServCliModule,
    ServicioClienteModule,
    SistemaGeneralModule,
    MatTableModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatProgressBarModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    ApiServiceHandler,
    DatePipe,

    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
