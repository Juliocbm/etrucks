import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EdiKpiDataDetalle } from 'src/app/models/Edi/ediKpiModel';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';

@Component({
  selector: 'app-modal-semi-crud-kpi',
  templateUrl: './modal-semi-crud-kpi.component.html',
  styleUrls: ['./modal-semi-crud-kpi.component.css']
})
export class ModalSemiCrudKpiComponent implements OnInit {
  TITULO_MODAL: string = 'KPI DETALLE';
  TIPO_MODAL: string = 'DETAIL';
  IS_EDITABLE: boolean = false;
  isLoading: boolean = false;
  kpiData: any;
  detalleData: any[] = [];
  columnsConfigured: boolean = false;
  
  // Configuración de la tabla
  tableConfig: TableConfig = {
    pageSizeOptions: [10, 20, 50],
    headerColumFontSize: 10,
    heightRow: 'auto',
  };

  columnConfigs: { [key: string]: ColumnConfig } = {
    anio: { displayName: 'Año', type: 'default', visible: true, showFilter: true },
    semana: { displayName: 'Semana', type: 'number', visible: true, showFilter: true },
    shipment: { displayName: 'Load Tender', type: 'default', visible: true, showFilter: true },
    pedido: { displayName: 'ID Pedido', type: 'default', visible: true, showFilter: true },
    remolque: { displayName: 'Remolque', type: 'default', visible: true, showFilter: true },
    viaje: { displayName: 'ID Viaje', type: 'default', visible: true, showFilter: true },
    unidad: { displayName: 'Unidad', type: 'default', visible: true, showFilter: true },
    esEdi: { displayName: 'Es EDI', type: 'default', visible: true, showFilter: true },

    loadTender: { displayName: 'Cumplimiento', type: 'default', visible: false, showFilter: true },
    metaCliente: { displayName: 'Meta Cliente (%)', type: 'number', visible: false, showFilter: true },
    metaInt: { displayName: 'Meta Interna (%)', type: 'number', visible: false, showFilter: true }
  };

  tableActions: TableAction[] = [];

  constructor(
    private fb: FormBuilder,
    public modal: MatDialogRef<ModalSemiCrudKpiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.TITULO_MODAL = this.data.TITULO_MODAL || 'Detalle KPI';
    this.TIPO_MODAL = this.data.TIPO_MODAL || 'DETAIL';
    
    // Extraemos los datos recibidos
    const { TITULO_MODAL, TIPO_MODAL, ...restOfData } = this.data;
    this.kpiData = restOfData;
    
    console.log('Datos recibidos en el modal:', this.kpiData);
    
    // Si tenemos datos detallados en formato ApiResponse, los procesamos
    if (this.kpiData && this.kpiData.items) {
      this.detalleData = this.kpiData.items;
      console.log('Datos detallados recibidos:', this.detalleData);
    } 
    // Si tenemos datos en el campo item (singular), lo procesamos
    else if (this.kpiData && this.kpiData.item && Array.isArray(this.kpiData.item)) {
      this.detalleData = this.kpiData.item;
      console.log('Datos detallados recibidos de item:', this.detalleData);
    }
    // Si recibimos un arreglo directamente
    else if (this.kpiData && Array.isArray(this.kpiData)) {
      this.detalleData = this.kpiData;
      console.log('Datos detallados recibidos como array:', this.detalleData);
    }
    // También verificar si hay un campo 'data' que contenga los datos
    else if (this.kpiData && this.kpiData.data && Array.isArray(this.kpiData.data)) {
      this.detalleData = this.kpiData.data;
      console.log('Datos detallados recibidos en data:', this.detalleData);
    }
    else {
      console.log('No hay datos detallados disponibles');
      this.detalleData = [];
    }
    
    // Formatea los números para mostrarlos correctamente si es necesario
    this.detalleData.forEach(item => {
      // Convertir los valores de meta a porcentajes visibles si vienen como decimales
      if (item.metaCliente && item.metaCliente < 1) {
        item.metaCliente = item.metaCliente * 100;
      }
      if (item.metaInterna && item.metaInterna < 1) {
        item.metaInterna = item.metaInterna * 100;
      }
      if (item.loadTender && item.loadTender < 1) {
        item.loadTender = item.loadTender * 100;
      }
      
      // Si esEdi viene como boolean, convertir a string
      if (typeof item.esEdi === 'boolean') {
        item.esEdi = item.esEdi ? 'SI' : 'NO';
      }
    });
    
    this.columnsConfigured = true;
  }

  cerrarModal() {
    this.modal.close();
  }
}
