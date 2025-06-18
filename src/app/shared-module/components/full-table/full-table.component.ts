import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter, ViewChild, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { BsDatepickerConfig, BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { ExportTableExcelService } from '../../services/export-table-excel.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TableAction } from '../../Interfaces/TableAction'
import { MatDialog } from '@angular/material/dialog';
import { ColumnVisibilityModalComponent } from '../column-visibility-modal/column-visibility-modal.component';
import { TableConfig } from '../../Interfaces/TableConfig';
import { ColumnConfig } from '../../Interfaces/ColumnConfig';
import { ExportTableCsvService } from '../../services/export-table-csv.service';

@Component({
  selector: 'app-full-table',
  templateUrl: './full-table.component.html',
  styleUrls: ['./full-table.component.css'],
})
export class FullTableComponent implements OnInit, OnChanges {
  [x: string]: any;

  bsConfigGeneral: Partial<BsDatepickerConfig> | undefined;
  maxDate: Date = new Date(); // Fecha máxima hoy
  minDate: Date = new Date(); // Fecha mínima 30 días atrás

  private _paginator: MatPaginator | undefined;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  public styleRow: { [clave: string]: string } = {};
  selectedDateRange: Date[] = [];
  public isToggleChecked: boolean = true;

  @ViewChildren('filterInput') filterInputs!: QueryList<ElementRef>;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this._paginator = paginator;
    if (paginator && this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  get columnKeys() {
    return Object.keys(this.columnConfigs);
  }

  //Se reciben los datos que mostrará la tabla
  @Input() data: any[] = [];
  //Se reciben los datos que mostrará en campo editable select
  @Input() dataSelect: any[] = [];
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
  //Se recibe la indicacion sobre si se debe mostrar el boton [exportar a CSV] que descarga un archivo CSV
  @Input() showExportarCSVButton: boolean = true;
  //Se recibe el nombre con el que se debe guardar el archivo excel al exportar la tabla desde el boton [exportar a excel]
  @Input() excelFileName: string = '';
  //Se recibe la bandera que indica si esta "cargando" datos, y asi manejar la visualizacion del indicador loader
  @Input() isLoading: boolean = false;
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
  @Input() mostrarFiltroText: boolean = false;
  rowSeleccionada: any;
  @Input() isReport = false;
  @Output() cambiarEstatusEvent = new EventEmitter<any>();
  @Output() createEvent = new EventEmitter<void>();
  @Output() refreshEvent = new EventEmitter<void>();
  @Output() AddEvent = new EventEmitter<void>();
  @Output() onCreate: EventEmitter<void> = new EventEmitter();
  @Output() enviarItemEvent = new EventEmitter<void>();
  @Output() filtroFechaGeneralEvent = new EventEmitter<(Date | undefined)[]>();
  @Output() filtroTextEvent = new EventEmitter<string>();
  @Output() changeData = new EventEmitter<any>();
  @Output() filtroFechaReportEvent = new EventEmitter<(Date | undefined)>();

  constructor(
    private excelService: ExportTableExcelService,
    private csvService: ExportTableCsvService,
    public dialog: MatDialog
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
      visible: true
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
      if (columnConfig.bloquearSeleccion && columnConfig.bloquearSeleccion(element)) {
        return true; // Se bloquea el renglón si se cumple la condición en alguna columna
      }
    }
    return false; // No se bloquea el renglón si no se encuentra ninguna condición de bloqueo
  }


  // Definir los rangos de fechas
  predefinedRanges: BsCustomDates[] = [
    { label: 'Hoy', value: [new Date(), new Date()] },
    { label: 'Últimos 7 Días', value: [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()] }
  ];

  //Definir configuracion inicial para DateRangePicker
  /**
   * Configuración inicial para el DateRangePicker de los filtros de fechas generales.
   * Se utiliza para establecer el formato de fecha y el estilo de la fecha en el input.
   * Se utiliza tambien para establecer la animación al mostrar el picker.
   * - containerClass: Clase CSS para el contenedor del picker.
   * - dateInputFormat: Formato de fecha para el input.
   * - isAnimated: Indica si se debe mostrar una animación al mostrar el picker.
   */
  bsConfig: Partial<BsDaterangepickerConfig> = {
    containerClass: 'theme-orange',
    dateInputFormat: 'DD/MM/YYYY',
    isAnimated: true,
  };

  //Abre modal para configurar que columnas configure para renderizar
  openColumnVisibilityDialog(): void {
    const columnsArray = Object.keys(this.columnConfigs).map(key => ({
      key: key,
      ...this.columnConfigs[key]
    }));

    const dialogRef = this.dialog.open(ColumnVisibilityModalComponent, {
      width: '250px',
      data: { columns: columnsArray }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizar columnConfigs con los resultados
        result.forEach((column: { key: string | number; visible: any; }) => {
          this.columnConfigs[column.key].visible = column.visible;
        });
        this.updateDisplayedColumns();
      }
    });
  }

  //Actualiza el arreglo de columnas a renderizar
  updateDisplayedColumns() {
    const visibleColumns = Object.keys(this.columnConfigs)
      .filter(key => this.columnConfigs[key].visible);

    if (this.actions.length === 0) {
      this.displayedColumns = [...visibleColumns];
    } else {
      this.displayedColumns = [...visibleColumns, 'acciones'];
    }
  }

  onValueChangeDateGeneral(value?: (Date | undefined)[]): void {
    if (value && value.length === 2 && value[0] instanceof Date && value[1] instanceof Date) {
      this.filtroFechaGeneralEvent.emit(value);
    }
  }


  //Ejecuta al cambiar el valor del DataRangePicker
  onValueChangeDate(value?: (Date | undefined)[], column: string = 'fechaCreacion'): void {
    if (value && value.length === 2 && value[0] instanceof Date && value[1] instanceof Date) {
      this.applyDateFilter(value[0], value[1], column);
    }
  }

  onValueChangeText(value?:any){
    const valueText = (value.target as HTMLInputElement).value;
    this.filtroTextEvent.emit(valueText);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        // Suscribirse al evento de cambio de página
        this.paginator.page.subscribe((pageEvent) => {
          // Aquí puedes emitir tu evento personalizado o realizar cualquier acción necesaria
          this.changeData.emit();
        });
      }
    });
  }


  ngOnInit() {
    // Estilos predeterminados o configuraciones
    this.styleRow = {
      'height': this.tableConfigs.heightRow,
    };

    this.updateDisplayedColumns();

    // Inicializa originalData de forma segura
    if (Array.isArray(this.data)) {
      this.originalData = [...this.data];
    } else {
      this.originalData = []; // O maneja como veas conveniente
    }

    // Inicialización de filtros
    this.filters = {};
    for (const column of Object.keys(this.columnConfigs)) {
      this.filters[column] = '';
    }

    // Configura dataSource.data de forma segura
    // this.dataSource.data = Array.isArray(this.data) ? this.data : [];
    this.applyFilterActives(!this.showFilterInactivos);

    if(this.isReport){
      this.bsConfigGeneral = {
        containerClass: 'theme-orange',
        dateInputFormat: 'DD/MM/YYYY HH:mm',
        isAnimated: true,
        maxDate: this.maxDate
      }; }

  }


  // Una copia de los datos originales para restablecer después del filtrado
  originalData: any[] = [];
  dataActives: any[] = [];

  // Esto almacenará el filtro actual para cada columna.
  filters: { [key: string]: string | boolean | null } = {};

  ngOnChanges(changes: SimpleChanges) {
    // Asegúrate de que 'data' está presente y es un iterable antes de intentar usarlo.
    if (changes['data'] && Array.isArray(this.data)) {
      this.originalData = [...this.data];
      if (this.dataSource) {
        this.applyFilterActives(!this.showFilterInactivos)
        // this.dataSource.data = this.data;
      }
    } else {
      // Maneja el caso en que 'data' no sea un iterable
      // Puedes asignar originalData como un array vacío o manejar de otra forma.
      this.originalData = [];
      if (this.dataSource) {
        this.dataSource.data = [];
      }
    }
  }

  applyFilter(event: any, column: string): void {
    this.changeData.emit();
    const filterValue = event.target.value;
    this.filters[column] = filterValue.trim().toLowerCase();
    this.data = this.dataActives.filter((row) => this.columnMatches(row));
    if (this.dataSource) {
      this.dataSource.data = this.data;
    }
  }

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
    // Guardar la data original en una variable si aún no lo has hecho.
    // if (!this.originalData) {
    //   this.originalData = [...this.data];
    // }
    this.data = this.dataActives.filter((item) => {
      let fecha = new Date(item[column]);
      return fecha >= startDate && fecha <= endDate;
    });
    if (this.dataSource) {
      this.dataSource.data = this.data;
    }
  }

  applyBooleanFilter(value: boolean | null, column: string): void {

    this.filters[column] = value;
    this.data = this.dataActives.filter((row) => this.columnMatches(row));
    if (this.dataSource) {
      this.dataSource.data = this.data;
    }
  }

  applyFilterActives(value: boolean ){

    if(value){
      this.dataActives = this.originalData;
      this.dataSource.data = this.dataActives;
    } else {
      this.dataActives = this.originalData.filter((item) => item.activo == true);
      this.dataSource.data =  this.dataActives;
    }


  }

  enviarItem(item: any) {
    this.rowSeleccionada = item;
    this.enviarItemEvent.emit(item);
  }

  refreshTable() {
    this.filterInputs.forEach((input) => {
      input.nativeElement.value = '';
    });
    this.refreshEvent.emit();
  }

  agregarRegistro(){
    this.AddEvent.emit();
  }

  cambiarEstatus(item: any) {
    this.cambiarEstatusEvent.emit(item);
  }

  exportTable() {

    let displayColums:any;
    if(this.actions.length>0)
      displayColums =  this.displayedColumns.filter(d => d != 'acciones')
    else
      displayColums = this.displayedColumns;

    const transformedData = this.dataSource.data.map(item => {
      const transformedItem:Record<string, any> = {};
      displayColums.forEach((title:string) => {
        transformedItem[this.columnConfigs[title].displayName] = item[title];
      });
      return transformedItem;
    });

    this.excelService.exportToExcel('catalogoPrincipal', this.excelFileName, transformedData);
  }


  exportTableCSV() {
    let displayColums:any;
    if(this.actions.length>0)
      displayColums =  this.displayedColumns.filter(d => d != 'acciones')
    else
      displayColums = this.displayedColumns;

    const transformedData = this.dataSource.data.map(item => {
      const transformedItem:Record<string, any> = {};
      displayColums.forEach((title:string) => {
        transformedItem[this.columnConfigs[title].displayName] = item[title];
      });
      return transformedItem;
    });

    this.csvService.exportToCsv(transformedData,this.excelFileName);
  }


  onValueChangeDateReport(value?: (Date | undefined)): void {
    this.filtroFechaReportEvent.emit(value);
  }


  create() {
    this.onCreate.emit();
    this.createEvent.emit();
  }

  get isDataEmpty(): boolean {
    return this.dataSource && this.dataSource.data.length === 0 && !this.isLoading;
  }

  toggleCollapse(element: any) {
    element.isOpen = !element.isOpen;
  }
}
interface BsCustomDates {
  label: string;
  value: Date[];
}
