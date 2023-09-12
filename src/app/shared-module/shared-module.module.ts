import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


//componentes
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

//pipes compartidos
import { EspaciadoPipe } from './pipes/espaciado.pipe';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    LayoutComponent,
    NavbarComponent,
    ToolbarComponent,
    EspaciadoPipe
  ],
  imports: [
    FormsModule,
    RouterModule,
    BrowserModule,
    AlertModule,    
    BsDatepickerModule,
    BsDropdownModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot()
  ],
  exports:[
    ConfirmationModalComponent,
    LayoutComponent,
    ToolbarComponent,
    NavbarComponent,
    AlertModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ModalModule,
    BsDropdownModule
  ]
})
export class SharedModuleModule { }

