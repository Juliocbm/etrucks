import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { GeneralParametersService } from '../../../../shared-module/services/general-parameters.service';
import { mttoEquipoComputo } from 'src/app/models/ti/mttoEquipoComputo';
import { ApiMttoEquipoComputo } from 'src/app/DataAccess/api-ti-mttoEquipoComputo.service';
import { MttoEquipoComputoService } from 'src/app/ti/Services/mttoEquipoComputo.service';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';

@Component({
   // selector: 'app-catalogo-cpMunicipio',
    templateUrl: './mttoEquipoComputo-view.component.html',
    styleUrls: ['./mttoEquipoComputo-view.component.css']
})
export class MttoEquipoComputoView{
    Mtto : mttoEquipoComputo = new mttoEquipoComputo;
    columns: string[] = ['num_activo', 'activo',  'estatus', 'fecha_adquisicion', 'fecha_asignacion', 'fecha_ult_preventivo', 'siguienteMtto', 'estatusMtto', 'semaforo']
        columnConfigs: {[key: string]: ColumnConfig } = {
            num_activo: { displayName: 'No Activo', type: 'default', showFilter: true , visible: true},
            clasificacionActivo: { displayName: 'Tipo', type: 'default', showFilter: true , visible: true},
            activo: { displayName: 'Nombre', type: 'default', showFilter: true , visible: true},
            estatus: { displayName: 'Estatus', type: 'default', showFilter: true, visible: true},
            fecha_adquisicion: { displayName: 'Adquisicion', type: 'default', showFilter: false, visible: true},
            fecha_asignacion: { displayName: 'Asignacion', type: 'default', showFilter: false, visible: true},
            fecha_ult_preventivo: { displayName: 'Ult Preventivo', type: 'default', showFilter: false, visible: true },
            siguienteMtto: { displayName: 'Sig Mtto', type: 'default', showFilter: false, visible: true},
            estatusMtto: { displayName: 'Estatus Mtto', type: 'default', showFilter: true, visible: true},
            semaforo: { displayName: 'Indicador', type: 'icon', showFilter: false, visible: true}
        };

      
      
        tableConfigs: TableConfig = 
        {
          pageSizeOptions: [5, 15, 30],
          headerColumFontSize: 5    
        };

        datos: mttoEquipoComputo[] = [];
        showAlert = false;
        alertMessage = '';
        alertType = '';
        datosFiltrados: mttoEquipoComputo[] = [];
        idCompania = 0;
        isLoading: boolean = false;
        constructor(
            private MttoService: MttoEquipoComputoService, 
            private apiMtto: ApiMttoEquipoComputo, 
            private router: Router,
            private generalParametersService: GeneralParametersService
            )
        {
            this.Mtto = new mttoEquipoComputo();
        }

        obtenerMtto()
        {
            this.apiMtto.obtenerDatos().subscribe(
                response => {
                  this.datos = response;
                  
                },
                error => {
                  console.error('Ha ocurrido un error al obtener los datos', error);
                }
              );
        }

        ngOnInit(){

            this.generalParametersService.selectedCompany$.subscribe(compañia => this.idCompania = compañia == null ? 0 : Number(compañia));

            this.apiMtto.obtenerDatos().subscribe(
                response => {
                  this.datos = response;
                  this.datosFiltrados = this.datos;
                  console.log('activos ...', this.datosFiltrados);
                },
                error => {
                  console.error('Ha ocurrido un error al obtener los datos', error);
                }
              );

            console.log(this.Mtto);
            this.MttoService.mttoEquipoComputoSourceActual.subscribe(status => 
            this.Mtto = status
            )
    
            
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

       
        /*
        cambiarEstado(companiaSeguimientoViaje : TipoSeguimientoViaje)
        {
            const nuevoEstado = !companiaSeguimientoViaje.activo;
            this.apiTipoSeguimientoViaje.actualizarDatos({...companiaSeguimientoViaje, activo: nuevoEstado}).subscribe(
                ()=> {
                    companiaSeguimientoViaje.activo = nuevoEstado;
                    this.triggerAlert(`Estatus de remolque ${nuevoEstado ? 'activada' : 'desactivada'} exitosamente!`, 'success');
                },
                error => {
                console.log(error);
                this.triggerAlert('Error al cambiar el estado de la estatus', 'danger');
                }
            );
        }
        */
        refreshData()
        {
            this.apiMtto.obtenerDatos().subscribe(
                response => {
                  this.datos = response;
                  this.datosFiltrados = this.datos;
                  console.log('activos ...', this.datosFiltrados);
                },
                error => {
                  console.error('Ha ocurrido un error al obtener los datos', error);
                }
              );
        }

    }