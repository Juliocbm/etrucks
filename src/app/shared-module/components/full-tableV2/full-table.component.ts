import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import {
  BsDatepickerConfig,
  BsDaterangepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { ExportTableExcelService } from '../../services/export-table-excel.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableAction } from '../../Interfaces/TableAction';
import { MatDialog } from '@angular/material/dialog';
import { ColumnVisibilityModalComponent } from '../column-visibility-modal/column-visibility-modal.component';
import { ColumnConfig } from '../../Interfaces/ColumnConfig';
import { Observable } from 'rxjs';
import {
  ParametrosGenerales,
  ConfiguracionParametros,
} from '../../../models/SistemaGeneral/ParametrosGenerales';
import { HttpParams } from '@angular/common/http';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LoadingService } from '../../../Services/loading.service';
import { ExportNotificationService } from '../../services/export-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-full-tableV2',
  templateUrl: './full-table.component.html',
  styleUrls: ['./full-table.component.css'],
})
//, OnChanges
export class FullTableV2Component
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  [x: string]: any;

  // Objeto para manejar la cancelación de suscripciones de Observable
  private destroy$ = new EventEmitter<void>();

  // Variables para el control de la exportación
  private exportSubscription: Subscription | null = null;
  isExportInProgress: boolean = false;

  bsConfigGeneral: Partial<BsDatepickerConfig> | undefined;
  maxDate: Date = new Date(); // Fecha máxima hoy
  minDate: Date = new Date(); // Fecha mínima 30 días atrás

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  public styleRow: { [clave: string]: string } = {};
  public isToggleChecked: boolean = true;

  @ViewChildren('filterInput') filterInputs!: QueryList<ElementRef>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('matTableWrapper') matTableWrapper!: ElementRef;

  get columnKeys() {
    /* return Object.keys(this.columnConfigs); */
    return Object.keys(this.columnConfigs).filter((key) => key !== 'select');
  }

  //Se reciben los datos que mostrará la tabla
  @Input() data: any[] = [];
  //Se reciben los datos que mostrará en campo editable select
  // @Input() dataSelect: any[] = [];
  @Input() dataSelect: any[][] = [];
  //Se reciben las columnas que debe renderizar la tabla
  /* @Input() columns: string[] = [];  */
  //Se reciben las configuraciones de las columnas que se mostrarán
  @Input() columnConfigs: any;

  @Input() withHeader: boolean = true;

  //Se reciben configuraciones generales de la tabla como datos de paginacion y fontsize
  @Input() tableConfigs: any = {};
  //Se recibe el nombre del menu para aplicar el correcto permiso por usuario
  @Input() nombreMenu: string = '';
  //Se recibe el idMenu para aplicar el correcto permiso por usuario
  @Input() idMenu: number = 0;
  //Se recibe el titulo de la tabla
  @Input() nombreTabla: string = '';
  //Se recibe la ruta a la que navegara cuando se use el boton [crear] propio de la tabla
  @Input() crearRoute: string = '';
  //Se recibe la indicacion sobre si se debe mostrar el boton [crear] normal
  @Input() showCreateButton = false;
  //Se recibe la indicacion sobre si se debe mostrar el boton [crear] normal
  @Input() showCreateButtonModal = false;
  //Se recibe la indicacion sobre si se debe mostrar el boton [exportar a excel] que descarga un archivo excel
  @Input() showExportarButton: boolean = true;
  //Se recibe el nombre con el que se debe guardar el archivo excel al exportar la tabla desde el boton [exportar a excel]
  @Input() excelFileName: string = '';
  //Se recibe la indicacion sobre si se debe mostrar el boton [crear] cuando es un catalogoGeneral
  @Input() showCreateButtonDetGral = false;
  //Se recibe la indicacion sobre si se debe mostrar el boton [refrescar datos] que refresca los datos de la tabla
  @Input() showRefreshButton: boolean = true;
  @Input() showAddButton: boolean = false;
  //Se recibe la indicacion sobre si se debe mostrar el boton [configuracion de columnas] que abre el modal para elegir que columnas visualizar
  @Input() showConfColumnsButton: boolean = true;
  //Se recibe la indicacion sobre si se debe mostrar el boton [incluir inactivos] que incluye los registros que estan en estatus de inactivo
  @Input() showFilterInactivos = true;
  //Se recibe un arreglo de configuracion de boton de accion, permite saber que botons de acciones debe renderizar
  @Input() actions: TableAction[] = [];
  @Input() resaltarSeleccion: boolean = false;
  @Input() mostrarFiltroGeneralFechas: boolean = false;
  @Input() showSelectAll: boolean = false;
  //Indica si esta "cargando" datos, y asi manejar la visualizacion del indicador loader
  @Input() isLoading: boolean = false;

  // Aquí defines el mínimo de columnas requeridas
  @Input() columnsReqMin: number = 3;

  rowSeleccionada: any;
  @Input() isReport = false;
  @Output() cambiarEstatusEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<void>();
  @Output() refreshEvent = new EventEmitter<void>();
  @Output() AddEvent = new EventEmitter<void>();
  @Output() onCreate: EventEmitter<void> = new EventEmitter();
  @Output() enviarItemEvent = new EventEmitter<void>();
  @Output() filtroFechaGeneralEvent = new EventEmitter<(Date | undefined)[]>();
  @Output() changeData = new EventEmitter<any>();
  @Output() filtroFechaReportEvent = new EventEmitter<Date | undefined>();
  // @Input() fetchDataFunction!: (params: HttpParams) => Observable<any>; // extraParam es opcional
  @Input() fetchDataFunction!: (
    params: HttpParams,
    extraParam?: any
  ) => Observable<any>; // extraParam es opcional

  @Input() beforeExportExcelFunction?: (
    params: HttpParams,
    extraParam?: any
  ) => Observable<any>; // extraParam es opcional

  @Output() onSelectAll: EventEmitter<void> = new EventEmitter();

  totalRecords: number = 0;
  formularioModificado: boolean = false;
  isSelectAll: boolean = false;

  @Input() parametros: ParametrosGenerales = new ParametrosGenerales();
  @Input() extraParams: { [key: string]: any } = {}; // Objeto con parámetros dinámicos

  //Nueva propiedad para centrar la tabla automáticamente
  @Input() centerTable: boolean = true;

  //Nueva propiedad para controlar la altura de la tabla
  @Input() tableHeight: string = 'auto'; // Opción para forzar una altura específica si se necesita

  //Propiedad para controlar la visibilidad del gran total
  @Input() showGranTotal: boolean = false;

  @Input() widthColumn: string = '20%';

  // Selección de filas
  @Input() selectable: boolean = false;
  @Output() selectedRowsChange = new EventEmitter<any[]>();
  selectedRows: Set<any> = new Set<any>();

  private emitSelectedRows() {
    this.selectedRowsChange.emit(Array.from(this.selectedRows));
  }

  clearSelection(): void {
    if (this.selectable) {
      this.selectedRows.clear();
      this.isSelectAll = false;
      this.emitSelectedRows();
    }
  }

  constructor(
    private excelService: ExportTableExcelService,
    public dialog: MatDialog,
    private configParams: ConfiguracionParametros,
    public loadingService: LoadingService,
    private exportNotificationService: ExportNotificationService
  ) {
    this.minDate.setDate(this.minDate.getDate() - 30);

    this.bsConfigGeneral = {
      minDate: this.minDate,
      maxDate: this.maxDate,
      containerClass: 'theme-orange',
      dateInputFormat: 'DD/MM/YYYY',
      isAnimated: true,
    };
  }

  // En tu componente o servicio
  getColumnConfigWithDefault(columnKey: string): ColumnConfig {
    const defaultConfig: ColumnConfig = {
      displayName: '', // Definir el nombre adecuado si es necesario
      type: 'default', // Puedes ajustar el tipo predeterminado según tus necesidades
      showFilter: true, // Opciones predeterminadas para otros atributos si es necesario
      visible: true,
    };

    const columnConfig = this.columnConfigs[columnKey];
    if (columnConfig) {
      // Combinar la configuración de columna existente con la configuración predeterminada
      return { ...defaultConfig, ...columnConfig };
    } else {
      // Si la configuración de columna no está definida, devolver la configuración predeterminada
      return defaultConfig;
    }
  }

  // Función para determinar si se debe bloquear el renglón
  shouldBlockRow(element: any): boolean {
    for (const columnKey of Object.keys(this.columnConfigs)) {
      const columnConfig = this.getColumnConfigWithDefault(columnKey);
      if (
        columnConfig.bloquearSeleccion &&
        columnConfig.bloquearSeleccion(element)
      ) {
        return true; // Se bloquea el renglón si se cumple la condición en alguna columna
      }
    }
    return false; // No se bloquea el renglón si no se encuentra ninguna condición de bloqueo
  }

  // Definir los rangos de fechas
  predefinedRanges: BsCustomDates[] = [
    { label: 'Hoy', value: [new Date(), new Date()] },
    {
      label: 'Últimos 7 Días',
      value: [
        new Date(new Date().setDate(new Date().getDate() - 6)),
        new Date(),
      ],
    },
  ];

  //Definir configuracion inicial para DateRangePicker
  bsConfig: Partial<BsDaterangepickerConfig> = {
    containerClass: 'theme-orange',
    dateInputFormat: 'DD/MM/YYYY',
    isAnimated: true,
  };

  //Abre modal para configurar que columnas configure para renderizar
  openColumnVisibilityDialog(): void {
    const columnsArray = Object.keys(this.columnConfigs)
      .filter((key) => key !== 'activo')
      .map((key) => ({
        key: key,
        ...this.columnConfigs[key],
      }));

    const dialogRef = this.dialog.open(ColumnVisibilityModalComponent, {
      width: '250px',
      data: { columns: columnsArray, columnsReqMin: this.columnsReqMin }, // Pasamos el mínimo de columnas
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Actualizar columnConfigs con los resultados
        result.forEach((column: { key: string | number; visible: any }) => {
          this.columnConfigs[column.key].visible = column.visible;
        });
        this.updateDisplayedColumns();
      }
    });
  }

    //Actualiza el arreglo de columnas a renderizar
  updateDisplayedColumns() {
    /*  if (this.columnConfigs.activo !== undefined)
      this.columnConfigs.activo.visible = false; */

    const visibleColumns = Object.keys(this.columnConfigs)
      .filter((key) => key !== 'select')
      .filter((key) => this.columnConfigs[key].visible);

    if (this.actions.length === 0) {
      this.displayedColumns = [...visibleColumns];
    } else {
      this.displayedColumns = [...visibleColumns, 'acciones'];
    }

    if (this.selectable) {
      this.displayedColumns = ['select', ...this.displayedColumns];
    }
  }

  onValueChangeDateGeneral(value?: (Date | undefined)[]): void {
    if (
      value &&
      value.length === 2 &&
      value[0] instanceof Date &&
      value[1] instanceof Date
    ) {
      this.filtroFechaGeneralEvent.emit(value);
    }

    if (value && value[0] instanceof Date && value[1] instanceof Date) {
      this.parametros.rangoFechas =
        this.fechaToString(value[0]) + '-' + this.fechaToString(value[1]);
    }

    this.parametros['noPagina'] = 1;
    this.parametros['tamanoPagina'] = 10;

    this.loadData();

    // Asegurar que el paginador se sincroniza
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalRecords;
  }

  //Ejecuta al cambiar el valor del DataRangePicker
  onValueChangeDate(
    value?: (Date | undefined)[],
    column: string = 'fechaCreacion'
  ): void {
    if (value == undefined) {
      this.resetDateFilter(column);
    }

    console.log('fecha ingresasa: ', value, column);

    if (
      value &&
      value.length === 2 &&
      value[0] instanceof Date &&
      value[1] instanceof Date
    ) {
      this.applyDateFilter(value[0], value[1], column);
    } else {
      this.resetDateFilter(column);
    }
  }

  ngAfterViewInit() {
    this.formularioModificado = true;

    // Cargar datos iniciales
    this.loadData();

    // Ajustar el tamaño de la tabla al espacio disponible
    this.adjustTableHeight();

    // Observar cambios en el tamaño de la ventana
    fromEvent(window, 'resize')
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkForHorizontalOverflow();
        this.adjustTableHeight();
      });

    // Verificar si hay overflow horizontal
    this.checkForHorizontalOverflow();

    // Detectar cuando hay espacio vacío después del último registro
    this.checkEmptySpace();

    // Observar cambios en los datos para actualizar el estado de espacio vacío
    this.dataSource.connect().subscribe(() => {
      this.checkEmptySpace();
    });
  }

  ngOnInit() {
    this.updateDisplayedColumns();

    // Inicialización de filtros
    this.filters = {};
    for (const column of Object.keys(this.columnConfigs)) {
      this.filters[column] = '';
    }
    // Evaluar las acciones y agregar isVisible=true si no está definido
    /*   this.actions = this.actions.map(action => ({
      ...action,
      isVisible: typeof action.isVisible === 'function' ? action.isVisible : () => true
    })); */

    // Suscribirse al estado de exportación
    this.exportSubscription = this.exportNotificationService.exportStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isExportInProgress = status.isExporting;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['extraParams'] && this.extraParams) ||
      (changes['parametros'] && this.parametros)
    ) {
      // Cuando itemDefault cambia, asignamos sus valores al form
      this.loadData();
    }

    if (changes['selectable']) {
      this.updateDisplayedColumns();
    }
  }

  // Una copia de los datos originales para restablecer después del filtrado
  originalData: any[] = [];
  dataActives: any[] = [];

  // Esto almacenará el filtro actual para cada columna.
  filters: { [key: string]: string | boolean | null } = {};

  applyFilter = (event: any, column: string) => {
    this.parametros.filtrosPorColumna = {
      ...this.parametros.filtrosPorColumna,
      [column]: event.target.value,
    };

    this.parametros['noPagina'] = 1;
    this.parametros['tamanoPagina'] = 10;

    this.loadData();

    // Asegurar que el paginador se sincroniza
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalRecords;
  };

  columnMatches(row: any): boolean {
    for (const column of Object.keys(this.columnConfigs)) {
      const columnName = column;
      let filter = this.filters[columnName];
      if (filter === null) {
        continue;
      }
      if (filter !== null && filter !== undefined) {
        if (typeof filter === 'boolean') {
          if (row[columnName] !== filter) {
            return false;
          }
        } else {
          let value = String(row[columnName]).toLowerCase();
          if (!value.includes(String(filter).toLowerCase())) {
            return false;
          }
        }
      }
    }
    return true;
  }

  applyDateFilter(startDate: Date, endDate: Date, column: string) {
    this.parametros.filtrosPorColumna = {
      ...this.parametros.filtrosPorColumna,
      [column]:
        this.fechaToString(startDate) + '-' + this.fechaToString(endDate),
    };

    this.parametros['noPagina'] = 1;
    this.parametros['tamanoPagina'] = 10;

    this.loadData();

    // Asegurar que el paginador se sincroniza
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalRecords;
  }

  resetDateFilter(column: string) {
    this.parametros.filtrosPorColumna = {
      ...this.parametros.filtrosPorColumna,
      [column]: '',
    };

    this.parametros['noPagina'] = 1;
    this.parametros['tamanoPagina'] = 10;

    this.loadData();

    // Asegurar que el paginador se sincroniza
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalRecords;
  }

  fechaToString(fecha: Date) {
    const day = String(fecha.getDate()).padStart(2, '0');
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JS son base 0
    const year = fecha.getFullYear();

    // Formatear la fecha en dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  applyBooleanFilter(value: boolean | null, column: string): void {
    value
      ? (this.parametros.filtrosPorColumna = {
          ...this.parametros.filtrosPorColumna,
          [column]: 'true',
        })
      : delete this.parametros.filtrosPorColumna[column];

    this.parametros['noPagina'] = 1;
    this.parametros['tamanoPagina'] = 10;

    this.loadData();

    // Asegurar que el paginador se sincroniza
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalRecords;
  }

  applyFilterActives = (value: boolean) => {
    this.parametros.activos = !value;
    this.parametros['noPagina'] = 1;
    this.parametros['tamanoPagina'] = 10;

    this.loadData();

    // Asegurar que el paginador se sincroniza
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalRecords;
  };

  updateData = () => {
    this.isLoading = true;

    this.loadData();
  };

  enviarItem(item: any) {
    this.rowSeleccionada = item;
    this.enviarItemEvent.emit(item);
  }

  toggleRowSelection(row: any, checked: boolean) {
    if (this.shouldBlockRow(row)) {
      return;
    }
    if (checked) {
      this.selectedRows.add(row);
      const eligibleRows = this.dataSource.data.filter(r => !this.shouldBlockRow(r));
      this.isSelectAll = this.selectedRows.size === eligibleRows.length;
    } else {
      this.selectedRows.delete(row);
      this.isSelectAll = false;
    }
    this.emitSelectedRows();
  }

  refreshTable = () => {
    this.filterInputs.forEach((input) => {
      input.nativeElement.value = '';
    });

    this.parametros.filtrosPorColumna = {};
    this.parametros['noPagina'] = 1;
    this.parametros['tamanoPagina'] = 10;

    this.loadData();

    // Asegurar que el paginador se sincroniza
    this.paginator.pageIndex = 0;
    this.paginator.length = this.totalRecords;

    // Verificar overflow después de que los datos se actualizan
    setTimeout(() => this.checkForHorizontalOverflow(), 300);
  };

  agregarRegistro() {
    this.AddEvent.emit();
  }

  cambiarEstatus(item: any) {
    this.cambiarEstatusEvent.emit(item);
  }

  exportTable() {

    // Iniciar la notificación de exportación y obtener el ID del trabajo
    const jobId = this.exportNotificationService.startExport(this.excelFileName);

    // Preparar parámetros para la consulta completa
    const exportParams = { ...this.parametros };

    // En lugar de usar 0, usamos el número total de registros
    exportParams['noPagina'] = 1;
    exportParams['tamanoPagina'] = this.totalRecords > 0 ? this.totalRecords : 10000;

    // Configurar los parámetros de la consulta
    const params = this.configParams.configurar(exportParams);

    this.exportNotificationService.updateProgress(jobId, 25);

    // Obtener las columnas a exportar (excluyendo 'acciones')
    let displayColumns = this.actions.length > 0
      ? this.displayedColumns.filter(d => d != 'acciones')
      : this.displayedColumns;

      
      console.log('PARAMS AL EXPORT EXCEL: ', params)
      console.log('EXTRA PARAMS AL EXPORT EXCEL: ', this.extraParams)
      
      if (this.beforeExportExcelFunction) {
        this.beforeExportExcelFunction(params, this.extraParams).subscribe({
          next: (resultado) => {
            console.log('Antes de exportar a excel');
          },
          error: (err) => {
            console.error('Error al ejecutar beforeExportExcelFunction', err);
            // Puedes decidir si aún así exportas o no
          }
        });
      }

    // Realizar la consulta al endpoint
    this.fetchDataFunction(params, this.extraParams).subscribe({
      next: (data) => {
        this.exportNotificationService.updateProgress(jobId, 50);
        
        // Transformar datos para usar nombres de visualización como cabeceras
        const transformedData = data.items.map((item: any) => {
          const transformedItem: Record<string, any> = {};
          displayColumns.forEach((title: string) => {
            transformedItem[this.columnConfigs[title].displayName] = item[title];
          });
          return transformedItem;
        });
        
        this.exportNotificationService.updateProgress(jobId, 75);
        
        // Exportar los datos completos
        this.excelService.exportToExcel(
          'catalogoPrincipal',
          this.excelFileName,
          transformedData
        );
        
        // Completar la exportación
        this.exportNotificationService.completeExport(jobId);
      },
      error: (error) => {
        console.error('Error al exportar datos:', error);
        this.exportNotificationService.errorExport(jobId, error);
      }
    });
  }

  onValueChangeDateReport(value?: Date | undefined): void {
    this.filtroFechaReportEvent.emit(value);
  }

  create() {
    this.onCreate.emit();
    this.createEvent.emit();
  }

  get isDataEmpty(): boolean {
    return (
      this.dataSource && this.dataSource.data.length === 0 && !this.isLoading
    );
  }

  //Funcion para agregar estilos a los registros eliminados
  shouldHideText(row: any): boolean {
    // Lógica para decidir si ocultar el texto
    return row.activo === false; // Por ejemplo, oculta el texto para los registros no activos
  }

  loadData = () => {
    if (this.formularioModificado) {
      this.originalData = [];
      this.dataSource.data = [];
      this.isLoading = true;

      const params = this.configParams.configurar(this.parametros);

      this.fetchDataFunction(params, this.extraParams).subscribe((data) => {
        const items = data.items;
console.log(items);
        this.data = items;

        this.totalRecords = data.totalRecords;

        this.dataSource.data = this.data;

        if (this.selectable) {
          this.selectedRows.clear();
          this.isSelectAll = false;
          this.emitSelectedRows();
        }

        this.isLoading = false;

        // Estilos predeterminados o configuraciones
        this.styleRow = {
          height: this.tableConfigs.heightRow,
        };

        // Inicializa originalData de forma segura
        if (Array.isArray(this.data)) {
          this.originalData = [...this.data];
        } else {
          this.originalData = []; // O maneja como veas conveniente
        }

        if (this.isReport) {
          this.bsConfigGeneral = {
            containerClass: 'theme-orange',
            dateInputFormat: 'DD/MM/YYYY',
            isAnimated: true,
            maxDate: this.maxDate,
          };
        }

        // Recalcular dimensiones después de cargar datos
        setTimeout(() => {
          this.checkForHorizontalOverflow();
          this.adjustTableHeight();
        }, 100);
      });
    }
  };

  onPageChange(event: PageEvent): void {
    this.parametros['noPagina'] = event.pageIndex + 1;
    this.parametros['tamanoPagina'] = event.pageSize;
    this.loadData();

    // Scroll al inicio de la tabla al cambiar de página
    if (this.matTableWrapper && this.matTableWrapper.nativeElement) {
      const tableContent =
        this.matTableWrapper.nativeElement.querySelector('.table-v2-content');
      if (tableContent) {
        tableContent.scrollTop = 0;
      }
    }
  }

  onCheckSelectAll(event: any) {
    this.isSelectAll = event.checked;
    if (this.selectable) {
      if (this.isSelectAll) {
        this.dataSource.data.forEach((row) => {
          if (!this.shouldBlockRow(row)) {
            this.selectedRows.add(row);
          }
        });
      } else {
        this.selectedRows.clear();
      }
      this.emitSelectedRows();
    }
    this.onSelectAll.emit(event);
  }

  /** Opciones de tamaño de página transformadas */
  transformedPageSizeOptions(options: number[]): number[] {
    return options.map((size) => (size === 5 ? 10 : size));
  }

  /**
   * Verifica si hay overflow horizontal en la tabla y aplica clase correspondiente
   */
  private checkForHorizontalOverflow(): void {
    if (!this.matTableWrapper) return;

    setTimeout(() => {
      const tableContent =
        this.matTableWrapper.nativeElement.querySelector('.table-v2-content');
      if (!tableContent) return;

      const hasOverflow = tableContent.scrollWidth > tableContent.clientWidth;

      if (hasOverflow) {
        tableContent.classList.add('has-overflow');
      } else {
        tableContent.classList.remove('has-overflow');
      }
    }, 300);
  }

  // Método para ajustar la altura de la tabla dinámicamente
  private adjustTableHeight(): void {
    if (!this.matTableWrapper) return;

    setTimeout(() => {
      try {
        // Reiniciar overflow en el body
        document.body.style.overflowX = 'hidden';
        document.documentElement.style.overflowX = 'hidden';

        // Referencias a los elementos relevantes
        const tableContainer = this.matTableWrapper.nativeElement.closest(
          '.table-v2-container'
        );
        if (!tableContainer) return;

        // Obtener el elemento del footer global de la aplicación
        const appFooter =
          document.querySelector('footer') ||
          document.querySelector('.app-footer') ||
          document.querySelector('.main-footer');

        // Dimensiones del viewport
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Posición del contenedor de la tabla
        const tableRect = tableContainer.getBoundingClientRect();
        const tableTop = tableRect.top;

        // Calcular altura disponible según la posición del footer o el viewport
        let availableHeight;

        if (appFooter) {
          // Si existe un footer, calcular basado en su posición
          const footerRect = appFooter.getBoundingClientRect();
          const footerTop = footerRect.top;

          // Calcular la distancia entre la parte superior de la tabla y el footer
          // y restar un margen de seguridad
          availableHeight = footerTop - tableTop - 40;
        } else {
          // Si no hay footer, usar el viewport menos un margen para la parte inferior
          availableHeight = viewportHeight - tableTop - 40;
        }

        // Garantizar una altura mínima para la tabla
        const minHeight = 400;
        const finalHeight = Math.max(availableHeight, minHeight);

        // Aplicar la altura calculada al contenedor de la tabla
        tableContainer.style.height = `${finalHeight}px`;

        // Ajustar el contenido de la tabla según headers y footers
        const tableHeader = tableContainer.querySelector('.toolbar');
        const tableFooter = tableContainer.querySelector('.sticky-footer');

        // Calcular las alturas de los elementos
        const headerHeight = tableHeader ? tableHeader.offsetHeight : 0;
        const footerHeight = tableFooter ? tableFooter.offsetHeight : 0;

        // Obtener referencia al contenido de la tabla
        const tableContent = tableContainer.querySelector('.table-v2-content');
        if (tableContent) {
          // Calcular el espacio disponible para el contenido
          const contentHeight = finalHeight - headerHeight - footerHeight;
          tableContent.style.height = `${contentHeight}px`;

          // Ajustar la tabla interior para manejar scroll horizontal
          setTimeout(() => {
            const table = tableContent.querySelector('table.mat-table');
            if (table) {
              // Verificar si se necesita scroll horizontal
              const tableWidth = table.scrollWidth;
              const contentWidth = tableContent.clientWidth;

              if (tableWidth > contentWidth) {
                // La tabla es más ancha que el contenedor, activar indicador visual de scroll
                tableContent.classList.add('has-overflow');
                tableContent.style.overflowX = 'scroll';

                // Asegurar que la tabla sea lo suficientemente ancha
                table.style.width = 'max-content';
                table.style.minWidth = '100%';
              } else {
                // No se necesita scroll horizontal
                tableContent.classList.remove('has-overflow');

                // La tabla cabe en el contenedor, ajustar al 100%
                table.style.width = '100%';
              }
            }
          }, 100);
        }

        // Asegurar que el footer sea visible
        if (tableFooter) {
          tableFooter.style.position = 'sticky';
          tableFooter.style.bottom = '0';
          tableFooter.style.zIndex = '100';
        }
      } catch (error) {
        console.error('Error al ajustar dimensiones de tabla:', error);
      }
    }, 200);
  }

  /**
   * Verifica si hay espacio vacío después del último registro y aplica la clase correspondiente
   */
  private checkEmptySpace() {
    setTimeout(() => {
      if (!this.matTableWrapper) return;

      const tableElement = this.matTableWrapper.nativeElement;
      const tableHeight = tableElement.offsetHeight;
      const tableContentHeight = this.calculateContentHeight();
      const tableContainer = tableElement.closest('.table-v2-content');

      if (tableContainer && tableHeight < tableContainer.offsetHeight * 0.8) {
        // Si el contenido de la tabla ocupa menos del 80% del contenedor, hay espacio vacío
        tableElement.classList.add('has-empty-space');
      } else {
        tableElement.classList.remove('has-empty-space');
      }
    });
  }

  /**
   * Calcula la altura del contenido de la tabla (filas)
   */
  private calculateContentHeight(): number {
    if (!this.matTableWrapper) return 0;

    const rows =
      this.matTableWrapper.nativeElement.querySelectorAll('tr.mat-row');
    let totalHeight = 0;

    rows.forEach((row: HTMLElement) => {
      totalHeight += row.offsetHeight;
    });

    return totalHeight;
  }

  ngOnDestroy() {
    // Emitir evento para cancelar todas las suscripciones
    this.destroy$.emit();
    this.destroy$.complete();
  }
}

interface BsCustomDates {
  label: string;
  value: Date[];
}
