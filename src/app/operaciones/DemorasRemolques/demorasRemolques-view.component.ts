import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { GeneralParametersService } from 'src/app/shared-module/services/general-parameters.service';
import { mttoEquipoComputo } from 'src/app/models/ti/mttoEquipoComputo';
import { ApiMttoEquipoComputo } from 'src/app/DataAccess/api-ti-mttoEquipoComputo.service';
import { MttoEquipoComputoService } from 'src/app/ti/Services/mttoEquipoComputo.service';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { demorasRemolques } from 'src/app/models/Operaciones/DemorasRemolque';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { DateTimeFormatDirective } from 'src/app/shared-module/Directives/DateTimeFormat.directive';
import { formatDate } from '@angular/common';
@Component({
   // selector: 'app-catalogo-cpMunicipio',
    templateUrl: './demorasRemolques-view.component.html',
    styleUrls: ['./demorasRemolques-view.component.css']
})
export class demorasRemolquesView{
   // Demoras : DemorasRemolques = new mttoEquipoComputo;
    //columns: string[] = ['num_activo', 'activo',  'estatus', 'fecha_adquisicion', 'fecha_asignacion', 'fecha_ult_preventivo', 'siguienteMtto', 'estatusMtto', 'semaforo']
        columnConfigs: {[key: string]: ColumnConfig } = {
          idRemolque: { displayName: 'ID Remolque', type: 'default', showFilter: true , visible: true},
          idLinea: { displayName: 'Linea', type: 'default', showFilter: true , visible: true},
          cteActual: { displayName: 'Cliente Actual', type: 'default', showFilter: true , visible: true},
          status: { displayName: 'Estatus', type: 'default', showFilter: true, visible: true},
          localidad: { displayName: 'Localidad', type: 'default', showFilter: true, visible: true},
          placa: { displayName: 'Placa', type: 'default', showFilter: true, visible: true},
          tjCirculacion: { displayName: 'Tarjeta Circulacion', type: 'default', showFilter: true, visible: true },
          ejecutivoSC: { displayName: 'Ejecutivo SC', type: 'default', showFilter: true, visible: true},
          demora: { displayName: 'Demora', type: 'default', showFilter: true, visible: true},
          diasDemora: { displayName: 'Dias Demora', type: 'default', showFilter: false, visible: true},
          costoDemora: { displayName: 'Costo Demora', type: 'default', showFilter: false, visible: true},
          tipoCambioDemora: { displayName: 'Tipo Cambio Demora', type: 'default', showFilter: false, visible: true},
          frecuenciaDemora: { displayName: 'Frecuencia', type: 'default', showFilter: true, visible: true},
          fechaStatus: { displayName: 'Fecha Status', type: 'date', format: 'dd/MM/yyyy', showFilter: false, visible: false},
        };

      
      
        tableConfigs: TableConfig = 
        {
          pageSizeOptions: [5, 15, 30],
          headerColumFontSize: 5    
        };

        datos: demorasRemolques[] = [];
        showAlert = false;
        alertMessage = '';
        alertType = '';
        datosFiltrados: demorasRemolques[] = [];
        idCompania = 0;
        fechaInicial: Date = new Date();
        //fechaFinal: Date = new Date();
        //fechaFiltro: Date = new Date();
        isLoading: boolean = false;

        private _fechaFinal: Date | null = null;
        get fechaFinal(): Date | null {
          return this._fechaFinal;
        }
        set fechaFinal(value: Date | null) {
          this._fechaFinal = value;
          this.onFechaChange(); // Ejecuta una acción cuando fechaFinal cambia
        }

        constructor(
            private ApiOperaciones: ApiOperacionesService, 
            private router: Router,
            private generalParametersService: GeneralParametersService
            )
        {
          this.fechaFinal = new Date();
        }

       ObtenerDatos()
       {
        //const fechaStr = this.fechaFiltro.toISOString()//formatDate(this.fechaFiltro, 'yyyy-MM-dd', 'en-US')//this.fechaFiltro.toISOString();
        //const fecha = new Date(fechaStr);
        //console.log('formato fecha', fechaStr);
        try
        {
          this.isLoading = true;
        this.ApiOperaciones.obtenerDemorasRemolques(this.fechaInicial.toISOString(), this.fechaFinal!.toISOString()).subscribe(
          response => {
            this.datos = response;
            this.datosFiltrados = this.datos;
            this.isLoading = false;
            console.log('activos ...', this.datosFiltrados);
          },
          error => {
            console.error('Ha ocurrido un error al obtener los datos', error);
            this.isLoading = false;
          }
        );
        }catch(error)
        {
          this.isLoading = false;
          console.error('Error al obtener datos', error);
        }
        
       }

        ngOnInit(){
          this.ObtenerDatos();
        }

        onFechaChange()
        {
          if (this.fechaInicial && this.fechaFinal) {
            console.log('================== fecha change ==================');
          this.ObtenerDatos();
            const rangoValido = this.fechaInicial <= this.fechaFinal;
            console.log('¿Rango válido?', rangoValido);
          }
          
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

        refreshData()
        {
          this.ObtenerDatos();
        }

    }