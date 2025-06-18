import { Component, OnInit } from '@angular/core';
import { repAdeudosModel } from 'src/app/models/RH/repAdeudos';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { RhService } from '../../services/rh.service';
import { Router } from '@angular/router';
import { ApiRhService } from 'src/app/DataAccess/api-rh.service';
import { GeneralParametersService } from 'src/app/shared-module/services/general-parameters.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-rep-adeudos',
  templateUrl: './rep-adeudos.component.html',
  styleUrls: ['./rep-adeudos.component.css']
})
export class RepAdeudosComponent implements OnInit {
  cp: repAdeudosModel = new repAdeudosModel;
  columnConfigs: { [key: string]: ColumnConfig } = {
    numEmpleado: { displayName: 'ID', type: 'default', showFilter: false, visible: true },
    empleado: { displayName: 'Empleado', type: 'default', showFilter: true, visible: true },
    descripcion: { displayName: 'Descripcion', type: 'default', showFilter: true, visible: true },
    fecha: { displayName: 'Fecha', type: 'date', format: 'dd/MM/yyyy hh:mm', showFilter: true, visible: true },
    no_liquidacion: { displayName: 'No Liquidacion', type: 'default', showFilter: true, visible: true },
    monto: { displayName: 'Monto', type: 'default', showFilter: true, visible: true }
  };

  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 8
  };

  idCompania = 0;
  datos: repAdeudosModel[] = [];
  datosFiltrados: repAdeudosModel[] = [];
  isLoading: boolean = false;
  showAlert = false;
  alertMessage = '';
  alertType = '';



  constructor(
    private cpService: RhService,
    private apiRh: ApiRhService,
    private router: Router,
    private generalParametersService: GeneralParametersService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.cp = new repAdeudosModel();
  }

  ngOnInit(): void {
    this.generalParametersService.selectedCompany$.subscribe(compañia => this.idCompania = compañia == null ? 0 : Number(compañia));
    this.refreshData();
  }

  async refreshData() {
    this.isLoading = true;
    this.apiRh.obtenerDatos().subscribe(
      (data) => {
        // this.isLoading = false;
        console.log(data);

        // Mostrar el Snackbar según el resultado
        if (data) {
          this._snackBar.open('Solicitud exitosa', 'Cerrar', {
            duration: 2000,
          });

          this.datos = data;
          this.datosFiltrados = this.datos;
          this.isLoading = false;

        } else {
          this._snackBar.open('No se encontro ningun bloqueo', 'Cerrar', {
            duration: 2000,
          });
          this.isLoading = false;
        }

        return data;

      },
      (error) => {
        this.isLoading = false;
        this.showAlert = true;

        this._snackBar.open('Error al cargar los datos', 'Cerrar', {
          duration: 2000,
        });

      }
    );
  }



}
