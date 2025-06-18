import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Routes } from 'src/app/app-routes.constants';
import { ApiRhService } from 'src/app/DataAccess/api-rh.service';
import { Sucursal } from 'src/app/models/RH/sucursal';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ApiPersonalService } from 'src/app/DataAccess/HgTools/api-personal.service';
import { ParametrosPersonalTrucksTabla } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';
import { ConfiguracionParametros } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { AlertService } from 'src/app/Services/alerts.service';
import { finalize, map, tap } from 'rxjs/operators';
import { FullTableV2Component } from 'src/app/shared-module/components/full-tableV2/full-table.component';

@Component({
  selector: 'app-personalTrucks-view',
  templateUrl: './personalTrucks-view.component.html',
  styleUrls: ['./personalTrucks-view.component.css']
})
export class PersonalTrucksViewComponent implements OnInit {
  @ViewChild(FullTableV2Component) tableComponent!: FullTableV2Component;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Sucursal[] = [];
  datos: Sucursal[] = [];
  isLoading: boolean = false;

  constructor(
    public apiRhService:ApiPersonalService,
    private router: Router,
    public dialog: MatDialog,
    public configParams: ConfiguracionParametros,
    public alertService: AlertService
  ) {

  }


  columnConfigs: { [key: string]: ColumnConfig } = {
    idPersonal: { displayName: 'ID', type: 'default', showFilter: true, visible: true },
    numEmpleado: { displayName: 'No Empleado', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Nombre', type: 'default', showFilter: true, visible: true },
    nombreCompleto: { displayName: 'Nombre Completo', type: 'default', showFilter: true, visible: true },
    tipoEmpleado: { displayName: 'Tipo de Empleado', type: 'default', showFilter: true, visible: true },
    estado: { displayName: 'Estado', type: 'default', showFilter: true, visible: true },
    rfc: { displayName: 'RFC', type: 'default', showFilter: true, visible: true },
    categoria: { displayName: 'Categoría', type: 'default', showFilter: true, visible: true },
    departamento: { displayName: 'Departamento', type: 'default', showFilter: true, visible: true },
    fechaIngreso: { displayName: 'Fecha de Ingreso', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: true },
    fechaBaja: { displayName: 'Fecha de Baja', type: 'date', format: 'dd/MM/yyyy', showFilter: true, startDate: null, endDate: null, visible: true },
    compania: { displayName: 'Compañía', type: 'default', showFilter: true, visible: true }
};


  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'cloud_upload',
      tooltip: 'Importar',
      callback: (item) => this.onMigrateClick(item)
    },
   
  ];

  tableConfigs: TableConfig =
    {
      pageSizeOptions: [5, 15, 30],
      headerColumFontSize: 5,
    };

    ParametrosPersonalTrucksTabla = ParametrosPersonalTrucksTabla;

onMigrateClick(rowData: any) {
  this.alertService
      .question('Importar empleado: ' + rowData.nombreCompleto + '?')
      .pipe(
        map((isConfirmed) => {
          if (isConfirmed) {
            //Llama al método del servicio para actualizar
            this.isLoading = true; // Muestra el indicador de carga

            const idPersonal = rowData.idPersonal;

            // Llama al método del servicio para actualizar
            this.apiRhService
              .enviarPersonalTrucks(idPersonal)
              .pipe(
                tap((data) => {
                  this.tableComponent.loadData();
                }),
                finalize(() => {})
              )
              .subscribe();
          } else {
            this.alertService.warning('default.warning.cancelar');
          }
        })
      )
      .subscribe();
}

  ngOnInit(){
    //this.storageService.init('sucursalActual');
    //this.retriveData();
  }

  // Esta función se llama para mostrar la alerta
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
