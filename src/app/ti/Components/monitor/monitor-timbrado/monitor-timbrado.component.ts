import { ExportTableExcelService } from './../../../../shared-module/services/export-table-excel.service';
import { StepInfo } from './../../../../shared-module/components/shared-stepper/shared-stepper.component';
import { Component, OnInit } from '@angular/core';
import { ApiAcumaticaService } from 'src/app/DataAccess/api-acumatica.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-monitor-timbrado',
  templateUrl: './monitor-timbrado.component.html',
  styleUrls: ['./monitor-timbrado.component.css']
})
export class MonitorTimbradoComponent implements OnInit{
  datos: any[] = [];
  datosFiltrados: any[] = [];
  isLoading: boolean = false;
  index:number = 2;

  columnConfigs: { [key: string]: ColumnConfig } = {
    db: { displayName: 'Empresa', type: 'default', showFilter: true, visible: true },
    num_guia: { displayName: 'Guia', type: 'default', showFilter: true, visible: true },
    fecha_envio_acumatica: { displayName: 'Fecha Error', type: 'date', format: 'dd/MM/yyyy hh:mm', showFilter: true, visible: true }
  };

  tableConfigs: TableConfig = {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 8
  };

  steps: StepInfo[] = [
    { label: 'TIMBRADOS',   content: 'Timbrados',             columnConfigs: this.columnConfigs, tableConfigs: this.tableConfigs, datos: this.datos, isLoading: this.isLoading },
    { label: 'ERRORES',     content: 'Timbrados con errores', columnConfigs: this.columnConfigs, tableConfigs: this.tableConfigs, datos: this.datos, isLoading: this.isLoading },
    { label: 'PENDIENTES',  content: 'Timbrados pendientes',  columnConfigs: this.columnConfigs, tableConfigs: this.tableConfigs, datos: this.datos, isLoading: this.isLoading }
  ];

  constructor(
    private apiAcumatica: ApiAcumaticaService,
    private _snackBar: MatSnackBar,
    private serviceExportExcel: ExportTableExcelService
  ) { }

  handleStepCompleted(index: number) {
    this.getDatos(index, '0');
  }

  enviarItemEvent(event: any) {
    console.log('Item enviado:', event);
    this.getDatos(event.busquedaInterface, event.numGuia);
  }

  recibirDatos(datos: any[]) {
    console.log('Datos recibidos:', datos);
    this.timbrarClicked(datos);
  }

  exportarDatos(datos: any[]) {
    console.log('Datos exportados:', datos);
    //this.exportExcel(datos);
  }

  ngOnInit(): void {
    this.refreshData();
  }

  async refreshData() {
    this.isLoading = true;
    this.apiAcumatica.obtenerDatos(this.index).subscribe(
      response => {
        const datos = response;

        // Reescribe los valores de la columna 'db' según las condiciones especificadas
        this.datos = datos.map((obj: any) => {
          if (obj.db === 'hgdb_lis') {
            obj.db = 'HG';
          } else if (obj.db === 'chdb_lis') {
            obj.db = 'CH';
          } else if (obj.db === 'rldb_lis') {
            obj.db = 'RL';
          } else if (obj.db === 'lindadb') {
            obj.db = 'LD';
          }
          return obj;
        });

        console.log(this.datos);
        this.isLoading = false;

        // Llama al método onChanges para actualizar los datos en el componente compartido
        this.onChanges(this.datos, this.isLoading);
      }
    );
  }


  async getDatos(busquedaInterface: number, numGuia: string) {
    this.isLoading = true;
    switch (busquedaInterface) {
      case 0:
        busquedaInterface = 3;
        break;
      case 1:
        busquedaInterface = 2;
        break;
      case 2:
        busquedaInterface = 0;
        break;
      default:
        break;
    }

    console.log('Interfaz ' + busquedaInterface);

    this.apiAcumatica.obtenerDatos(busquedaInterface).subscribe(
      response => {
        const datos = response;
        console.log(datos);
        this.datos = datos;
        this.isLoading = false;

        this.onChanges(this.datos, this.isLoading);
      }
    );
  }

