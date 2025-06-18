import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { FormControl } from '@angular/forms';
import { CargoCajaAhorro } from 'src/app/models/RH/CajaAhorro';
import { MatDatepicker } from '@angular/material/datepicker';
import { combineLatest, combineLatestAll, distinctUntilChanged, finalize, map, merge, mergeAll, scan, startWith } from 'rxjs';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-rep-caja-ahorro',
  templateUrl: './rep-caja-ahorro.component.html',
  styleUrls: ['./rep-caja-ahorro.component.css']
})
export class RepCajaAhorroComponent implements OnInit{

  @ViewChild('pickerDesde') dpDesde!: MatDatepicker<Date>;

  tipoPersonal = new FormControl<string>('Todos');
  fechaDesde = new FormControl<Date>(this._getPrimerDiaDeLaSemana);
  fechaHasta = new FormControl<Date>(this._getUltimoDiaDeLaSemana);

  data: CargoCajaAhorro[] = [];
  isLoading: boolean = true;

  tiposEmpleados: string[] = ['Todos','Empleado','Operador']

  columnConfigs: { [key: string]: ColumnConfig } = {
    numEmpleado: { displayName: 'ID', type: 'default', showFilter: false, visible: true },
    nombre: { displayName: 'Empleado', type: 'default', showFilter: true, visible: true },
    descripcion: { displayName: 'Descripción', type: 'default', showFilter: true, visible: true },
    fechaCaja: { displayName: 'Fecha Cargo', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    montoCaja: { displayName: 'Monto', type: 'default', showFilter: true, visible: true },
    noLiquidacion: { displayName: 'No Liquidación', type: 'default', showFilter: true, visible: true },
    fechaIngreso: { displayName: 'Fecha Cargo', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    periodo: { displayName: 'Periodo', type: 'default', showFilter: true, visible: true },
    archivoConfirmacion: { displayName: 'Archivo de confirmación', type: 'default', showFilter: true, visible: true }
  };
  
  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 10
  };

  constructor(
    private _apiRhService: ApiRecursosHumanosService,
    private _currencyPipe: CurrencyPipe
  ){}

  ngOnInit(): void {
    merge(
      this.tipoPersonal.valueChanges.pipe(startWith(this.tipoPersonal.value),map(tipoPersonal => ({ tipoPersonal }))),
      this.fechaDesde.valueChanges.pipe(startWith(this.fechaDesde.value), map(fechaDesde => ({ fechaDesde }))),
      this.fechaHasta.valueChanges.pipe(startWith(this.fechaDesde.value), map(fechaHasta => ({ fechaHasta })))
    ).pipe(
      scan((acc, curr) => ({ ...acc, ...curr }), {
        tipoPersonal: this.tipoPersonal.value,
        fechaDesde: this.fechaDesde.value,
        fechaHasta: this.fechaHasta.value
      })
    ).subscribe((valores) => {
      this.refreshData();
    });
  }

  refreshData(){
    this.isLoading = true;
    this._apiRhService.obtenerCargosCajaAhorro(
      this.fechaDesde.value!.toISOString(),
      this.fechaHasta.value!.toISOString(),
      this.tipoPersonal.value!
    )
    .pipe(
      finalize( () => this.isLoading = false)
    )
    .subscribe(
      data => this.data = data.map( (item) => ( {...item, montoCaja: this._currencyPipe.transform(item.montoCaja, 'MXN', 'symbol', '1.2-2'),} ) )
    )
  }

  get minDate(){
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth() - 3, hoy.getDate());
  }
  
  private get _getPrimerDiaDeLaSemana(): Date {
    return this._getWeek('I');
  }

  private get _getUltimoDiaDeLaSemana(): Date {
    return this._getWeek('F');
  }

  private _getWeek(P: 'I' | 'F'): Date {
    const hoy = new Date();
    const diaActual = hoy.getDay(); 
    const diferencia = P=='I'?diaActual:(6 - diaActual);
    const dia = new Date(hoy);
    P=='I'?dia.setDate(hoy.getDate() - diferencia):dia.setDate(hoy.getDate() + diferencia);
    return dia;
  }

}
