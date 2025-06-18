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
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ParametrosGenerales } from '../../../models/SistemaGeneral/ParametrosGenerales';
import { Observable } from 'rxjs';
import { ColumnConfig } from '../../Interfaces/ColumnConfig';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { DisplayColumnConfigDF } from '../../Interfaces/DisplayColumnConfigDF';
import { FormArray } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ConfiguracionParametros } from '../../../models/SistemaGeneral/ParametrosGenerales';

@Component({
  selector: 'app-dropdown-multi-select',
  templateUrl: './dropdown-multi-select.component.html',
  styleUrls: ['./dropdown-multi-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownMultiSelectComponent),
      multi: true,
    },
  ],
})
export class DropdownMultiSelectComponent implements OnInit, OnChanges {
  elemtosSeleccionados: string[] = [];
  displayText: string = '';

  @Input() valColumnToFormControl: {
    valueColumn: string;
    formControl: string;
  }[] = []; // Array de objetos [columna, formControl]

  @Input() formGroup!: FormGroup; // El FormGroup que se usará
  private onChange: any = () => {}; // Función que notifica cambios al valor
  private onTouched: any = () => {}; // Función que notifica cuando el campo es tocado

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selectedItem: any;
  isTableVisible: boolean = false;
  tableVisibility: 'hidden' | 'visible' = 'hidden';
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild('dropdownTable') dropdownTable!: ElementRef;

  @Input() placeholder: string = '';
  @Input() displayColumnConfigDF: DisplayColumnConfigDF =
    new DisplayColumnConfigDF();
  @Input() arrayDefault: any[] = [];
  @Input() IS_EDITABLE: boolean = true;
  @Input() IS_REQUIRED: boolean = false;
  @Input() columnConfigs: any;
  @Input() tableConfigs: any = {};
  /*   @Input() fetchDataFunction!: (params: ParametrosGenerales) => Observable<any>; */
  @Input() fetchDataFunction!: (
    params: HttpParams,
    extraParam?: any
  ) => Observable<any>; // extraParam es opcional
  @Input() extraParams: { [key: string]: any } = {}; // Objeto con parámetros dinámicos

  @Input()
  parametros: ParametrosGenerales = new ParametrosGenerales();

  @Output() enviarItemEvent = new EventEmitter<any>();
  @Output() eliminarItemEvent = new EventEmitter<any>();

  @Input() formularioModificado: boolean = true;
  isLoading: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private viewportRuler: ViewportRuler,
    private configParams: ConfiguracionParametros
  ) {}

  ngOnInit() {
    this.updateDisplayedColumns();
    this.loadData();
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

  // Método para manejar la selección del item y asignar valores a los FormControls
  onItemSelected(item: any) {
    this.selectedItem = item;
    this.isTableVisible = false;

    // this.itemDefault = item;

    // Iteramos sobre el array de objetos { valueColumn, formControl }
    this.valColumnToFormControl.forEach((mapping) => {
      const { valueColumn, formControl } = mapping;
      if (this.formGroup.controls[formControl]) {
        this.formGroup.controls[formControl].setValue(item[valueColumn]); // Asigna el valor de la columna al control correspondiente
      }
    });

    this.onTouched();
    this.enviarItemEvent.emit(item); // Emitir el item completo si es necesario para otros usos
    let displayText = this.getValueForDisplay(this.selectedItem);
    this.agregarItemArray(displayText);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['arrayDefault'] && this.arrayDefault) {
      this.cargaArrayInicial();
    }

    if (changes['extraParams'] && this.extraParams) {
      // Cuando itemDefault cambia, asignamos sus valores al form
      this.loadData();
    }
  }

  private updateDisplayedColumns() {
    this.displayedColumns = Object.keys(this.columnConfigs).filter(
      (key) => this.columnConfigs[key].visible
    );
  }

  loadData(): void {
    if (this.formularioModificado) {
      this.isLoading = true;
      let config: DisplayColumnConfigDF = this.displayColumnConfigDF;
      let ids = this.arrayDefault
        .map((d: any) => d[config.idMulti ?? ''])
        .join(',');

      this.parametros['multiIds'] = ids;

      const configuracionParametros = this.configParams.configurar(
        this.parametros
      );

      this.fetchDataFunction(
        configuracionParametros,
        this.extraParams
      ).subscribe((data) => {
        this.dataSource.data = data.items;
        this.totalRecords = data.totalRecords;

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
      });
    }
    this.refreshFilters();
  }

  private refreshFilters() {
    // Limpiar los filtros por columna
    if (this.parametros.filtrosPorColumna) {
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
    const dropdownHeight = dropdown.offsetHeight;
    const viewportHeight = this.viewportRuler.getViewportSize().height;

    let topPosition = inputRect.bottom + window.scrollY;
    let leftPosition = inputRect.left;

    if (inputRect.bottom + dropdownHeight > viewportHeight) {
      topPosition = inputRect.top - dropdownHeight + window.scrollY;
    }

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

  getValueForDisplay(item: any): string {
    if (!item) return '';

    let config: DisplayColumnConfigDF = this.displayColumnConfigDF;
    if (!config || !config.identificador || !config.columnas) return '';

    // Validación temprana para evitar errores al acceder a propiedades indefinidas
    const identificador = config.identificador;
    if (
      !Object.prototype.hasOwnProperty.call(item, identificador) ||
      item[identificador] === 0 ||
      item[identificador] === '00000000-0000-0000-0000-000000000000' ||
      item[identificador] === '' ||
      item[identificador] === undefined
    ) {
      return '';
    }

    // Si el identificador no está definido en `item`, intentamos usar `config.columnas`
    if (item[identificador] === undefined) {
      return config.columnas.length > 0 ? item[config.columnas[0]] ?? '' : '';
    }

    // Construcción del display según la visibilidad de la columna
    let display = config.columnas.map((column) => item[column] ?? '').join(' ');

    if (this.columnConfigs[identificador]?.visible) {
      display = `${item[identificador] ?? ''} ${
        config.separadorColumnas
      } ${display}`;
    }

    return display.trim();
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

  cargaArrayInicial() {
    if (this.arrayDefault.length > 0) {
      let config: DisplayColumnConfigDF = this.displayColumnConfigDF;

      let ids = this.arrayDefault
        .map((d: any) => d[config.idMulti ?? ''])
        .join(',');
      this.parametros['multiIds'] = ids;
      this.parametros['actionMulti'] = 'find';

      const configuracionParametros = this.configParams.configurar(
        this.parametros
      );

      this.fetchDataFunction(
        configuracionParametros,
        this.extraParams
      ).subscribe((data) => {
        data.items.forEach((item: any) => {
          this.agregarItemArray(this.getValueForDisplay(item));
        });
        this.parametros['multiIds'] = '';
        this.parametros['actionMulti'] = '';
      });
    }
  }

  agregarItemArray(elemento: string) {
    this.elemtosSeleccionados.push(elemento);
  }

  eliminarItem(itemIndex: number) {
    this.elemtosSeleccionados.splice(itemIndex, 1);
    this.eliminarItemEvent.emit(itemIndex);
  }
}
