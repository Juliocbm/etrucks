import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, from, map, merge, mergeMap, of } from 'rxjs';
import { ApiDespachoService } from 'src/app/DataAccess/api-despacho.service';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { LoadingService } from 'src/app/Services/loading.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { MapboxService } from 'src/app/shared-module/services/mapbox.service';

import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

@Component({
  selector: 'app-trazabilidad-viajes-detail',
  templateUrl: './trazabilidad-viajes-detail.component.html',
  styleUrls: ['./trazabilidad-viajes-detail.component.css']
})
export class TrazabilidadViajesDetailComponent implements AfterViewInit {
  //#region tableConfig
  paramsPings: ParametrosGenerales = new ParametrosGenerales();
  paramsES: ParametrosGenerales = new ParametrosGenerales();
  posicionesObs$: any;
  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5
  };
  columnConfigsES: { [key: string]: ColumnConfig } = {
    idViaje: {
      displayName: 'Viaje',
      type: 'number',
      showFilter: false,
      visible: true,
      widthColumn: '15px',
    },
    posicion: {
      displayName: 'Posición',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    latitud: {
      displayName: 'Latitud',
      type: 'number',
      showFilter: false,
      visible: true,
    },
    longitud: {
      displayName: 'Longitud',
      type: 'number',
      showFilter: false,
      visible: true,
    },
    tipoEvento: {
      displayName: 'Tipo de Evento',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    ubicacion: {
      displayName: 'Ubicación',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    fechaEvento: {
      displayName: 'Fecha del Evento',
      type: 'date-time',
      showFilter: false,
      visible: true,
    },
    fechaCreacion: {
      displayName: 'Fecha de Creación',
      type: 'date-time',
      showFilter: false,
      visible: true,
    }
  };
  columnConfigsPings: { [key: string]: ColumnConfig } = {
    idViaje: {
      displayName: 'Viaje',
      type: 'number',
      showFilter: false,
      visible: true,
    },
    latitud: {
      displayName: 'Latitud',
      type: 'number',
      showFilter: false,
      visible: true,
    },
    longitud: {
      displayName: 'Longitud',
      type: 'number',
      showFilter: false,
      visible: true,
    },
    ubicacion: {
      displayName: 'Ubicación',
      type: 'default',
      showFilter: false,
      visible: true,
    },
    fechaEvento: {
      displayName: 'Fecha del Evento',
      type: 'date-time',
      showFilter: false,
      visible: true,
    },
    fechaCreacion: {
      displayName: 'Fecha de Creación',
      type: 'date-time',
      showFilter: false,
      visible: true,
    }
  };
  //#endregion tableConfig
  posiciones: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modal: MatDialogRef<TrazabilidadViajesDetailComponent>,
    private mapboxService: MapboxService,
    private _apiDespachoService: ApiDespachoService,
    private _loadingService: LoadingService
  ) {
    this.posicionesObs$ = this._apiDespachoService.obtenerPosicionesPorViajePaginado.bind(this._apiDespachoService);
    this.paramsPings.filtrosIniciales['tipoevento'] = 'PING';
    this.paramsES.filtrosIniciales['tipoevento'] = 'DA';

    this._loadingService.open();
  }

  ngAfterViewInit(): void {
    from(this.mapboxService.initializeMap('map'))
    .pipe(
      mergeMap( () => this._apiDespachoService.obtenerPosicionesPorViaje(new HttpParams(), this.data.idViaje)),
      map( response => {
        this.posiciones = response.items;
        return response.items;
      } ),
      map( items => items.map( (map:any) => ({lng: map.longitud, lat: map.latitud, tipoEvento: map.tipoEvento}))),
      //mergeMap( posiciones => from(posiciones)),
      finalize(() => this._loadingService.close())
    ).subscribe(
      (posicion: any) =>{
        const inicioFin = [posicion[0], posicion[ posicion.length - 1 ]] 
        this.mapboxService.drawRouteFollowingStreets(inicioFin);
        this.mapboxService.addMarker(inicioFin[0].lng, inicioFin[0].lat );
        this.mapboxService.addMarker(inicioFin[1].lng, inicioFin[1].lat );
      }
    );
  }
  cerrarModal() {
    this.modal.close();
  }

  async onExport() {
    const map = this.mapboxService.getMap();
    if(!map) return;

    map.once('idle', () => {
      const pdf = new jsPDF();
      let y = 20;
      const marginLeft = 15;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Trazabilidad de viaje', marginLeft, y);
      const rightText = new Date().toLocaleString(); // O usa el formato que desees
      pdf.setFontSize(10);
      pdf.text(rightText, pdfWidth - marginLeft - 2 - pdf.getTextWidth(rightText),y );

      pdf.setFontSize(14);
      pdf.text('Información', marginLeft, y+=20);
      y += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      
      // === MARCO ===
      const margin = 8;
      pdf.rect(margin, margin, pdfWidth - 2 * margin, pdfHeight - 2 * margin);
      
      // === INFO COMO LISTA ===
      const lista = [
        { label: 'Pedido', value: this.data.idPedido || 'Sin información' },
        { label: 'Viaje', value: this.data.idViaje || 'Sin información' },
        { label: 'Remolque', value: this.data.remolque || 'Sin información' },
        { label: 'Unidad', value: this.data.unidad || 'Sin información' },
        { label: 'Fecha de despacho', value: (`${this.data.fechaDespacho.split("T")[0]} ${ this.data.fechaDespacho.split("T")[1].substring(0, 5)}`) || 'Sin información' },
        { label: 'Fecha de inicio viaje', value: (`${this.data.fechaInicioViaje.split("T")[0]} ${ this.data.fechaInicioViaje.split("T")[1].substring(0, 5)}`) || 'Sin información' },
        { label: 'Fecha de fin viaje', value: (`${this.data.fechaFinViaje.split("T")[0]} ${ this.data.fechaFinViaje.split("T")[1].substring(0, 5)}`) || 'Sin información' },
        { label: 'Ultima ubicacion', value: this.data.ultimaUbicacion || 'Sin información' },
      ];
  
      lista.forEach(item => {
        pdf.text(`• ${item.label}: ${item.value ?? '-'}`, marginLeft, y);
        y += 8;
      });

      // // === MAPA ===
      pdf.setFontSize(14);
      pdf.text('Trazabilidad', marginLeft, y += 10);
      const mapCanvas = map.getCanvas();
      const mapa = mapCanvas.toDataURL('image/png');
      
      pdf.addImage(mapa, 'PNG', 13, y+=10, pdfWidth - 25, pdfHeight/3);
      
      // === PUNTOS ===

      pdf.addPage();
      const columnsPosicion = [
        { header: 'Ubicacion', dataKey: 'ubicacion' },
        { header: 'Fecha', dataKey: 'fechaEvento' },
        { header: 'Evento', dataKey: 'tipoEvento' },
        { header: 'Lat', dataKey: 'latitud' },
        { header: 'Lon', dataKey: 'longitud' }
      ];

      // Renderiza la tabla
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Eventos de geolocalización', marginLeft, y += 10);
      autoTable(pdf, {
        columns: columnsPosicion,
        body: this.posiciones,
        startY: 20 // Espacio desde la parte superior
      });

      pdf.save(`Trazabilidad viaje ${this.data.idViaje}.pdf`);
    });
    map.resize();
  }

}
