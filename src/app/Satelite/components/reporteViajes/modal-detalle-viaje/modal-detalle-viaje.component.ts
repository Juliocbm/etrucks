import { Component,Inject } from '@angular/core';
import { ReporteSeguimientoViaje, ReporteViajeDetalle } from './../../../../models/satelite/ReporteSeguimientoViaje';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiSateliteExcesoVelocidadService } from '../../../../DataAccess/api-satelite-exceso-velocidad.service';
import { TableAction } from './../../../../shared-module/Interfaces/TableAction';
import { TableConfig } from './../../../../shared-module/Interfaces/TableConfig';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { StorageService } from '../../../../Services/StorageService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-detalle-viaje',
  templateUrl: './modal-detalle-viaje.component.html',
  styleUrls: ['./modal-detalle-viaje.component.css']
})
export class ModalDetalleViajeComponent {

  constructor(
    private apiSatelite: ApiSateliteExcesoVelocidadService,
    private storageService: StorageService<ReporteSeguimientoViaje>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public modal: MatDialogRef<ModalDetalleViajeComponent>,
  ) { }

  datosFiltrados: ReporteViajeDetalle[] = [];
  datos: ReporteViajeDetalle[] = [];
  isLoading: boolean = false;
  viajeActual: ReporteSeguimientoViaje = new ReporteSeguimientoViaje();

  tableConfigs: TableConfig =
  {
    pageSizeOptions: [10],
    headerColumFontSize: 10,
    heightRow: 'auto'
  };

  columnConfigs: { [key: string]: ColumnConfig } = {
    vrId: { displayName: 'Vrid', type: 'default', visible: true, showFilter: false },
    assetId: { displayName: 'AssetId', type: 'default',editable: true, visible: true, showFilter: false },
    assetType:{ displayName: 'AssetType', type: 'default',editable: true, visible: true, showFilter: false},
    carrierId: { displayName: 'CarrierId', type: 'default', editable: true,visible: true, showFilter: false },
    inMotion: { displayName: 'InMotion', type: 'default', editable: true,visible: true, showFilter: false },
    version: { displayName: 'Version', type: 'default', editable: true,visible: true, showFilter: false },
    timestamp: { displayName: 'Timestamp', type: 'default', editable: true,visible: true, showFilter: false },
    latitude: { displayName: 'Latitude', type: 'default', editable: true,visible: true, showFilter: false },
    longitude: { displayName: 'Longitude', type: 'default', editable: true,visible: true, showFilter: false },
    provider: { displayName: 'Provider', type: 'default', editable: true,visible: true, showFilter: false }
  };

ngOnInit() {
  this.storageService.init('viajeActual');
  this.storageService.itemActual.subscribe(viaje => {
    if (viaje) {
      this.viajeActual = viaje;
    } else {
      console.log("Al no haber un elemento en guardado en sesion, debemos redirigir a otra pantalla o mostrar mensaje.");
    }
  });

  this. retriveData();
  }

  retriveData(){
 try {
      this.apiSatelite.obtenerDetalle(this.viajeActual.vrId).subscribe(
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

  cerrarModal() {
    this.modal.close();
  }

}

