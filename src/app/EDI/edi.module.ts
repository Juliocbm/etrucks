import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';

// ApexCharts para gráficos
import { NgApexchartsModule } from 'ng-apexcharts';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Components
import { GeocercaStopComponent } from './components/geocerca-stop-vw/geocerca-stop/geocerca-stop.component';
import { ModalCrudGeocercaStopComponent } from './components/geocerca-stop-vw/modal-crud-geocerca-stop/modal-crud-geocerca-stop.component';
import { ModalSeleccionarConexionComponent } from './components/geocerca-stop-vw/modal-seleccionar-conexion/modal-seleccionar-conexion.component';

// EDI Tracker Components
import { EdiTrackerComponent } from './components/edi-tracker/edi-tracker.component';
import { ParseEdiComponent } from './components/edi-tracker/parse-edi/parse-edi.component';
import { EventsEdiComponent } from './components/edi-tracker/events-edi/events-edi.component';
import { TrackinEdiComponent } from './components/edi-tracker/trackin-edi/trackin-edi.component';

// Modules
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { DashboardEdiKpiComponent } from './components/KPI/dashboard-edi-kpi/dashboard-edi-kpi.component';
import { ModalSemiCrudKpiComponent } from './components/KPI/modal-semi-crud-kpi/modal-semi-crud-kpi.component';

// DashboardChartComponent

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule,
    // ApexCharts
    NgApexchartsModule,
    // Angular Material
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatListModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  declarations: [
    GeocercaStopComponent,
    ModalCrudGeocercaStopComponent,
    ModalSeleccionarConexionComponent,
    EdiTrackerComponent,
    ParseEdiComponent,
    EventsEdiComponent,
    TrackinEdiComponent,
    DashboardEdiKpiComponent,
    FilterPipe,
    ClickOutsideDirective,
    ModalSemiCrudKpiComponent
  ],
  exports: [
    GeocercaStopComponent,
    ModalCrudGeocercaStopComponent,
    ModalSeleccionarConexionComponent,
    EdiTrackerComponent,
    DashboardEdiKpiComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EdiModule { }
