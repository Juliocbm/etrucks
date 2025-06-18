import { Component, OnInit } from '@angular/core';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { environment } from 'src/app/environments/environment';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';

@Component({
  selector: 'app-m-prioridad-pedidos',
  templateUrl: './m-prioridad-pedidos.component.html',
  styleUrls: ['./m-prioridad-pedidos.component.css']
})
export class MPrioridadPedidosComponent implements OnInit{

  datos: any[] = [];
  datosFiltrados: any[] = [];
  public isLoading = false;
  private apiUrl = 'https://hg.tools.midireccion.com/PriorityPedidos/'//environment.API_URL_OPERACIONES;

  columnConfigs: { [key: string]: ColumnConfig } = {
    // idArea: { displayName: 'ID Area', type: 'default', showFilter: true, visible: true },
    priorityPosition: { displayName: 'Prioridad', type: 'default', showFilter: true, visible: true },
    idPedido: { displayName: 'Pedido', type: 'default', showFilter: true, visible: true },
    // estatusPedido: { displayName: 'Estatus Pedido', type: 'default', showFilter: true, visible: true },
    fechaPedido: { displayName: 'Fecha Pedido', type: 'date', format: 'yyyy-MM-dd HH:mm', showFilter: true, visible: true },
    cliente: { displayName: 'Cliente', type: 'default', showFilter: true, visible: true },
    origen: { displayName: 'Origen', type: 'default', showFilter: true, visible: true },
    destino: { displayName: 'Destino', type: 'default', showFilter: true, visible: true },
    ruta: { displayName: 'Ruta', type: 'default', showFilter: true, visible: true },
    tipoRuta: { displayName: 'Tipo Ruta', type: 'default', showFilter: true, visible: true },
    conCita: { displayName: 'Con Cita', type: 'icon', showFilter: true, visible: true },
    // fechaInsert: { displayName: 'Fecha Insert', type: 'date', format: 'yyyy-MM-dd HH:mm', showFilter: true, visible: true },
    // manualPosition: { displayName: 'Manual Position', type: 'default', showFilter: true, visible: true }
  };

  tableConfigs: TableConfig =
  {
    pageSizeOptions: [7, 17, 30],
    headerColumFontSize: 8
  };


  constructor(private apiOperacionesService: ApiOperacionesService) { }

  ngOnInit(){
    this.getPrioridadPedidos();
  }

  getPrioridadPedidos() {
    this.isLoading = true;
    this.apiOperacionesService.getPrioridadPedidos().subscribe((data: any) => {
      // Cambiar los datos de la columna conCita a iconos, si es true mostrar icono de check, si es false mostrar icono de close
      data.forEach((element: any) => {
        if (element.conCita === true) {
          element.conCita = 'check, #00ff00';
        } else {
          element.conCita = 'close, #ff0000';
        }
      });

      this.datos = data;
      this.datosFiltrados = this.datos;

      this.isLoading = false;
    });
  }



}
