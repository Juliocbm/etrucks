import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ApiEdiService } from 'src/app/DataAccess/Edi/api-edi.service';
import { VwEdiClienteParadasGeocerca } from 'src/app/models/Edi/vwEdiClienteParadasGeocercasModel';
import { VwTipoParadaEvento } from 'src/app/models/Edi/vwTipoParadaEventoModel';
import { ConfiguracionParametros, ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';
import { StorageService } from 'src/app/Services/StorageService';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { NotificacionService } from 'src/app/shared-module/services/notificacion.service';
import { DisplayColumnConfigDF } from 'src/app/shared-module/Interfaces/DisplayColumnConfigDF';
import { ModalCrudGeocercaStopComponent } from '../modal-crud-geocerca-stop/modal-crud-geocerca-stop.component';
import { ModalSeleccionarConexionComponent } from '../modal-seleccionar-conexion/modal-seleccionar-conexion.component';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { ParametrosDropdownGeocercaStop } from 'src/app/shared-module/configuracionDropdowns/parametrosGenerales.config';

@Component({
  selector: 'app-geocerca-stop',
  templateUrl: './geocerca-stop.component.html',
  styleUrls: ['./geocerca-stop.component.css']
})
export class GeocercaStopComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('myTable') myTable: any;
  
  usuario = localStorage.getItem('usuario');
  idCompania = Number(localStorage.getItem('CompaniaSelect'));
  
  // Loading states
  isLoadingTipoParadaEvento = false;
  isLoadingEdiClienteParadasGeocerca = false;
  
  // Alert states
  alertType = '';
  alertMessage = '';
  showAlert = false;

  // Data arrays
  dataTipoParadaEvento: VwTipoParadaEvento[] = [];
  dataFiltradaTipoParadaEvento: VwTipoParadaEvento[] = [];
  dataEdiClienteParadasGeocerca: VwEdiClienteParadasGeocerca[] = [];
  dataFiltradaEdiClienteParadasGeocerca: VwEdiClienteParadasGeocerca[] = [];
  dataConexionDetalle: any[] = [];
  dataFiltradaConexionDetalle: any[] = [];

  // Table configurations for TipoParadaEvento
  columnConfigsvwTipoParadaEvento: { [key: string]: ColumnConfig } = {
    idTipoParadaEvento: { displayName: 'ID', type: 'default', showFilter: true, visible: false },
    idConexionDetalle: { displayName: 'ID', type: 'default', showFilter: true, visible: false },
    conexionDetalle: { displayName: 'DESCRIPCION', type: 'default', showFilter: true, visible: true },
    idTipoParada: { displayName: 'ID', type: 'default', showFilter: true, visible: false },
    tipoParada: { displayName: 'DESCRIPCION', type: 'default', showFilter: true, visible: true },
    idEvento: { displayName: 'ID', type: 'default', showFilter: true, visible: false },
    evento: { displayName: 'DESCRIPCION', type: 'default', showFilter: true, visible: true },
    orden: { displayName: 'ORDEN', type: 'default', showFilter: true, visible: true },
    activo: { displayName: 'ACTIVO', type: 'boolean', trueValue: 'SI', falseValue: 'NO', showFilter: true, visible: true },
    creadoPor: { displayName: 'CREADO POR', type: 'default', showFilter: true, visible: false },
    fechaCreacion: { displayName: 'FECHA CREACION', type: 'date', showFilter: true, visible: false },
    modificadoPor: { displayName: 'MODIFICADO POR', type: 'default', showFilter: true, visible: false },
    fechaModificacion: { displayName: 'FECHA MODIFICACION', type: 'date', showFilter: true, visible: false }
  };

  tableActionsVwTipoParadaEvento: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClickTipoParada(item)
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Editar',
      callback: (item) => this.onEditClickTipoParada(item)
    }
  ];

  // tableConfigsvwTipoParadaEvento = {
  //   pageSizeOptions: [5, 15, 30],
  //   headerColumFontSize: 5
  // };

  tableConfigsvwTipoParadaEvento: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 10,
    createCallback: () => this.onCreateClickTipoParada()
  };

  // Table configurations for EdiClienteParadasGeocerca
  columnConfigsvwEdiClienteParadasGeocerca: { [key: string]: ColumnConfig } = {
    idEdiClienteParadasGeocerca: { displayName: 'ID', type: 'default', showFilter: true, visible: false },
    idEdiClienteParada: { displayName: 'ID', type: 'default', showFilter: true, visible: false },
    clienteParada: { displayName: 'CLIENTE PARADA', type: 'default', showFilter: true, visible: true },
    idGeocerca: { displayName: 'ID', type: 'default', showFilter: true, visible: false },
    // geocerca: { displayName: 'GEOCERCA', type: 'default', showFilter: true, visible: false },
    geocercasConcatenadas: { displayName: 'GEOCERCA', type: 'default', showFilter: true, visible: true },
    activo: { displayName: 'ACTIVO', type: 'boolean', trueValue: 'SI', falseValue: 'NO', showFilter: true, visible: true },
    creadoPor: { displayName: 'CREADO POR', type: 'default', showFilter: true, visible: false },
    nombreCreadoPor: { displayName: 'CREADO POR', type: 'default', showFilter: true, visible: true },
    fechaCreacion: { displayName: 'FECHA CREACION', type: 'date', showFilter: true, visible: false },
    modificadoPor: { displayName: 'MODIFICADO POR', type: 'default', showFilter: true, visible: false },
    nombreModificadoPor: { displayName: 'MODIFICADO POR', type: 'default', showFilter: true, visible: true },
    fechaModificacion: { displayName: 'FECHA MODIFICACION', type: 'date', showFilter: true, visible: false }
  };

  tableActionsVwEdiClienteParadasGeocerca: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClickGeocerca(item)
    },
    {
      name: 'edit',
      title: 'Editar',
      icon: 'mode_edit',
      tooltip: 'Editar',
      callback: (item) => this.onEditClickGeocerca(item)
    }
  ];

  tableConfigsvwEdiClienteParadasGeocerca: TableConfig =
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 10,
    createCallback: () => this.onCreateClickGeocerca()
  };

  // Dropdown configurations
  parametrosConexionDetalle = ParametrosDropdownGeocercaStop;

  displayColumnConfigDFConexionDetalle: DisplayColumnConfigDF =
  {
    identificador: 'idConexionDetalle',
    separadorColumnas: ' - ',
    columnas: ['idConexionDetalle', 'descripcion', 'scac']
  };
  columnConfigsConexionDetalle : { [key: string]: ColumnConfig } = {
    idConexionDetalle: { displayName: 'ID', type: 'default', showFilter: true, visible: true },
    descripcion: { displayName: 'NOMBRE', type: 'default', showFilter: true, visible: true },
    scac: { displayName: 'SCAC', type: 'default', showFilter: true, visible: true }
  }
  conexionDetalleSelected: any = ({});
  tableConfigsConexionDetalle: TableConfig//{ [key: string]: any }
   = 
  {
    pageSizeOptions: [5, 15, 30],
    headerColumFontSize: 5
  }

  constructor(
    public apiEDI: ApiEdiService,
    private notificacionService: NotificacionService,
    private storageService: StorageService<any>,
    private dialog: MatDialog,
    private configParams: ConfiguracionParametros
  ) {}

  ngOnInit(): void {
    if (!this.conexionDetalleSelected?.idConexionDetalle) {
      this.openSeleccionarConexionModal();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadConexionDetalle() {
    const parametros = this.configParams.configurar(
      this.parametrosConexionDetalle
    );

    this.apiEDI.getConexionDetalle(parametros).subscribe({
      next: (result) => {
        this.dataConexionDetalle = result;
        this.dataFiltradaConexionDetalle = [...this.dataConexionDetalle];
      },
      error: (error) => {
        console.error('Error loading conexion detalle:', error);
        this.notificacionService.showNotification('Error al cargar conexiones detalle', 'error');
      }
    });
  }

  onSeleccionaConexionDetalle(item: any) {
    this.conexionDetalleSelected = item;
    if (item?.idConexionDetalle) {
      this.initializeData();
    }
  }

  initializeData() {
    if (this.conexionDetalleSelected?.idConexionDetalle) {
      // this.initializeDataTipoParadaEvento();
      this.initializeDataEdiClienteParadasGeocerca();
    }
  }

  initializeDataTipoParadaEvento() {
    this.isLoadingTipoParadaEvento = true;
    const params: ParametrosGenerales = {
      ordenarPor: 'idTipoParadaEvento',
      descending: true,
      noPagina: 1,
      tamanoPagina: 100,
      activos: true,
      idCompania: this.idCompania,
      filtrosPorColumna: {
        idConexionDetalle: this.conexionDetalleSelected.idConexionDetalle
      },
      filtrosIniciales: {},
      rangoFechas: '',
      multiIds: '',
      actionMulti: ''
    };

    const parametros = this.configParams.configurar(
      params
    );

    this.apiEDI.getTipoParadaEvento(parametros).subscribe({
      next: (result : any) => {
        console.log('Result tipo parada evento:',result);
        this.dataTipoParadaEvento = result.items;
        this.dataFiltradaTipoParadaEvento = [...this.dataTipoParadaEvento];
        this.isLoadingTipoParadaEvento = false;
      },
      error: (error) => {
        console.error('Error loading tipo parada evento:', error);
        this.notificacionService.showNotification('Error al cargar tipos de parada evento', 'error');
        this.isLoadingTipoParadaEvento = false;
      }
    });
  }

  initializeDataEdiClienteParadasGeocerca() {
    this.isLoadingEdiClienteParadasGeocerca = true;
    const params: ParametrosGenerales = {
      ordenarPor: 'idEdiClienteParadasGeocerca',
      descending: true,
      noPagina: 1,
      tamanoPagina: 100,
      activos: true,
      idCompania: this.idCompania,
      filtrosIniciales: {idConexionDetalle: this.conexionDetalleSelected.idConexionDetalle},
      filtrosPorColumna: {},
      rangoFechas: '',
      multiIds: '',
      actionMulti: ''
    };

    const parametros = this.configParams.configurar(
      params
    );

    this.apiEDI.getEdiClienteParadasGeocerca(parametros).subscribe({
      next: (result : any) => {
        console.log('Result edi cliente paradas geocerca:', result);
        this.dataEdiClienteParadasGeocerca = result.items;
        this.dataFiltradaEdiClienteParadasGeocerca = [...this.dataEdiClienteParadasGeocerca];
        this.isLoadingEdiClienteParadasGeocerca = false;
      },
      error: (error) => {
        console.error('Error loading edi cliente paradas geocerca:', error);
        this.notificacionService.showNotification('Error al cargar geocercas', 'error');
        this.isLoadingEdiClienteParadasGeocerca = false;
      }
    });
  }

  // Navigation handlers for TipoParadaEvento
  onDetailClickTipoParada(item: any) {
    const dialogRef = this.dialog.open(ModalCrudGeocercaStopComponent, {
      width: '600px',
      data: { mode: 'view', type: 'tipoParadaEvento', item }
    });
  }

  onEditClickTipoParada(item: any) {
    const dialogRef = this.dialog.open(ModalCrudGeocercaStopComponent, {
      width: '600px',
      data: { mode: 'edit', type: 'tipoParadaEvento', item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initializeDataTipoParadaEvento();
      }
    });
  }

  onCreateClickTipoParada() {
    const dialogRef = this.dialog.open(ModalCrudGeocercaStopComponent, {
      width: '600px',
      data: { mode: 'create', type: 'tipoParadaEvento' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initializeDataTipoParadaEvento();
      }
    });
  }

  // Navigation handlers for EdiClienteParadasGeocerca
  onDetailClickGeocerca(item: any) {
    console.log('Item:', item);
    const dialogRef = this.dialog.open(ModalCrudGeocercaStopComponent, {
      width: '600px',
      data: { mode: 'view', type: 'ediClienteParadasGeocerca', item }
    });
  }

  onEditClickGeocerca(item: any) {
    const dialogRef = this.dialog.open(ModalCrudGeocercaStopComponent, {
      width: '600px',
      data: { mode: 'edit', type: 'ediClienteParadasGeocerca', item }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initializeDataEdiClienteParadasGeocerca();
      }
    });
  }

  onCreateClickGeocerca() {
    const dialogRef = this.dialog.open(ModalCrudGeocercaStopComponent, {
      width: '600px',
      data: { mode: 'create', type: 'ediClienteParadasGeocerca' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initializeDataEdiClienteParadasGeocerca();
      }
    });
  }

  openSeleccionarConexionModal() {
    const dialogRef = this.dialog.open(ModalSeleccionarConexionComponent, {
      width: '80%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.conexionDetalleSelected = result;
        this.initializeData();
      }
    });
  }

  onCreateClick() {
    const dataForModal = {
      TITULO_MODAL: 'Geocerca Stop',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(ModalCrudGeocercaStopComponent, {
      width: '1000px',
      data: { mode: 'create', type: 'ediClienteParadasGeocerca' }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.initializeDataEdiClienteParadasGeocerca();
    });
  }

}
