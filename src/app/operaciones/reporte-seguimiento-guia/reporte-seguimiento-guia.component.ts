import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, finalize, tap } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { ColumnConfigsCliente, columnConfigsSegGuia, DisplayColumnConfCliente, tableConfigsCliente, tableConfigsSegGuia } from './configTablesSegGuia';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { ApiRptTrcuksService } from 'src/app/DataAccess/api-reporte-trucks.service';
import { Cliente } from 'src/app/cobranza/Models/Cliente';
import { ApiServicioClienteService } from 'src/app/DataAccess/api-servicio-cliente.service';
import { ApiServicioClienteTrucksService } from 'src/app/DataAccess/api-servicio-cliente-trucks.service';

@Component({
  selector: 'app-reporte-seguimiento-guia',
  templateUrl: './reporte-seguimiento-guia.component.html',
  styleUrls: ['./reporte-seguimiento-guia.component.css']
})
export class ReporteSeguimientoGuiaComponent implements OnInit {
  parametrosSegGuia$: BehaviorSubject<ParametrosGenerales> = new BehaviorSubject<ParametrosGenerales>(new ParametrosGenerales());

  isLoading: boolean = false;
  params: HttpParams = new HttpParams();

  // Opcional: Fechas iniciales si deseas controlarlas
  startDate: Date | null = null;
  endDate: Date | null = null;

  columnConfigsSegGuia = columnConfigsSegGuia;
  tableConfigsSegGuia = tableConfigsSegGuia;
  columnConfigsCliente = ColumnConfigsCliente;
  displayColumnConfCliente = DisplayColumnConfCliente;
  tableConfigsCliente = tableConfigsCliente;

  clienteSelected: any;
  filtrosForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public apiRptTrucksService: ApiRptTrcuksService,
    public apiServicioClienteService: ApiServicioClienteTrucksService, 
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1); // ⬅️ un mes atrás

    this.filtrosForm = this.fb.group({
      tipoDocumento: [1],         // por defecto Carta Porte
      statusGuia: [['A']],        // por defecto Pendiente
      idCliente: [null],          // puedes precargar uno si quieres
    fechaInicio: [lastMonth],   // 1 mes antes
    fechaFin: [today],          // hoy
      conCartaCobro: [false]       // por defecto desactivado
    });

    this.filtrosForm.valueChanges
      .pipe(debounceTime(300)) // 🕒 debounce de 300ms
      .subscribe(() => {
        this.actualizarParametros();
      });

    // Cargar inicial
    this.actualizarParametros();
  }

  actualizarParametros(): void {
    const valores = this.filtrosForm.value;

    console.log('valores',valores);
    const filtrosIniciales: Record<string, string> = {};

    if (valores.tipoDocumento !== null) {
      filtrosIniciales['tipoDocumento'] = valores.tipoDocumento.toString();
    }

    if (Array.isArray(valores.statusGuia) && valores.statusGuia.length > 0) {
      filtrosIniciales['statusGuia'] = valores.statusGuia.join(',');
    }

    if (valores.idCliente) {
      filtrosIniciales['idCliente'] = valores.idCliente.toString();
    }

    filtrosIniciales['conCartaCobro'] = valores.conCartaCobro.toString();

    const nuevoParametro = new ParametrosGenerales({
      ...this.parametrosSegGuia$.value,
      filtrosIniciales
    });

    if (valores.fechaInicio && valores.fechaFin) {
      const fechaIni = this.formatDate(valores.fechaInicio);
      const fechaFin = this.formatDate(valores.fechaFin);
      nuevoParametro.rangoFechas = `${fechaIni}|${fechaFin}`;
    } else {
      nuevoParametro.rangoFechas = '';
    }

    // Emitir nuevo valor
    this.parametrosSegGuia$.next(nuevoParametro);

    console.log('📦 Emitiendo parámetros:', nuevoParametro);
  }

  limpiarFiltros(): void {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
  
    this.filtrosForm.reset({
      tipoDocumento: 1,
      statusGuia: ['A'],
      idCliente: null,
      fechaInicio: lastMonth,
      fechaFin: today,
      conCartaCobro: false
    });
  }
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
