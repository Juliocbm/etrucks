import { AfterViewInit, Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Routes } from 'src/app/app-routes.constants';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { Visita, VisitaDTO } from 'src/app/models/Operaciones/Visita';
import { Sucursal } from 'src/app/models/RH/sucursal';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { CatalogoGeneralService } from 'src/app/sistema-general/services/catalogo-general.service';
import { ModalCrudVistasComponent } from '../modal-crud-vistas/modal-crud-vistas.component';
import { Usuario } from 'src/app/models/Administrador/Usuario';
import { Proveedor } from 'src/app/models/Operaciones/Proveedores';
import { forkJoin } from 'rxjs';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { ApiAdministradorService } from 'src/app/DataAccess/api-administrador.service';
import { VisitaNoLoggedComponent } from '../visita-no-logged/visita-no-logged.component';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';
import { ConfiguracionParametros, ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { ParametrosDropdownVisita } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent implements  AfterViewInit {
  nombre: string = localStorage.getItem('nombre') || '';
  public idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');
  usuario: string = localStorage.getItem('usuario') || '';
  createRoute: string = Routes.bitacora.create();

  visitas: VisitaDTO[] = [];
  proveedores: Proveedor[] = [];

  showAlert = false;
  alertMessage = '';
  alertType = '';
  idCatPadre: string = '';
  isLoading: boolean = false;
  isLogged: boolean = false;


  columnConfigs: { [key: string]: ColumnConfig } = {
    idVisita: { displayName: 'ID Visita', type: 'number', showFilter: true, visible: true },
    nombreVisitante: { displayName: 'Nombre Visitante', type: 'default', showFilter: true, visible: true },
    documentoIdentidad: { displayName: 'Documento Identidad', type: 'default', showFilter: true, visible: true },
    tipoDocumento: { displayName: 'Tipo Documento', type: 'default', showFilter: true, visible: true },
    fechaVisita: { displayName: 'Fecha Visita', type: 'date', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    horaEntrada: { displayName: 'Hora Entrada', type: 'date', format: 'hh:mm a', showFilter: true, visible: true },
    horaSalida: { displayName: 'Hora Salida', type: 'date', format: 'hh:mm a', showFilter: true, visible: true },
    sucursalID: { displayName: 'ID Sucursal', type: 'number', showFilter: true, visible: false },
    nombre: { displayName: 'Sucursal', type: 'default', showFilter: true, visible: true },
    tipoVisita: { displayName: 'Tipo Visita', type: 'default', showFilter: true, visible: true },
    motivoVisita: { displayName: 'Motivo Visita', type: 'default', showFilter: true, visible: false },
    proveedor: { displayName: 'Proveedor', type: 'default', showFilter: true, visible: true },
    accesoPermitido: { displayName: 'Acceso', type: 'boolean', trueValue: 'Permitido', falseValue: 'Denegado', showFilter: true, visible: false },
    estatusSolicitud: { displayName: 'Estatus Solicitud', type: 'default', showFilter: true, visible: true },
    esEmpleado: { displayName: 'Empleado', type: 'boolean', trueValue: 'SI', falseValue: 'NO', showFilter: false, visible: false },
    referencia: { displayName: 'Referencia', type: 'default', showFilter: true, visible: false },
    observaciones: { displayName: 'Observaciones', type: 'default', showFilter: true, visible: false },

    creado: { displayName: 'Creado', type: 'date', format: 'dd/MM/yyyy hh:mm a', showFilter: true, visible: false },
    creadoPor: { displayName: 'Creado Por', type: 'default', showFilter: true, visible: false },
    usuarioCreado: { displayName: 'Usuario Creado', type: 'default', showFilter: true, visible: false },

    modificado: { displayName: 'Modificado', type: 'date', format: 'dd/MM/yyyy hh:mm a', showFilter: true, visible: false },
    modificadoPor: { displayName: 'Modificado Por', type: 'default', showFilter: true, visible: false },
    usuarioModificado: { displayName: 'Usuario Modificado', type: 'default', showFilter: true, visible: false },

    idCompania: { displayName: 'ID Compañía', type: 'number', showFilter: true, visible: false },
    activo: { displayName: 'Activo', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: false },
    idProveedor: { displayName: 'ID Proveedor', type: 'number', showFilter: true, visible: false },
    idPersonal: { displayName: 'ID Personal', type: 'default', showFilter: true, visible: false },
    tipoDocumentoID: { displayName: 'ID Tipo Documento', type: 'number', showFilter: true, visible: false },
    estatusSolicitudID: { displayName: 'ID Estatus Solicitud', type: 'number', showFilter: true, visible: false },
    fechaCambioEstatus: { displayName: 'Fecha Cambio Estatus', type: 'date', format: 'dd/MM/yyyy hh:mm a', showFilter: true, visible: false },
    correoDestinatario: { displayName: 'Correo Destinatario', type: 'default', showFilter: true, visible: false }
  };
  parametrosVisita = ParametrosDropdownVisita;
  
  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClick(item)
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Editar',
      callback: (item) => this.onEditClick(item)
    }
  ];
  tableConfigs: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5,
    createCallback: () => this.onCreateClick()
  };

  constructor(
    private apiOperacionesService: ApiOperacionesService,
    private apiHandler: ApiServiceHandler,
    private catGeneralService: CatalogoGeneralService,
    private storageService: StorageService<Visita>,
    public dialog: MatDialog,
    private configParams:ConfiguracionParametros
  ) {
    this.catGeneralService.regGeneralSourceActual.subscribe((registro) => {
      this.idCatPadre = registro.idCatGeneral;
    });
    this.idCompania = parseInt(localStorage.getItem('CompaniaSelect') || '0');
    this.isLogged = Boolean(localStorage.getItem('auth_token'));
  }

  ngAfterViewInit(): void {
    this.isLogged ? this.GetInfo() : this.openDialog();
  }

  GetInfo() {
    this.isLoading = true;

   const ParametrosVisita = this.configParams.configurar(this.parametrosVisita);

    forkJoin([
      this.apiHandler.getDatosAsync(() => this.apiOperacionesService.getVisitas(ParametrosVisita), 'visitas'),
      this.apiHandler.getDatosAsync(() => this.apiOperacionesService.getProveedores(this.idCompania), 'proveedores'),
    ]).subscribe(([ visita,proveedor ]) => {
      this.visitas = visita.items;
      this.proveedores = proveedor;

      // Mapear los datos en el objeto de visita
      this.visitas = this.visitas.map((visita: VisitaDTO) => {
        const proveedor = this.proveedores.find((proveedor) => proveedor.id_proveedor === visita.idProveedor);
        return {
          ...visita,
          proveedor: proveedor?.nombre_proveedor || 'Sin Proveedor'
        };
      });

      this.ValidacionVisita();
      this.isLoading = false;
    });
  }

  // Validacion de la informacion de la visita
  ValidacionVisita(){

    // Cantidad de registros de la tabla de visitas
    // console.log('visitas', this.visitas.length);

    const menuPermisos = localStorage.getItem('DECODE-TOKEN');
    const permisos = JSON.parse(menuPermisos!);
    // console.log('menuPermisos', permisos);

    // Filtra la informacion de visitas segun los permisos del usuario en el id (1089 / Visita)
    const permisosVisitas = permisos.find((permiso: any) => permiso.Id === 1089);
    // console.log('permisosVisitas', permisosVisitas);

    // Permisos de Crear, Editar, Eliminar y Ver
    const permisosVisitasAll = permisosVisitas.Crear && permisosVisitas.Editar && permisosVisitas.Eliminar;
    console.log('permisosVisitasAll', permisosVisitasAll);

   // Si el usuario tiene permisos de Crear, Editar, Eliminar y Ver se muestra toda la informacion y si no solo los 3 primeros registros de la tabla y que sea del usuario logueado
    if (permisosVisitasAll) {
      this.visitas = this.visitas;
    } else {
      this.visitas = this.visitas.filter((visita) => visita.usuarioCreado === this.usuario);
      this.visitas = this.visitas.slice(0, 3);
    }
  }

  openDialog() {
    const dataForModal = {
      TITULO_MODAL: 'Visita No Logueado',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(VisitaNoLoggedComponent,{
      width: '1000px',
      height: '700px',
      data: dataForModal // Pasa el objeto específico
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.GetInfo();
      }
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'REGISTRO VISITA',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudVistasComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'DETALLE VISITA',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalCrudVistasComponent, {
      width: '1000px',
      height:'600px',
      data: dataForModal // Pasa el objeto extendido
    });

    console.log('rowData', rowData);

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  onEditClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'EDICION VISITA',  // titulo para el modal
      TIPO_MODAL: 'EDIT'
    };

    const dialogRef = this.dialog.open(ModalCrudVistasComponent, {
      width: '800px',
      height:'600px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.retriveData();
    });
  }

  retriveData() {
    this.GetInfo();
  }


  triggerAlert(message: string, type: string) {
    this.showAlert = true;
    this.alertMessage = message;
    this.alertType = type;

    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

}
