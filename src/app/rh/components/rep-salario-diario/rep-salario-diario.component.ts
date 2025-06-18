import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { ConfiguracionParametros, ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { FullTableV2Component } from 'src/app/shared-module/components/full-tableV2/full-table.component';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { RptSalarioDiarioDTO } from 'src/app/models/RH/Liquidacion/RptSalarioDiarioDTO';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';

export const _formatoFecha = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-rep-salario-diario',
  templateUrl: './rep-salario-diario.component.html',
  styleUrls: ['./rep-salario-diario.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: _formatoFecha }
  ]
})
export class RepSalarioDiarioComponent {
  @ViewChild(FullTableV2Component) tableComponent!: FullTableV2Component;

  columnConfigs: { [key: string]: ColumnConfig } = {
    idPersonal: {
      displayName: 'Id personal',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    numEmpleado: {
      displayName: 'Empleado',
      type: 'default',
      showFilter: true,
      visible: true,
      widthColumn: '10px'
    },
    nombre: {
      displayName: 'Nombre',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    imss: {
      displayName: 'IMSS',
      type: 'default',
      showFilter: true,
      visible: true,
    },
    fechaIngreso: {
      displayName: 'Fecha ingreso',
      type: 'date',
      showFilter: false,
      visible: true,
      widthColumn: '10px'
    },
    antiguedad: {
      displayName: 'Antigüedad',
      type: 'default',
      showFilter: false,
      visible: true,
      widthColumn: '10px'
    },
    salarioFormato: {
      displayName: 'Salario',
      type: 'default',
      showFilter: false,
      visible: true,
      char: '$',
      customRender: (rowData) => `${'$'+rowData.salarioFormato}`,
    },
    noLiquidacion: {
      displayName: 'No. Liquidación',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    fechaLiquidacion: {
      displayName: 'Fecha liquidación',
      type: 'date',
      showFilter: false,
      visible: true,
    },
   
  };

  tableConfigs: TableConfig = {
    pageSizeOptions: [10, 20, 30],
    headerColumFontSize: 10,
  };

  datos: RptSalarioDiarioDTO[] = [];
  datosFiltrados: RptSalarioDiarioDTO[] = [];

  parametrosGeneralesSueldoDiario = new ParametrosGenerales({
    // ordenarPor: 'fechaLiquidacion',
    ordenarPor: 'fechaLiquidacion',
    descending: false,
    rangoFechas: formatDate(new Date().setDate(new Date().getDate() - 7), 'yyyy/MM/dd', 'en-US')+'-'+formatDate(new Date(), 'yyyy/MM/dd', 'en-US'),
    filtrosIniciales: {
      estatusLiquidacion: 'A',
      tipoEmpleado: 'O'
    }
  })


  modalRef: BsModalRef | undefined;
  viajesObs$:any;
  formFiltros: FormGroup;
  min23: Date = new Date((new Date().getFullYear() - 1).toString()+'/01/01 00:00:00');
    minDate: Date = new Date();
    maxDate: Date = new Date();

  constructor(
    public apiRh: ApiRecursosHumanosService,
    public dialog: MatDialog,
    private configParams:ConfiguracionParametros,
    private _formBuilder: FormBuilder
  ) { 
    this.viajesObs$ = this.apiRh.GetReporteSalarioDiario.bind(this.apiRh);

    const mDate = this._midDate(new Date(), new Date(this.minDate.getTime() - (86400000*15)));
      // this.minDate = new Date(mDate.getTime() - (86400000*30));//30 dias antes de midDate;
      // this.maxDate = new Date(mDate.getTime() + (86400000*1));//30 dias despues de midDate;

      const hoy = new Date(); // Fecha actual
      const hace7Dias = new Date(hoy); // Copia del objeto actual
      hace7Dias.setDate(hoy.getDate() - 7); // Restar 7 días

      this.minDate = hace7Dias;//30 dias antes de midDate;
      this.maxDate = new Date();//30 dias despues de midDate;

      this.formFiltros = this._formBuilder.group({
        fechaDesde: [this.minDate],
        fechaHasta: [this.maxDate],
      });
  }

  ngOnInit(): void {
    this.formFiltros.valueChanges.subscribe((data) => {
      if (data.fechaDesde && data.fechaHasta) {
        const desde = moment(data.fechaDesde);
        const hasta = moment(data.fechaHasta);

    const formatDate = (date: moment.Moment) =>
      date.format('YYYY/MM/DD'); // <-- este formato: 2025/05/18

    const dateRangeString = `${formatDate(desde)}-${formatDate(hasta)}`;
        console.log('Date Range:', dateRangeString);
        this.parametrosGeneralesSueldoDiario.rangoFechas = dateRangeString ;
        console.log(this.parametrosGeneralesSueldoDiario);

        setTimeout(() => this.tableComponent.loadData(), 0);
      }
    });    
  }

  private _midDate(i:Date, f: Date): Date{
    return new Date( (i.getTime() + f.getTime())/2);
  }
  
}
