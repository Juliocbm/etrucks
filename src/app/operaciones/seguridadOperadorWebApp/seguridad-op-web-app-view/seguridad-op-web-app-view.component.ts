import { columnConfigsOperadorUsuario, tableConfigs } from './../configCatSeguridadOpWebView';
import { Component, OnInit } from '@angular/core';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { OperadorUsuario } from 'src/app/models/Operaciones/OperadorUsuario';
import { VwOperadorUsuario } from 'src/app/models/Operaciones/VwOperadorUsuario';
import { AlertService } from 'src/app/Services/alert.service';
import { ParametrosDropdownOperadorUsuario } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { ConfiguracionParametros } from 'src/app/models/SistemaGeneral/ParametrosGenerales';

@Component({
  selector: 'app-seguridad-op-web-app-view',
  templateUrl: './seguridad-op-web-app-view.component.html',
  styleUrls: ['./seguridad-op-web-app-view.component.css']
})
export class SeguridadOpWebAppViewComponent implements OnInit {

  idCompania = Number(localStorage.getItem('CompaniaSelect'));
  usuario = localStorage.getItem('usuario') ?? '';

  // Alert states
  alertType = '';
  alertMessage = '';
  showAlert = false;
  isLoading: boolean = false;

  //Datos
  dataOperadorUsuarios: VwOperadorUsuario[] = [];

  // Parametros generales para la consulta de operadorUsuario
  paramsOperadorUsuario = ParametrosDropdownOperadorUsuario;

  //Configuracion tabla
  tableConfigs = tableConfigs;
  columnConfigsOperadorUsuario = columnConfigsOperadorUsuario;

  tableActionsVwOperadorUsuario: TableAction[] = [
    {
      name: 'edit',
      title: 'Generar clave',
      icon: 'autorenew',
      tooltip: 'Generar clave',
      callback: (item) => this.generarClave(item),
    }
  ];

  constructor(private apiOperacionesService: ApiOperacionesService, private alertService: AlertService,
    private configParams:ConfiguracionParametros) { }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    this.getData();
  }

  getData(): void {
    this.isLoading = true;

    const parametros = this.configParams.configurar(this.paramsOperadorUsuario);

    this.apiOperacionesService
      .obtenerOperadorUsuario(parametros)
      .subscribe((data: any) => {
        // console.log('DATA', data);
        // console.log('items', data.items);

        if (data.success) {
          this.dataOperadorUsuarios = data.items;
        } else {
          this.alertService.info('Ocurrio un error al obtener los operadores: ' + data.message);
        }
        this.isLoading = false;
      }, (error) => {
        console.error('Ocurrio un error al obtener los operadores', error)
        this.alertService.info('Ocurrio un error al obtener los operadores')
        this.isLoading = false;
      });
  }

  mostrarPin(item: VwOperadorUsuario): void {
    // functionEvent: (event) => this.todosPermisos(event)
    // item.pin = '123';
  }

  generarClave(item: VwOperadorUsuario): void {
    const operadorUsuario = item as OperadorUsuario;
    // this.isLoading = true;
    // Realizar post cuando el valor sea 0
    if (operadorUsuario.idOperadorUsuario == 0) {
      this.apiOperacionesService.postOperadorUsuario(operadorUsuario).subscribe(
        (res: any) => {
          // console.log('post', res);
          if (res.success) {
            item.idOperadorUsuario = res.item.idOperadorUsuario;
            item.fechaCreacion = res.item.fechaCreacion;
            item.creadoPor = res.item.creadoPor;
            item.usuarioCreadoPor = this.usuario;
            item.fechaModificacion = res.item.fechaModificacion;
            item.modificadoPor = res.item.modificadoPor;
            item.usuarioModificadoPor = this.usuario;
            item.clave = res.item.clave;
            item.claveValida = true;
            this.alertService.success('La clave se ha generado con éxito. Por favor, compártala con el operador.');
          }
          else {
            this.alertService.info('Ocurrio un error al obtener los operadores: ' + res.message);
          }
          // this.isLoading = false;
        },
        (error) => {
          console.error('Ocurrio un error al generar la clave del operador', error)
          this.alertService.info('Ocurrio un error al generar la clave del operador');
          // this.isLoading = false;
        }
      )
    }
    else {
      this.apiOperacionesService.putOperadorUsuario(operadorUsuario).subscribe(
        (res: any) => {
          if (res.success) {
            // console.log('put', res);
            item.claveValida = res.item.claveValida;
            item.fechaModificacion = res.item.fechaModificacion;
            item.modificadoPor = res.item.modificadoPor;
            item.usuarioModificadoPor = this.usuario;
            item.clave = res.item.clave;
            item.claveValida = true;
            this.alertService.success('La clave se ha generado con éxito. Por favor, compártala con el operador.');
          }
          else {
            this.alertService.info('Ocurrio un error al obtener los operadores: ' + res.message);
          }
          // this.isLoading = false;
        },
        (error) => {
          console.error('Ocurrio un error al generar la clave del operador', error)
          this.alertService.info('Ocurrio un error al generar la clave del operador');
          // this.isLoading = false;
        }
      )
    }
  }

}
