import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiDespachoService } from 'src/app/DataAccess/api-despacho.service';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { ModalService } from 'src/app/Services/Modal.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { TrazabilidadViajesDetailComponent } from '../trazabilidad-viajes-detail/trazabilidad-viajes-detail.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViajeEstatus } from 'src/app/models/Despacho/ViajeEstatus';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { debounceTime, Observable, of } from 'rxjs';
import { FullTableV2Component } from 'src/app/shared-module/components/full-tableV2/full-table.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-trazabilidad-viajes-view',
  templateUrl: './trazabilidad-viajes-view.component.html',
  styleUrls: ['./trazabilidad-viajes-view.component.css']
})
export class TrazabilidadViajesViewComponent implements OnInit {
  columnConfigs: { [key: string]: ColumnConfig } = {
    idViaje: {
      displayName: 'Id viaje',
      type: 'default',
      showFilter: false,
      visible: true,
      widthColumn: '15px',
    },
    idPedido: {
      displayName: 'Id pedido',
      type: 'default',
      showFilter: false,
      visible: true,
      widthColumn: '15px',
    },
    fechaDespacho: {
      displayName: 'Despacho',
      type: 'date-time',
      showFilter: false,
      visible: true,
    },
    fechaInicioViaje: {
      displayName: 'Inicio',
      type: 'date-time',
      showFilter: false,
      visible: true,
    },
    fechaFinViaje: {
      displayName: 'Fin',
      type: 'date-time',
      showFilter: false,
      visible: true,
    },
    estatus: {
      displayName: 'Estatus',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    unidad: {
      displayName: 'Unidad',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    remolque: {
      displayName: 'Remolque',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    ultimaUbicacion: {
      displayName: 'Ultima ubicación',
      type: 'default',
      showFilter: false,
      visible: true,
    },
  };
  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5
  };
  viajesObs$:any;
  actions: TableAction[] =[{
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver',
      callback: (item: any) => this.openDetailModal(item)
  }];

  /**
   *
   */
  min25: Date = new Date('2025/01/01 00:00:00');
  minDate: Date = new Date();
  maxDate: Date = new Date();
  formFiltros: FormGroup;
  params: ParametrosGenerales = new ParametrosGenerales();
  @ViewChild(FullTableV2Component) tabla!: FullTableV2Component;
  estatusViaje$: any;
  estatusViajeSelect: ViajeEstatus = new ViajeEstatus(3, 'REALIZADO');
  columnConfigEstatusViaje: { [key: string]: ColumnConfig } = {
    idViajeEstatus: {
      displayName: 'Id',
      type: 'default',
      showFilter: true,
      visible: true
    },
    nombre: {
      displayName: 'Nombre',
      type: 'default',
      showFilter: true,
      visible: true,
    },
  };
  displayColConfEstatusViaje: DisplayColumnConfigDF = {
    identificador: 'idViajeEstatus',
    separadorColumnas: ' - ',
    columnas: ['nombre'],
  };    

  constructor(
    private _apiDespachoService: ApiDespachoService,
    private _modalService: ModalService,
    private _formBuilder: FormBuilder,
  ) {
    this.viajesObs$ = this._apiDespachoService.obtenerRptSeguimientoDeViajes.bind(this._apiDespachoService);
    this.estatusViaje$ = this.obtenerEstatusTrucks.bind(this);

    const mDate = this._midDate(new Date(), new Date(this.minDate.getTime() - (86400000*15)));
    this.minDate = new Date(mDate.getTime() - (86400000*30));//30 dias antes de midDate;
    this.maxDate = new Date(mDate.getTime() + (86400000*1));//30 dias despues de midDate;
    this.formFiltros = this._formBuilder.group({
        fechaDesde: [new Date()],
        fechaHasta: [new Date()],
        idViaje: [null],
        idPedido: [null],
        estatus: ['REALIZADO'],
    });
  }

  ngOnInit(): void {
    this.formFiltros.valueChanges
    .pipe(
      //debounceTime(500)
    )
    .subscribe((data) => {
        if (data.fechaDesde && data.fechaHasta) {
          const formatDate = (date: Date) => 
            `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
          const dateRangeString = `${formatDate(data.fechaDesde)}-${formatDate(data.fechaHasta)}`;
          this.params.filtrosIniciales['fechadespacho'] = dateRangeString ;
          this.params.filtrosIniciales['estatus'] = data.estatus;
          this.params.filtrosIniciales['idviaje'] = data.idViaje;
          this.params.filtrosIniciales['idpedido'] = data.idPedido;
          setTimeout(() => this.tabla.loadData(), 0);
        }
      });    
  }

  openDetailModal(item: any) {
    this._modalService.openModal(
      TrazabilidadViajesDetailComponent,
      item,
      'DETAIL',
      () => console.log('Modal closed')
    )
  }

  private _midDate(i:Date, f: Date): Date{
    return new Date( (i.getTime() + f.getTime())/2);
  }

  obtenerEstatusTrucks(parametros: HttpParams): Observable<any> {
    return of(
      {
        "message": null,
        "totalRecords": 5,
        "items": [
          {
            "idViajeEstatus": 1,
            "nombre": "PENDIENTE"
          },
          {
            "idViajeEstatus": 2,
            "nombre": "TRANSITO"
          },
          {
            "idViajeEstatus": 3,
            "nombre": "REALIZADO"
          },
          {
            "idViajeEstatus": 4,
            "nombre": "LIQUIDADO"
          },
          {
            "idViajeEstatus": 5,
            "nombre": "CANCELADO"
          }
        ],
        "success": true,
        "item": null,
        "errorList": []
      }
    )
  }
}
