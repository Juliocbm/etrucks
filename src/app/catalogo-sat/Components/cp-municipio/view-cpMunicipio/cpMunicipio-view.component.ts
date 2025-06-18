import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnConfig } from '../../../../shared-module/Interfaces/ColumnConfig';
import { GeneralParametersService } from '../../../../shared-module/services/general-parameters.service';
import { cpMunicipio } from 'src/app/models/catalogo-sat/cpMunicipio';
import { ApiCpMunicipio } from 'src/app/DataAccess/api-catalogoSat-cpMunicipio.service';
import { CpMunicipioService } from 'src/app/catalogo-sat/Services/cpMunicipio.service';
import { pageModel } from 'src/app/models/paginacion/pageModel';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';

@Component({
    selector: 'app-catalogo-cpMunicipio',
    templateUrl: './cpMunicipio-view.component.html',
    styleUrls: ['./cpMunicipio-view.component.css']
})
export class CpMunicipioView{
    cp : cpMunicipio = new cpMunicipio;
    //columns: string[] = ['id', 'cp',  'estado', 'municipio', 'localidad']
        columnConfigs: {[key: string]: ColumnConfig } = {
            id: { displayName: 'ID', type: 'default', showFilter: false, visible: true },
            cp: { displayName: 'Codigo Postal', type: 'default', showFilter: true, visible: true },
            estado: { displayName: 'Estado', type: 'default', showFilter: true, visible: true},
            municipio: { displayName: 'Municipio', type: 'default', showFilter: true, visible: true},
            localidad: { displayName: 'Localidad', type: 'default', showFilter: true, visible: true}
        };

        tableActions: TableAction[] = [
            {
              name: 'ver',
              title: 'Ver',
              icon: 'visibility',
              tooltip: 'Ver detalle',
              callback: (item) => this.goToVer(item)
            },
            {
              name: 'editar',
              title: 'Editar',
              icon: 'edit',
              tooltip: 'Editar',
              callback: (item) => this.goToEditar(item)
            }    
          ];
        
          tableConfigs: TableConfig = 
          {
            pageSizeOptions: [5, 15, 30],
            headerColumFontSize: 8   
          };
          isLoading: boolean = false;
        datos: cpMunicipio[] = [];
        showAlert = false;
        alertMessage = '';
        alertType = '';
        datosFiltrados: cpMunicipio[] = [];
        idCompania = 0;

        constructor(
            private cpService: CpMunicipioService, 
            private apiCp: ApiCpMunicipio, 
            private router: Router,
            private generalParametersService: GeneralParametersService
            )
        {
            this.cp = new cpMunicipio();
        }

        obtenerPaginas()
        {
            this.apiCp.obtenerDatos(1).subscribe(
                response => {
                  this.datos = response.modelo;
                  
                  //console.log('Api datos ', this.datosFiltrados, response)

                  for (var page = 2; page <= response.totalPage ; page++) 
                  {
                    //console.log('Obteniendo pagina ', page, '...');
                    this.apiCp.obtenerDatos(page).subscribe( paginas => {

                        paginas.modelo.forEach((element: any) => {
                            this.datos = [...this.datos, element];
                        });

                        
                        //this.datos.push(paginas.modelo);
                        this.datosFiltrados = this.datos;
                        //console.log('Paginas arreglo ....', this.datosFiltrados);
                    });
                  }
                  
                  
                },
                error => {
                  console.error('Ha ocurrido un error al obtener los datos', error);
                }
              );
        }

        ngOnInit(){

            this.generalParametersService.selectedCompany$.subscribe(compañia => this.idCompania = compañia == null ? 0 : Number(compañia));

            this.obtenerPaginas()

            console.log(this.cp);
            this.cpService.CpMunicipioActual.subscribe(status => 
            this.cp = status
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

        goToEditar(cp: cpMunicipio)
        {
            this.cpService.changeCpMunicipioSource(cp);
            this.router.navigate(['catalogoCp/EditarCpmunicipio']);
        }

        goToVer(cp: cpMunicipio)
        {
            //console.log(remolqueEstatus);
            this.cpService.changeCpMunicipioSource(cp);
            this.router.navigate(['catalogoCp/VerCpmunicipio']);
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
           this.obtenerPaginas()
        }

    }