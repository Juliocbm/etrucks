import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
//import { GeneralParametersService } from 'src/app/Services/general-parameters.service';
import { ApiComedorService } from 'src/app/DataAccess/Comedor/api-comedor.service';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { ConsumosModel } from 'src/app/models/RH/Comedor/consumos';
import { forkJoin } from 'rxjs';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { ApiPersonalService } from 'src/app/DataAccess/HgTools/api-personal.service';
import { ApiCatGenDetService } from 'src/app/DataAccess/HgTools/api.catGeneralDet.service';

@Component({
   selector: 'app-rep-consumos-view',
    templateUrl: './rep-consumos-view.component.html',
    styleUrls: ['./rep-consumos-view.component.css']
})
export class RepConsumosComponent{
    
        datos: ConsumosModel[] = [];
        showAlert = false;
        alertMessage = '';
        alertType = '';
        datosFiltrados: ConsumosModel[] = [];
        isLoading: boolean = false;

        sucursal: any[] = [];
        companias: any[] = [];
        estatus: any[] = [];

        idTipoConsumos = 0;
        idTipoEmpleado: string = '0';
        idSucursal: number  = 0;
        idCompania: number  = 0;
        start: Date = new Date();
        end: Date = new Date();
        idEstatusConsumo: number = 2;
        cantPlatillos: number = 0;
        cantConsumos: number = 0;
        tipoEmpeado: string = 'B92D26A6-19D0-45C1-8092-15B16172B081';
        tipoEmpleados: any[] = [];
        constructor(
            private apiComedor: ApiComedorService, 
            private apiHandler: ApiServiceHandler,
            private apiPersonal: ApiPersonalService,
            private apiCatGenDet: ApiCatGenDetService)
        {
          

        }

        columnConfigs: {[key: string]: ColumnConfig } = {
          idPersonal: { displayName: 'No Gaffete', type: 'default', showFilter: true , visible: true},
          nombre: { displayName: 'Nombre', type: 'default', showFilter: true , visible: true},
          tipoEmpleado: { displayName: 'Tipo empleado', type: 'default', showFilter: true , visible: true},
          cantConsumos: { displayName: 'Cant Consumos', type: 'number', showFilter: true, visible: true},
          total: { displayName: 'Total', type: 'number', showFilter: false, visible: true},
          diaConsumo: { displayName: 'Conusmo de', type: 'date', format: 'dd/MM/yyyy', showFilter: false, visible: true},
          activo: { displayName: 'Activo', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
          fechaCorte: { displayName: 'Fecha Corte', type: 'default',  showFilter: false, visible: true },
          estatus: { displayName: 'Estatus', type: 'default', showFilter: false, visible: true},
          empresa: { displayName: 'Empresa', type: 'default', showFilter: true, visible: true},
          sucursal: { displayName: 'Sucursal', type: 'default', showFilter: false, visible: true},
          tipoNomina: { displayName: 'Tipo Nomina', type: 'default', showFilter: false, visible: true}
        };
       
        tableConfigs: TableConfig = 
        {
          pageSizeOptions: [5, 15, 30],
          headerColumFontSize: 5    
        };


        ngOnInit(){
            this.retriveData();
            this.initializeRequiredData();
            if (localStorage.getItem('CompaniaSelect') != null) {
              this.idCompania = localStorage.getItem('CompaniaSelect') == null ? 0 : Number(localStorage.getItem('CompaniaSelect'));
              
            } 
        }

        onDetailClick(rowData: any) {

        }
      
        onEditClick(rowData: any) {
          
        }

        retriveData()
        {
          //this.idTipoEmpleado = '00000000-0000-0000-0000-000000000000';
          if(this.idTipoEmpleado == null || this.idTipoEmpleado == undefined || this.idTipoEmpleado == '0'){
            this.idTipoEmpleado = '00000000-0000-0000-0000-000000000000';
          }
          console.log('ID SUCURSAL', this.idSucursal);
          console.log('tipoEmpleado', this.idTipoEmpleado);
          console.log('tipoConsumos', this.idTipoConsumos);
          this.apiComedor.obtenerConsumos(this.idSucursal, this.idCompania, this.idEstatusConsumo, this.start.toISOString(), this.end.toISOString(), this.idTipoEmpleado, this.idTipoConsumos).subscribe(
            response => {
              this.datos = response.dataSingle;
              this.datosFiltrados = response.dataSingle;
              console.log('DATOS', response.dataSingle);
              console.log('DATOS FILTRADOS', this.datosFiltrados);
              //this.cantPlatillos = response.dataSingle;
                this.cantPlatillos = response.dataSingle.reduce((acc: number, item: { cantConsumos: number }) => {
                return acc + item.cantConsumos;
                }, 0);
              this.cantConsumos = response.dataSingle.reduce((acc: number, item: { total: number }) => {
                return acc + item.total;
              }, 0);
              
            },
            error => {
              console.error('Ha ocurrido un error al obtener los datos', error);
            }
          );
          this.idTipoEmpleado = '0';
        }

        initializeRequiredData(){
        
          forkJoin([
            this.apiHandler.getDatosAsync(this.apiPersonal.obtenerCompanias.bind(this.apiPersonal), 'compania'),
            //this.apiHandler.getDatosAsync(this.apiComedor.obtenerSucursales.bind(this.apiComedor), 'sucursal'),
            this.apiHandler.getDatosAsync(() => this.apiComedor.obtenerEstatus(), 'estatus'),
            this.apiHandler.getDatosAsync(() => this.apiCatGenDet.obtenerCatGeneralDet(this.tipoEmpeado), 'tipoEmpleado'),
          ]).subscribe(([compania, /*sucursal,*/ estatus, tipoEmpleado]) => {
            this.companias = compania;
            //this.sucursal = sucursal;
            this.estatus = estatus.dataSingle;
            console.log('estatus', this.estatus);
            this.tipoEmpleados = tipoEmpleado;
            console.log('tipoEmpleado', this.tipoEmpleados);
            this.isLoading = false;

          });
        
        }

        selectSucursal(event: Event){
          console.log('Sucursal seleccionada:', event);
          console.log('EVENT', event);
          const selectElement = event.target as HTMLSelectElement;
          //this.idSucursal = parseInt(selectElement.value);
          console.log('ID SUCURSAL', this.idSucursal);
        }

        cambiarCompania(event: any) {
          this.idCompania = event.value;
          console.log('CHANGE COMPANIA', this.idCompania);
          this.obtenerSucursales(this.idCompania);
        }
        cambiarTipoEmpleado(event: any) {
          this.idTipoEmpleado = event.value;
          console.log('CHANGE TIPO EMPLEADO', this.idTipoEmpleado);
        }
        obtenerSucursales(idCompania: number) {
          this.apiComedor.obtenerSucursales(idCompania).subscribe(
            (response) => {
              if (response.length > 0) {
                //this.isLoading = false;
                //this.notificacionService.showNotification(response.message, 'warning');
                this.sucursal =  response.dataList;
                console.log('response true sucursal ==>', response.dataList);
                console.log('sucursal true', this.sucursal);
              } else {
                this.sucursal =  response.dataList;
                console.log('sucursal false sucursal ==>', response.dataList);
              }
            },
            (error) => {
              this.isLoading = false;
              //this.notificacionService.showNotification('Error al obtener las sucursales. Por favor, intenta de nuevo más tarde.', 'error');
              console.error('Error al obtener municipios:', error);
            }
          );
        }

    }