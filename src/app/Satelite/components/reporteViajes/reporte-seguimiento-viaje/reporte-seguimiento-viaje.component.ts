import { Component, OnInit } from '@angular/core';
import { ApiSateliteExcesoVelocidadService } from 'src/app/DataAccess/api-satelite-exceso-velocidad.service';
import { ReporteSeguimientoViaje } from 'src/app/models/satelite/ReporteSeguimientoViaje';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { Router } from '@angular/router';
import { ModalDetalleViajeComponent } from '../modal-detalle-viaje/modal-detalle-viaje.component';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/Services/StorageService';

@Component({
  selector: 'app-reporte-seguimiento-viaje',
  templateUrl: './reporte-seguimiento-viaje.component.html',
  styleUrls: ['./reporte-seguimiento-viaje.component.css']
})
export class ReporteSeguimientoViajeComponent {

  isLoading: boolean = false;
  datos: ReporteSeguimientoViaje[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: ReporteSeguimientoViaje[] = [];

  constructor(
    private apiSatelite: ApiSateliteExcesoVelocidadService,
    private storageService: StorageService<ReporteSeguimientoViaje>,
    public dialog: MatDialog
  ) { }

  columnConfigs: { [key: string]: ColumnConfig } = {
    vrId: { displayName: 'VRID', type: 'default', showFilter: true, visible: true },
    estatusViaje: { displayName: 'Estatus', type: 'default', showFilter: true, visible: true },
    fechaViaje: { displayName: 'Fecha', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    observaciones: { displayName: 'Observación', type: 'default', showFilter: true, visible: true },
    fechaInicioViaje: { displayName: 'Fecha inicio Viaje', type: 'date', format: 'dd/MM/yyyy hh:mm', showFilter: true, visible: true },
    fechaFinViaje: { displayName: 'Fecha fin Viaje', type: 'date', format: 'dd/MM/yyyy hh:mm', showFilter: true, visible: true },
    tiempoTotalViaje: { displayName: 'Tiempo de viaje (dd:hh:mm)', type: 'default', showFilter: true, visible: true },
    fechaInicioReporte: { displayName: 'Fecha inicio reporte', type: 'default', showFilter: true, visible: false },
    fechaFinReporte: { displayName: 'Fecha fin reporte', type: 'default', showFilter: true, visible: false },
    tiempoTotalReporte: { displayName: 'Tiempo de reporte(dd:hh:mm)', type: 'default', showFilter: true, visible: false },
    idUnidad: { displayName: 'Id unidad', type: 'default', showFilter: true, visible: true },
    mctnumber: { displayName: 'mctnumber', type: 'default', showFilter: true, visible: false },
    placas: { displayName: 'Placas', type: 'default', showFilter: true, visible: false },
    totalPingEnviados: { displayName: 'Pings enviados', type: 'default', showFilter: false, visible: true },
    totalPingValidos: { displayName: 'Pings validos', type: 'default', showFilter: false, visible: true },
    noViaje: { displayName: 'Num viaje', type: 'default', showFilter: false, visible: true }
  };

  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 8
  };

  tableActions: TableAction[] = [
    {
      name: 'Detalle',
      title: 'Detalle',
      icon: 'settings',
      tooltip: 'Detalle',
      callback: (item) => this.onEditClick(item)
    }    
  ];


  ngOnInit() {
    this.isLoading = true;
    this.storageService.init('viajeActual');
    this.refreshData();

  }

  obtenerInfo(shipment:boolean) {
    try {
      this.apiSatelite.obtenerViajes(shipment).subscribe(
        response => {
          const datos = response;

          this.datos = datos;
          this.datosFiltrados = datos;
          this.isLoading = false;
          console.log(this.datos);
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

 
  onEditClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Detalle viaje',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalDetalleViajeComponent, {
      width: '8000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.refreshData();
    });
  }

  filtrarByText(text: any): void {
    this.isLoading = true;
    let vrids = text.split(',');
 
    this.apiSatelite.enviarShipments(vrids).subscribe(
      response => {    
       this.obtenerInfo(true);
      }
    );
    
  }

  refreshData() {
    this.obtenerInfo(false)
  }
}