  timbrarClicked(timbrarData: any) {
    let db = timbrarData.db.toString();
    let guia = timbrarData.num_guia;

    this.isLoading = true;
    console.log(db + ' ' + guia);
    //console.log('Timbrar clicked. Data:', timbrarData);

    this.apiAcumatica.timbrarDatosLis(db, guia).subscribe(
      response => {
        console.log(response);
        this.isLoading = false;
        const datos = response;
        console.log(datos);
        this.datos = datos;

        // Mostrar el Snackbar según el resultado
        if (response) {
          this._snackBar.open('La respuesta fue de: ' + datos, 'Cerrar', {
            duration: 5000,
          });

          // if(datos.mensajes != null){
          //   this._snackBar.open( datos.errors , 'Cerrar', {
          //     duration: 5000,
          //   });
          // }
          // else
          // {
          //   this._snackBar.open('Solicitud exitosa', 'Cerrar', {
          //     duration: 3000,
          //   });
          // }

          this.refreshData();
        } else {
          this._snackBar.open('Solicitud fallida', 'Cerrar', {
            duration: 2000,
          });
        }

        // Llama al método onChanges para actualizar los datos en el componente compartido
        this.onChanges(this.datos, this.isLoading);
      },
      error => {
        this.isLoading = false;
        console.error('Error en la solicitud:', error);

        // Mostrar Snackbar en caso de error
        this._snackBar.open('Error en la solicitud', 'Cerrar', {
          duration: 2000,
        });
      }
    );
  }

  descargarExcel() {
    const date: Date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateIso: string = date.toLocaleString('es-ES', options).replace(/\//g, '-').replace(',', '');
    console.log(dateIso);

    const workSheet = XLSX.utils.json_to_sheet(this.datos);
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Monitor de Timbrado de Guías');
    XLSX.writeFile(workBook, 'Monitor de Timbrado de Guías'+ dateIso +'.xlsx');

  }

  // exportExcel(datos: any) {
  //   console.log('Exportar Excel clicked. Data:', datos);

  //   // Verifica si los datos están presentes
  //   if (!datos) {
  //       console.error('No se proporcionaron datos para exportar.');
  //       return;
  //   }

  //   // Convertir el objeto de datos en una matriz de objetos
  //   const dataToExport = [{
  //       'Número de Guía': datos.num_guia,
  //       'Fecha de Envío a Acumatica': datos.fecha_envio_acumatica,
  //       'Error': datos.error,
  //   }];

  //   // Por cada ; dentro de datos.error, se reemplaza por un salto de línea
  //   dataToExport[0]['Error'] = dataToExport[0]['Error'].replace(/;/g, '\n');

  //   // Crear un nuevo libro de Excel
  //   const wb = XLSX.utils.book_new();

  //   // Convertir los datos a una hoja de Excel
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

  //   // Agregar la hoja al libro
  //   XLSX.utils.book_append_sheet(wb, ws, 'Timbrados');

  //   // Generar un archivo binario de Excel
  //   const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  //   // Guardar el archivo Excel
  //   const blob = new Blob([wbout], { type: 'application/octet-stream' });
  //   const time = new Date().toISOString();
  //   const fileName = 'timbrados'+ time + '.xlsx';
  //   if ((window.navigator as any) && (window.navigator as any).msSaveOrOpenBlob) {
  //       (window.navigator as any).msSaveOrOpenBlob(blob, fileName);
  //       return;
  //   }

  //   // Crear un enlace de descarga y simular clic en él para descargar el archivo
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = fileName;
  //   link.click();
  //   window.URL.revokeObjectURL(url);
  // }

  onChanges(datos: any[] = [], isloading: boolean) {
    this.steps.forEach(step => {
      step.datos = datos;
      step.isLoading = isloading;
    });
  }
}
