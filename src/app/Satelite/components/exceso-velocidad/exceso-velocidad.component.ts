import { Component, OnInit } from '@angular/core';
import { ApiSateliteExcesoVelocidadService } from 'src/app/DataAccess/api-satelite-exceso-velocidad.service';
import { repExcesoVelocidad } from 'src/app/models/satelite/repExcesoVelocidad';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { RepExcesoVelocidadService } from '../../services/rep-exceso-velocidad.service';
import { Router } from '@angular/router';
import { GeneralParametersService } from 'src/app/shared-module/services/general-parameters.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exceso-velocidad',
  templateUrl: './exceso-velocidad.component.html',
  styleUrls: ['./exceso-velocidad.component.css']
})
export class ExcesoVelocidadComponent implements OnInit {
  cp: repExcesoVelocidad = new repExcesoVelocidad;
  columnConfigs: { [key: string]: ColumnConfig } = {
    semana: { displayName: 'Semana', type: 'default', showFilter: true, visible: true },
    f_evento: { displayName: 'Fecha Evento', type: 'date', format: 'dd/MM/yyyy hh:mm', showFilter: true, visible: true },
    unidad: { displayName: 'Unidad', type: 'default', showFilter: true, visible: true },
    ubicacion: { displayName: 'Ubicacion', type: 'default', showFilter: true, visible: true },
    velocidad: { displayName: 'Velocidad', type: 'default', showFilter: true, visible: true },
    tiempoExcedido: { displayName: 'Tiempo (MIN)', type: 'default', showFilter: true, visible: true },
    propiedad: { displayName: 'Empresa', type: 'default', showFilter: true, visible: true }
  };

  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 8
  };
  isLoading: boolean = false;
  datos: repExcesoVelocidad[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: repExcesoVelocidad[] = [];
  idCompania = 0;

  constructor(
    private sateliteService: RepExcesoVelocidadService,
    private apiSatelite: ApiSateliteExcesoVelocidadService,
    private router: Router,
    private generalParametersService: GeneralParametersService
  ) {
    this.cp = new repExcesoVelocidad();
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.refreshData();
  }

  async obtenerInfo() {
    try {
      this.apiSatelite.obtenerDatos().subscribe(
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

  refreshData() {
    this.obtenerInfo()
  }

  descargarExcel() {
    const date: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateIso: string = date.toLocaleString('es-ES', options).replace(/\//g, '-').replace(',', '');
    console.log(dateIso);

    const workSheet = XLSX.utils.json_to_sheet(this.datos);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Exceso de Velocidad');
    XLSX.writeFile(workBook, 'Exceso de Velocidad'+ dateIso +'.xlsx');

  }


}
