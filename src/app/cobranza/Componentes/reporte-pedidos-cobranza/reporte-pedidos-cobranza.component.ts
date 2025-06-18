import { Component, OnInit, EventEmitter } from '@angular/core';
import { PedidosCobranza } from '../../Models/PedidosCobranza';
import { ApiFacturasService } from '../../Services/data-access';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


interface PedidoConDuplicado extends PedidosCobranza {
  Duplicado: 'SI' | 'NO';
}

@Component({
  selector: 'app-reporte-pedidos-cobranza',
  templateUrl: './reporte-pedidos-cobranza.component.html',
  styleUrls: ['./reporte-pedidos-cobranza.component.css']
})
export class ReportePedidosCobranzaComponent implements OnInit {

  // Define la configuración de las columnas
  columnConfigs: { [key: string]: ColumnConfig } = {
    index: { displayName: '#', type: 'default', showFilter: true, visible: true },
    cliente: { displayName: 'Cliente', type: 'default', showFilter: true, visible: true },
    pedido: { displayName: 'Pedido', type: 'default', showFilter: true, visible: true },
    numGuia: { displayName: 'Guía', type: 'default', showFilter: true, visible: true },
    guia: { displayName: 'Número Guía', type: 'default', showFilter: true, visible: true },
    viaje: { displayName: 'Viaje', type: 'default', showFilter: true, visible: true },
    caja: { displayName: 'Caja', type: 'default', showFilter: true, visible: true },
    unidad: { displayName: 'Unidad', type: 'default', showFilter: true, visible: true },
    shipment: { displayName: 'Shipment', type: 'default', showFilter: true, visible: true },
    fecha_guia: { displayName: 'Fecha de Guía', type: 'date', format: 'dd/MM/yyyy HH:mm', showFilter: true, visible: true },
    statusGuia: { displayName: 'Estado de Guía', type: 'default', showFilter: true, visible: true },
    ediFinalizado: { displayName: 'EDI Finalizó', type: 'default', showFilter: true, visible: true },
    tipoOperacion: { displayName: 'Tipo de Operación', type: 'default', showFilter: true, visible: true },
    remitente: { displayName: 'Remitente', type: 'default', showFilter: true, visible: true },
    destinatario: { displayName: 'Destinatario', type: 'default', showFilter: true, visible: true },
    subtotal: { displayName: 'Subtotal', type: 'default', showFilter: true, visible: true },
    total: { displayName: 'Total', type: 'default', showFilter: true, visible: true }
  };
  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5
  };

  public pedidosCobranza: PedidosCobranza[] = [];
  public pedidosCobranzaFiltrados: PedidosCobranza[] = [];
  public isLoading = true;

  public filterDate: Date[] = [];
  public alertMessage: string = '';
  public showAlert: boolean = false;
  public alertType: string = '';

  constructor(
    private apiFacturasService: ApiFacturasService,
  ) { }

  ngOnInit(): void {
    this.obtenerPedidosCobranza();
  }

  obtenerPedidosCobranza() {
    this.isLoading = true;

    this.apiFacturasService.obtenerPedidosCobranza().subscribe(
      (response: any) => {
        // console.log('Response: ', response);
        this.pedidosCobranza = response;
        this.pedidosCobranzaFiltrados = response;
        this.isLoading = false;
        this.triggerAlert('Pedidos de cobranza obtenidos correctamente', 'success');
      },
      (error: any) => {
        this.MostrarAlerta('Error al obtener los pedidos de cobranza:' +'\n'+ error.toString() , 'error');
        console.log('Error: ', error);
        this.isLoading = false;
      }
    );
  }

  // Filtro de fechas ediConfId: number, fechaInicio: Date, fechaFin: Date
  filtrarPedidosCobranza(event: any) {
    console.log('Filtrar pedidos de cobranza', event);

    // Asegúrate de que event sea un array con las fechas
    const ediConfId = 9; // Cambia este valor según sea necesario
    const fechas = event as [Date, Date];
    const fechaInicio = fechas && fechas[0] ? formatDate(fechas[0], 'yyyy-MM-dd', 'en-US') : undefined;
    const fechaFin = fechas && fechas[1] ? formatDate(fechas[1], 'yyyy-MM-dd', 'en-US') : undefined;

    this.isLoading = true;
    console.log('Filtrar pedidos de cobranza', ediConfId, fechaInicio, fechaFin);

    this.apiFacturasService.obtenerPedidosCobranza(ediConfId, fechaInicio ? new Date(fechaInicio) : undefined, fechaFin ? new Date(fechaFin) : undefined).subscribe(
      (response: any) => {
        console.log('Response: ', response);
        this.pedidosCobranza = response;
        this.pedidosCobranzaFiltrados = response; // Filtrar aquí si es necesario
        this.isLoading = false;
        this.triggerAlert('Pedidos de cobranza obtenidos correctamente por rango de fechas', 'success');
      },
      (error: any) => {
        console.log('Error: ', error);
        this.MostrarAlerta(error.error.toString() , 'error');
        this.isLoading = false;
      }
    );
  }

  exportarExcel() {
    const columnHeaders = [
      '#',
      'Cliente',
      'Pedido',
      'Guía',
      'Número Guía',
      'Viaje',
      'Caja',
      'Unidad',
      'Shipment',
      'Fecha de Guía',
      'Estado de Guía',
      'EDI Finalizó',
      'Tipo de Operación',
      'Remitente',
      'Destinatario',
      'Subtotal',
      'Total',
      'Duplicado'
    ];

    const workbook = XLSX.utils.book_new();
    const worksheetData = [];

    // Agregar el encabezado
    worksheetData.push(columnHeaders);

    // Filtrar pedidos válidos
    const validPedidos = this.pedidosCobranzaFiltrados.filter(p => p.shipment !== null && p.shipment !== '');
    const shipments = validPedidos.map(p => p.shipment);
    const duplicateShipments = shipments.filter((shipment, index) => shipments.indexOf(shipment) !== index);

    // Marcar los pedidos duplicados
    const duplicatePedidos = validPedidos.filter(p => duplicateShipments.includes(p.shipment));
    const nonDuplicatePedidos = validPedidos.filter(p => !duplicateShipments.includes(p.shipment));

    // Agregar el flag Duplicado
    const duplicatesWithFlag = duplicatePedidos.map(p => ({ ...p, Duplicado: 'SI' }));
    const nonDuplicatesWithFlag = nonDuplicatePedidos.map(p => ({ ...p, Duplicado: 'NO' }));

    // Combinar los pedidos
    const allPedidos = [ ...duplicatesWithFlag, ...nonDuplicatesWithFlag];

    // Mapear los datos a un formato adecuado para la hoja
    allPedidos.forEach((pedido, index) => {
      worksheetData.push([
        index + 1,  // Columna '#'
        // pedido.index,  // Columna '#'
        pedido.cliente,
        pedido.pedido,
        pedido.guia,
        pedido.numGuia,
        pedido.viaje,
        pedido.caja,
        pedido.unidad,
        pedido.shipment,
        formatDate(pedido.fecha_guia, 'yyyy-MM-dd', 'en-US'),  // Formato de fecha
        pedido.statusGuia,
        pedido.ediFinalizado,
        pedido.tipoOperacion,
        pedido.remitente,
        pedido.destinatario,
        pedido.subtotal,
        pedido.total,
        pedido.Duplicado
      ]);
    });

    // Crear la hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Ajustar el ancho de las columnas (opcional)
    const columnsWidth = [
      {wch: 5},   // #
      {wch: 25},  // Cliente
      {wch: 15},  // Pedido
      {wch: 15},  // Guía
      {wch: 20},  // Número Guía
      {wch: 10},  // Viaje
      {wch: 10},  // Caja
      {wch: 10},  // Unidad
      {wch: 15},  // Shipment
      {wch: 20},  // Fecha de Guía
      {wch: 20},  // Estado de Guía
      {wch: 15},  // EDI Finalizó
      {wch: 20},  // Tipo de Operación
      {wch: 20},  // Remitente
      {wch: 25},  // Destinatario
      {wch: 15},  // Subtotal
      {wch: 15},  // Total
      {wch: 15}   // Duplicado
    ];
    worksheet['!cols'] = columnsWidth;

    const fechaInicio = formatDate(this.pedidosCobranzaFiltrados[0].fecha_guia, 'dd-MM-yyyy', 'en-US');
    const fechaFin = formatDate(this.pedidosCobranzaFiltrados[this.pedidosCobranzaFiltrados.length - 1].fecha_guia, 'dd-MM-yyyy', 'en-US');

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos-' + fechaInicio + '_' + fechaFin);
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "Pedidos-" + fechaInicio + "_" + fechaFin);

    console.log('Total pedidos válidos:', validPedidos.length);
    console.log('Pedidos duplicados:', duplicatePedidos.length);
    console.log('Pedidos no duplicados:', nonDuplicatePedidos.length);
    console.log('Total pedidos en el Excel:', allPedidos.length);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, fileName + EXCEL_EXTENSION);
  }

  MostrarAlerta(message: string, type: string): void {
    alert(message);
  }

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

}
