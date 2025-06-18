import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, tap } from 'rxjs';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { ConfiguracionParametros, ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { RptLiquidacionPersonalDTO } from './../../../models/RH/Liquidacion/RptLiquidacionPersonalDTO';
import { FullTableV2Component } from 'src/app/shared-module/components/full-tableV2/full-table.component';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  selector: 'app-rep-ingreso-operadores',
  templateUrl: './rep-ingreso-operadores.component.html',
  styleUrls: ['./rep-ingreso-operadores.component.css'],
  providers: [
      { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
      { provide: MAT_DATE_FORMATS, useValue: _formatoFecha }
    ]
})
export class RepIngresoOperadoresComponent {
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
      showFilter: false,
      visible: true,
    },
    concepto: {
      displayName: 'Concepto',
      type: 'default',
      showFilter: false,
      visible: true,
      // widthColumn: '10px'
    },
    // nombreConcepto: {
    //   displayName: 'Desc. concepto',
    //   type: 'default',
    //   showFilter: false,
    //   visible: true,
    // },
    montoFormato: {
      displayName: 'Monto',
      type: 'default',
      showFilter: false,
      visible: true,
      char: '$',
      customRender: (rowData) => `${'$'+rowData.montoFormato}`,
    },
    folio: {
      displayName: 'Folio',
      type: 'default',
      showFilter: false,
      visible: true,
      // widthColumn: '10px'
    },
    // estatusLiquidacion: {
    //   displayName: 'Estatus liquidación',
    //   type: 'default',
    //   showFilter: false,
    //   visible: false,
    // },
    mensaje: {
      displayName: 'Mensaje',
      type: 'default',
      showFilter: false,
      visible: true,
      // widthColumn: '25px'
    },
    estatusTimbrado: {
      displayName: 'Estatus timbrado',
      type: 'default',
      showFilter: true,
      visible: true,
      customRender: (rowData) => `${rowData.estatusTimbrado == 1 ? 'Por Timbrar' : 'En Edición'}`,
      // widthColumn: '25px'
    },
    // fechaLiquidacion: {
    //   displayName: 'Fecha liquidación',
    //   type: 'date',
    //   format: 'dd/MM/yyyy',
    //   showFilter: true,
    //   visible: true,
    // },
    // tipoEmpleado: {
    //   displayName: 'Tipo empleado',
    //   type: 'default',
    //   showFilter: false,
    //   visible: false,
    // },
  };

  tableConfigs: TableConfig = {
    pageSizeOptions: [10, 20, 30],
    headerColumFontSize: 10,
  };

  datos: RptLiquidacionPersonalDTO[] = [];
  datosFiltrados: RptLiquidacionPersonalDTO[] = [];

  parametrosGeneralesIngresoOperador = new ParametrosGenerales({
    // ordenarPor: 'fechaLiquidacion',
    ordenarPor: 'numEmpleado',
    descending: true,
    rangoFechas: formatDate(new Date().setDate(new Date().getDate() - 7), 'yyyy/MM/dd', 'en-US')+'-'+formatDate(new Date(), 'yyyy/MM/dd', 'en-US'),
    filtrosIniciales: {
      // fechaInicio: formatDate(new Date().setDate(new Date().getDate() - 7), 'yyyy/MM/dd', 'en-US'),
      // fechaFin: formatDate(new Date(), 'yyyy/MM/dd', 'en-US'),
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
    this.viajesObs$ = this.apiRh.reporteIngresoOperadores.bind(apiRh);

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
          this.parametrosGeneralesIngresoOperador.rangoFechas = dateRangeString ;
          console.log(this.parametrosGeneralesIngresoOperador);
  
          setTimeout(() => this.tableComponent.loadData(), 0);
        }
      });    
    }
  
    private _midDate(i:Date, f: Date): Date{
      return new Date( (i.getTime() + f.getTime())/2);
    }
}

