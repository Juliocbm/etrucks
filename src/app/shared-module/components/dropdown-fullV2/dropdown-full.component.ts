import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ViewChildren,
  QueryList,
  AfterViewInit,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  ConfiguracionParametros,
  ParametrosGenerales,
} from '../../../models/SistemaGeneral/ParametrosGenerales';
import { Observable } from 'rxjs';
import { ColumnConfig } from '../../Interfaces/ColumnConfig';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DisplayColumnConfigDF } from '../../Interfaces/DisplayColumnConfigDF';
import { TableConfig } from '../../Interfaces/TableConfig';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-dropdown-fullV2',
  templateUrl: './dropdown-full.component.html',
  styleUrls: ['./dropdown-full.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownFullV2Component),
      multi: true,
    },
  ],
})
export class DropdownFullV2Component
  implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild('dropdownTable') dropdownTable!: ElementRef;
  @ViewChild('matTableWrapper') matTableWrapper?: ElementRef;
  @ViewChild('horizontalScrollContainer')
  horizontalScrollContainer?: ElementRef;
  @ViewChild('matTable') matTable?: ElementRef;

  private onChange: any = () => {}; // Función que notifica cambios al valor
  private onTouched: any = () => {}; // Función que notifica cuando el campo es tocado

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selectedItem: any;
  isTableVisible: boolean = false;
  tableVisibility: 'hidden' | 'visible' = 'hidden';
  totalRecords: number = 0;
  controlInvalidAfterLostFocus: boolean = false;

  @Input() valColumnToFormControl: {
    valueColumn: string;
    formControl: string;
  }[] = []; // Array de objetos [columna, formControl]
  @Input() formGroup!: FormGroup; // El FormGroup que se usará
  @Input() placeholder: string = '';
  @Input() displayColumnConfigDF: DisplayColumnConfigDF =
    new DisplayColumnConfigDF();
  @Input() itemDefault: any;
  @Input() IS_EDITABLE: boolean = true;
  @Input() IS_REQUIRED: boolean = false;
  @Input() columnConfigs: any;
  @Input() customClass: string = ''; // Clase personalizada para el componente
  @Input() tableConfigs: TableConfig = {
    pageSizeOptions: [2, 5, 10, 15, 20],
    headerColumFontSize: 5,
    heightRow: 'auto',
  };
  @Input() fetchDataFunction!: (
    params: HttpParams,
    extraParam?: any
  ) => Observable<any>; // extraParam es opcional
  @Input() extraParams: { [key: string]: any } = {}; // Objeto con parámetros dinámicos
  @Input() parametros: ParametrosGenerales = new ParametrosGenerales();
  @Output() enviarItemEvent = new EventEmitter<any>();
  @Output() itemSelectedWithContext = new EventEmitter<{
    item: any;
    rowData?: any;
    rowIndex?: number;
  }>();
  @Input() filterFunction!: (data: any[]) => any[]; // Recibe la función de filtrado del componente
  @Input() formularioModificado: boolean = true;
  @Input() mostrarLabel: boolean = true;
  @Input() rowData: any;
  @Input() rowIndex: number = -1;
  @Input() isCeroValid: boolean = false;
  @Input() showClearButton: boolean = true;  // Nueva propiedad para controlar el botón de eliminar

  isLoading: boolean = false;
  private resizeListener: any = null;

  constructor(
    private elementRef: ElementRef,
    private viewportRuler: ViewportRuler,
    private configParams: ConfiguracionParametros,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.formularioModificado = false;

    this.updateDisplayedColumns();
    this.loadData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.formularioModificado = true;
      this.setupHorizontalScroll();
    });
  }

  // Función que registra los cambios de valor del componente
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Función que registra cuando el componente ha sido tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Al escribir el valor, seleccionamos el item basándonos en la primera columna del array
  writeValue(value: any): void {}

  // Asignar los valores de itemDefault a los formControls usando valColumnToFormControl
  private assignItemDefaultToFormControls() {
    // Iteramos sobre el array de objetos { valueColumn, formControl }
    this.valColumnToFormControl.forEach((mapping) => {
      const { valueColumn, formControl } = mapping;
      if (this.itemDefault && this.formGroup.controls[formControl]) {
        // Asignamos el valor de itemDefault[columna] al formControl correspondiente
        this.formGroup.controls[formControl].setValue(
          this.itemDefault[valueColumn]
        );
      }
    });
  }

  // Método para manejar la selección del item y asignar valores a los FormControls
  onItemSelected(item: any) {
    this.selectedItem = item;
    this.isTableVisible = false;

    this.itemDefault = item;

    // Iteramos sobre el array de objetos { valueColumn, formControl }
    this.valColumnToFormControl.forEach((mapping) => {
      const { valueColumn, formControl } = mapping;
      if (this.formGroup.controls[formControl]) {
        this.formGroup.controls[formControl].setValue(item[valueColumn]); // Asigna el valor de la columna al control correspondiente
      }
    });

    // Verificar si hay alguna función en columnConfigs.functionEvent para ejecutarla
    Object.keys(this.columnConfigs || {}).forEach((column) => {
      const config = this.columnConfigs[column];
      if (
        config &&
        config.event &&
        typeof config.functionEvent === 'function'
      ) {
        config.functionEvent(item);
      }
    });

    this.onTouched();
    this.enviarItemEvent.emit(item); // Emitir el item completo para usos tradicionales

    // Emitir el evento con contexto de la fila
    this.itemSelectedWithContext.emit({
      item: item,
      rowData: this.rowData,
      rowIndex: this.rowIndex,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    /*  if (changes['itemDefault']) {
      this.writeValue(this.itemDefault);
    } */
    this.selectedItem = this.itemDefault;
    // Detectamos si hay cambios en itemDefault
    if (changes['itemDefault'] && this.itemDefault) {
      // Cuando itemDefault cambia, asignamos sus valores al form
      this.assignItemDefaultToFormControls();
    }
    // if (changes['extraParams'] && this.extraParams) {
    //   // Cuando itemDefault cambia, asignamos sus valores al form
    //   this.loadData();
    // }
  }

  onInputBlur(event: FocusEvent): void {
    setTimeout(() => {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      if (value == '-' || value == '') {
        this.controlInvalidAfterLostFocus = true;
      } else {
        this.controlInvalidAfterLostFocus = false;
      }
    }, 250);
  }

  private updateDisplayedColumns() {
    this.displayedColumns = Object.keys(this.columnConfigs).filter(
      (key) => this.columnConfigs[key].visible
    );
  }

  loadData(): void {
    if (this.formularioModificado) {
      this.isLoading = true;

      let configuracionParametros = this.configParams.configurar(
        this.parametros
      );

      this.fetchDataFunction(
        configuracionParametros,
        this.extraParams
      ).subscribe((data) => {
        const items = data.items;
        this.dataSource.data = this.filterFunction
          ? this.filterFunction(items)
          : items;

        this.totalRecords = data.totalRecords;

        setTimeout(() => {
          this.setupHorizontalScroll(); // Actualizar scroll después de cargar datos
        }, 100);

        this.isLoading = false;
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.parametros['noPagina'] = event.pageIndex + 1;
    this.parametros['tamanoPagina'] = event.pageSize;
    this.loadData();
  }

  toggleTable() {
    this.isTableVisible = !this.isTableVisible;

    if (this.isTableVisible) {
      this.tableVisibility = 'hidden';

      setTimeout(() => {
        this.positionDropdown();
        this.tableVisibility = 'visible';
        this.setupHorizontalScroll();
      });
    }
    this.refreshFilters();
  }

  /**
   * Limpia la selección actual del dropdown y actualiza todos los controles asociados
   * @param event Evento del click (opcional)
   */
  clearSelection(event?: Event): void {
    // Prevenir la propagación para evitar que el click abra el dropdown
    if (event) {
      event.stopPropagation();
    }

    // Limpiar el item seleccionado
    this.selectedItem = null;
    this.itemDefault = null;

    // Limpiar los controles del formulario asociados
    this.valColumnToFormControl.forEach((mapping) => {
      const { formControl } = mapping;
      if (this.formGroup.controls[formControl]) {
        this.formGroup.controls[formControl].setValue(null);
        this.formGroup.controls[formControl].markAsTouched();
      }
    });

    // Notificar cambios
    this.onChange(null);
    this.onTouched();

    // Emitir eventos
    this.enviarItemEvent.emit(null);
    this.itemSelectedWithContext.emit({
      item: null,
      rowData: this.rowData,
      rowIndex: this.rowIndex,
    });

    // Cerrar el dropdown si está abierto
    this.isTableVisible = false;
  }

  private refreshFilters() {
    // Limpiar los filtros por columna
    if (this.parametros && this.parametros.filtrosPorColumna) {
      Object.keys(this.parametros.filtrosPorColumna).forEach((key) => {
        this.parametros.filtrosPorColumna![key] = ''; // Limpiar cada filtro
      });
    }
    // Reiniciar a la primera página
    this.parametros.noPagina = 1;
    // Recargar los datos con los filtros limpios
    this.loadData();
  }

  private positionDropdown() {
    const inputRect = this.elementRef.nativeElement
      .querySelector('input')
      .getBoundingClientRect();
    const dropdown = this.dropdownTable.nativeElement;
    const viewportSize = this.viewportRuler.getViewportSize();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Obtener dimensiones del dropdown después de que se haya renderizado
    const dropdownHeight = dropdown.offsetHeight;
    const dropdownWidth = dropdown.offsetWidth;

    // Calcular espacio disponible en diferentes direcciones
    const spaceBelow = viewportSize.height - inputRect.bottom;
    const spaceAbove = inputRect.top;
    const spaceRight = viewportSize.width - inputRect.left;
    const spaceLeft = inputRect.right;

    // Determinar posición vertical
    let topPosition;
    if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
      // Mostrar debajo si hay suficiente espacio o más espacio que arriba
      topPosition = inputRect.bottom + scrollY;
    } else {
      // Mostrar arriba si hay más espacio arriba
      topPosition = inputRect.top - dropdownHeight + scrollY;
    }

    // Determinar posición horizontal
    let leftPosition;
    if (spaceRight >= dropdownWidth) {
      // Alinear con el borde izquierdo del input si hay espacio
      leftPosition = inputRect.left + scrollX;
    } else if (spaceLeft >= dropdownWidth) {
      // Alinear con el borde derecho del input si hay más espacio a la izquierda
      leftPosition = inputRect.right - dropdownWidth + scrollX;
    } else {
      // Centrar en la pantalla si no hay suficiente espacio en ningún lado
      leftPosition = Math.max(
        10,
        (viewportSize.width - dropdownWidth) / 2 + scrollX
      );
    }

    // Asegurar que el dropdown no se salga de los límites de la ventana
    topPosition = Math.max(
      10,
      Math.min(topPosition, viewportSize.height - dropdownHeight + scrollY - 10)
    );
    leftPosition = Math.max(
      10,
      Math.min(leftPosition, viewportSize.width - dropdownWidth + scrollX - 10)
    );

    // Aplicar posiciones
    dropdown.style.top = `${topPosition}px`;
    dropdown.style.left = `${leftPosition}px`;
  }

  onInputFilter(event: Event, column: string) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement ? inputElement.value : '';

    this.applyColumnFilter(value, column);
  }

  applyColumnFilter(value: string, column: string) {
    this.parametros.filtrosPorColumna = {
      ...this.parametros.filtrosPorColumna,
      [column]: value,
    };

    this.parametros.noPagina = 1;

    this.loadData(); // Llama a la función para recargar los datos
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

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

  getValueForDisplay(item: any, config: DisplayColumnConfigDF): string {
    // 1. Validación básica de parámetros
    if (!item || !config) return '';

    // 2. Validación de la configuración
    const identificador = config?.identificador;
    const columnas = config?.columnas || [];

    if (!identificador) return '';

    // 3. Manejo de propiedad inexistente en el item
    if (!Object.prototype.hasOwnProperty.call(item, identificador)) {
      return this.placeholder || '';
    }

    // 4. Obtener el valor del identificador
    const idValue = item[identificador];

    // 5. Manejo unificado de valores considerados "vacíos"
    if (this.isEmptyValue(idValue)) {
      return '';
    }

    // 6. Construcción del texto a mostrar
    const columnValues = this.getColumnValues(item, columnas);

    // 7. Determinar si debe mostrar el identificador basado en visibilidad
    const showIdentifier =
      this.columnConfigs?.[identificador]?.visible !== false;

    // 8. Construir la cadena final con formato adecuado
    return this.formatDisplayString(
      idValue,
      columnValues,
      config.separadorColumnas,
      showIdentifier
    );
  }

  // Métodos auxiliares para mejorar legibilidad y mantenimiento

  private isEmptyValue(value: any): boolean {
    // Unificar la lógica para determinar si un valor se considera "vacío"
    return (
      value === null ||
      value === undefined ||
      value === '' ||
      value === '00000000-0000-0000-0000-000000000000' ||
      (typeof value === 'number' && value === 0 && !this.isCeroValid)
    );
  }

  private getColumnValues(item: any, columnas: string[]): string[] {
    // Obtener los valores de las columnas manejando undefined/null
    return columnas.map((column) => {
      const value = item[column];
      // Conversión segura según el tipo de dato
      if (value === null || value === undefined) return '';
      return String(value);
    });
  }

  private formatDisplayString(
    idValue: any,
    columnValues: string[],
    separator: string = '',
    showIdentifier: boolean
  ): string {
    // Dar formato a la cadena final según configuración
    const columnsText = columnValues.filter((v) => v).join(' ');

    if (!showIdentifier) {
      return columnsText;
    }

    const idText = String(idValue);
    if (!columnsText) return idText;
    if (!idText) return columnsText;

    // Aplicar formato especial según el separador
    if (separator) {
      return this.formatWithSpecialSeparator(
        idText,
        columnsText,
        separator
      ).trim();
    }

    // Sin separador, solo unir con espacio
    return `${idText} ${columnsText}`.trim();
  }

  getColumnWidth(column: string): number {
    const columnValues = this.dataSource.data.map((item) => item[column] || '');
    const maxLength = Math.max(
      ...columnValues.map((value) => value.toString().length),
      column.length
    );

    // Aquí asumimos un tamaño promedio de 8px por carácter, ajusta según la fuente y estilo
    return Math.min(maxLength * 8, 300); // 300px como máximo, ajustable según tus necesidades
  }

  /**
   * Aplica formato especial según el tipo de separador
   * @param idText El texto del identificador
   * @param columnsText El texto de las columnas concatenadas
   * @param separator El separador a aplicar
   * @returns Cadena formateada según reglas especiales para cada separador
   */
  private formatWithSpecialSeparator(
    idText: string,
    columnsText: string,
    separator: string
  ): string {
    // Caracteres que deben aparecer sin espacio después
    const noSpaceAfter = ['%', 'º', '°'];

    // Caracteres que deben aparecer pegados antes del valor
    const prefixChars = ['$', '#', '€', '£', '¥'];

    // Si es un separador con manejo especial
    if (noSpaceAfter.includes(separator)) {
      // Para porcentaje y símbolos similares: "valor1% valor2"
      return `${idText}${separator} ${columnsText}`;
    } else if (prefixChars.includes(separator)) {
      // Para símbolos monetarios o hashtag: "$valor1 valor2"
      return `${separator}${idText} ${columnsText}`;
    } else if (separator === '-') {
      // Para guión, mantener espacios: "valor1 - valor2"
      return `${idText} ${separator} ${columnsText}`;
    }

    // Comportamiento por defecto para otros separadores
    return `${idText} ${separator} ${columnsText}`;
  }

  anyControlInvalid(): boolean {
    return this.valColumnToFormControl.some((mapping) =>
      this.isControlInvalid(mapping.formControl)
    );
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return (
      (control.invalid ||
        control.value == 0 ||
        control.value == '' ||
        control.value == '00000000-0000-0000-0000-000000000000' ||
        control.value == null ||
        control.value == undefined) &&
      control.touched
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isTableVisible = false;
    }
  }

  /**
   * Configura el scroll horizontal sincronizado entre la tabla y el contenedor de scroll
   */
  private setupHorizontalScroll() {
    setTimeout(() => {
      if (
        !this.matTableWrapper ||
        !this.horizontalScrollContainer ||
        !this.matTable
      )
        return;

      const tableWrapper = this.matTableWrapper.nativeElement;
      const scrollContainer = this.horizontalScrollContainer.nativeElement;
      const table = this.matTable.nativeElement;
      const scrollContent = scrollContainer.querySelector('.scroll-content');

      if (!scrollContent) return;

      // 1. Asegurarse que las celdas de la tabla tengan anchos apropiados
      const headerCells = Array.from(
        table.querySelectorAll('th.mat-header-cell')
      ) as HTMLElement[];
      const dataCells = Array.from(
        table.querySelectorAll('td.mat-cell')
      ) as HTMLElement[];
      
      // Si no hay datos o solo hay un registro y no hay suficientes columnas, no mostrar scroll
      if (
        dataCells.length === 0 || 
        (this.dataSource.data.length <= 1 && headerCells.length <= 2)
      ) {
        this.renderer.removeClass(scrollContainer, 'has-overflow');
        return;
      }
      
      let totalColumnWidth = 0;

      // Diccionario de anchos mínimos por tipo de columna
      const columnWidths: { [key: string]: { min: number; factor: number } } = {
        id: { min: 40, factor: 7 },
        nombre: { min: 150, factor: 8 },
        tipo: { min: 120, factor: 8 },
        porcentaje: { min: 80, factor: 7 },
        valor: { min: 100, factor: 7 },
      };

      // Detectar tipo de columna basado en su contenido/nombre
      const getColumnType = (cell: HTMLElement, index: number): string => {
        const text = cell.textContent?.toLowerCase() || '';
        if (index === 0 || text.includes('id')) return 'id';
        if (
          index === 1 ||
          text.includes('nombre') ||
          text.includes('descripcion')
        )
          return 'nombre';
        if (text.includes('tipo') || text.includes('concept')) return 'tipo';
        if (
          text.includes('%') ||
          text.includes('iva') ||
          text.includes('impuesto')
        )
          return 'porcentaje';
        if (
          text.includes('valor') ||
          text.includes('monto') ||
          text.includes('$')
        )
          return 'valor';
        return 'default';
      };

      // Forzar a la tabla a renderizar las columnas con el ancho adecuado al contenido
      headerCells.forEach((headerCell: HTMLElement, index: number) => {
        // Detectar el tipo de columna
        const columnType = getColumnType(headerCell, index);
        const config = columnWidths[columnType] || { min: 100, factor: 8 };

        // Obtener todas las celdas de datos de esta columna
        const cellsInThisColumn = dataCells.filter(
          (_, i) => i % headerCells.length === index
        );

        // Calcular el ancho máximo necesario para esta columna
        let maxContentWidth = headerCell.textContent?.length || 0;
        cellsInThisColumn.forEach((cell: HTMLElement) => {
          const contentWidth = cell.textContent?.length || 0;
          if (contentWidth > maxContentWidth) {
            maxContentWidth = contentWidth;
          }
        });

        // Establecer un ancho basado en el contenido y tipo de columna
        const calculatedWidth = Math.max(
          config.min,
          maxContentWidth * config.factor
        );

        // Aplicar directamente al estilo de la celda
        headerCell.style.minWidth = `${config.min}px`;
        headerCell.style.width = `${calculatedWidth}px`;

        // Aplicar también a las celdas de datos de esta columna para consistencia
        cellsInThisColumn.forEach((cell) => {
          cell.style.minWidth = `${config.min}px`;
          cell.style.width = `${calculatedWidth}px`;
        });

        // Sumar al ancho total de la tabla
        totalColumnWidth += calculatedWidth;
      });

      // 2. Calcular y aplicar el ancho total al contenido del scroll
      // Asegurar que sea al menos tan ancho como el viewport de la tabla más un margen
      const finalWidth = Math.max(
        totalColumnWidth,
        tableWrapper.clientWidth + 20
      );
      this.renderer.setStyle(scrollContent, 'width', `${finalWidth}px`);

      // 3. Establecer el ancho de la tabla
      table.style.width = `${finalWidth}px`;
      
      // 4. Verificar si REALMENTE necesitamos el scroll horizontal personalizado
      // Considerar un margen para evitar falsos positivos
      const hasHorizontalOverflow = totalColumnWidth > (tableWrapper.clientWidth + 5);
      
      // Aplicar o quitar clase para mostrar/ocultar el scroll personalizado
      if (hasHorizontalOverflow) {
        this.renderer.addClass(scrollContainer, 'has-overflow');
        
        // Configurar los event listeners para sincronizar scrolls
        const handleTableScroll = () => {
          if (scrollContainer.scrollLeft !== tableWrapper.scrollLeft) {
            scrollContainer.scrollLeft = tableWrapper.scrollLeft;
          }
        };

        const handleHorizontalScroll = () => {
          if (tableWrapper.scrollLeft !== scrollContainer.scrollLeft) {
            tableWrapper.scrollLeft = scrollContainer.scrollLeft;
          }
        };

        // Remover eventos anteriores si existen
        tableWrapper.removeEventListener('scroll', handleTableScroll);
        scrollContainer.removeEventListener('scroll', handleHorizontalScroll);

        // Agregar nuevos eventos
        tableWrapper.addEventListener('scroll', handleTableScroll);
        scrollContainer.addEventListener('scroll', handleHorizontalScroll);
      } else {
        this.renderer.removeClass(scrollContainer, 'has-overflow');
      }

      // Limpiar evento resize anterior si existe
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
      }

      // Crear nuevo evento debounced para resize
      this.resizeListener = this.debounce(() => {
        this.setupHorizontalScroll();
      }, 200);

      // Actualizar el scroll cuando cambie el tamaño de la ventana
      window.addEventListener('resize', this.resizeListener);
    }, 300); // Dar tiempo suficiente para el renderizado completo
  }

  /**
   * Función para limitar la frecuencia de ejecución de eventos como resize
   */
  private debounce(func: Function, wait = 100) {
    let timeout: any;
    // Usar arrow function para mantener el contexto de 'this'
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  ngOnDestroy() {
    // Limpiar el event listener de resize si existe
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
}
