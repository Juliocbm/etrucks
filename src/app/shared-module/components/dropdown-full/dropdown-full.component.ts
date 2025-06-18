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
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DisplayColumnConfigDF } from '../../Interfaces/DisplayColumnConfigDF';
import { TableConfig } from '../../Interfaces/TableConfig';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-dropdown-full',
  templateUrl: './dropdown-full.component.html',
  styleUrls: ['./dropdown-full.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownFullComponent),
      multi: true,
    },
  ],
})
export class DropdownFullComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  @ViewChild('myTable') table!: ElementRef;

  @Input() placeholder: string = '';
  @Input() data: any[] = []; // Los datos que mostrará la tabla
  @Input() columnConfigs: any;
  @Input() displayColumnConfigDF: DisplayColumnConfigDF = { identificador: '' };
  @Output() enviarItemEvent = new EventEmitter<any>();

  @Input() itemDefault: any;
  @Input() IS_EDITABLE: boolean = true;
  @Input() IS_REQUIRED: boolean = false;
  @Input() SHOW_VALID: boolean = false;

  isTableVisible: boolean = false;
  selectedItem: any;
  tableVisibility: 'hidden' | 'visible' = 'hidden';

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(
    private elementRef: ElementRef,
    private viewportRuler: ViewportRuler
  ) {}
  ngOnInit() {
    this.writeValue(this.itemDefault);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemDefault']) {
      this.writeValue(this.itemDefault);
    }

    this.selectedItem = this.itemDefault;
  }

  writeValue(value: any): void {
    this.selectedItem = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /* setDisabledState?(isDisabled: boolean): void {
    this.IS_EDITABLE = !isDisabled;
  } */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isTableVisible = false;
      this.onTouched(); // Notify Angular that the user has interacted with the control
    }
  }

  onItemSelected(item: any) {
    this.selectedItem = item;
    this.isTableVisible = false;
    this.onChange(item); // Update form model
    this.enviarItemEvent.emit(item); // Emit additional custom event
  }

  tableConfigs: TableConfig = {
    pageSizeOptions: [8],
    headerColumFontSize: 5,
    heightRow: 'auto',
  };

  getValueForDisplay(item: any, config: DisplayColumnConfigDF): string {
    // Validaciones iniciales para evitar accesos indebidos
    if (!item || !config || !config.identificador || !config.columnas)
      return '';

    const identificador = config.identificador;

    // Verificar si `identificador` es una propiedad válida en `item`
    if (!Object.prototype.hasOwnProperty.call(item, identificador))
      return this.placeholder ?? '';

    // Verificar si el identificador cumple con las condiciones de "vacío"
    const identificadorValue = item[identificador];
    if (
      identificadorValue === 0 ||
      identificadorValue === '00000000-0000-0000-0000-000000000000' ||
      identificadorValue === ''
    ) {
      return this.placeholder ?? '';
    }

    // Si `identificador` está indefinido en `item`, usar la primera columna disponible
    if (identificadorValue === undefined) {
      return config.columnas.length > 0 ? item[config.columnas[0]] ?? '' : '';
    }

    // Si la configuración indica que la columna no es visible, solo se muestran las columnas
    if (!this.columnConfigs[identificador]?.visible) {
      return config.columnas.map((column) => item[column] ?? '').join(' ');
    }

    // Construcción del display final
    return `${identificadorValue ?? ''} ${
      config.separadorColumnas ?? ''
    } ${config.columnas.map((column) => item[column] ?? '').join(' ')}`.trim();
  }

  // Cada que cambie la informacion de la tabla y seguramente su tamaño ajustamos la posicion de la tabla para que permanezca pegada al input
  changeDataTable() {
    this.anclaDropdownOverInput();
  }

  //
  toggleTable() {
    this.isTableVisible = !this.isTableVisible;

    if (this.isTableVisible) {
      this.tableVisibility = 'hidden';

      setTimeout(() => {
        const tableHeight =
          this.elementRef.nativeElement.querySelector('.dropdown').offsetHeight;
        this.initialPositionDropdown(tableHeight);
      });
    }
  }

  // Llamada después de cualquier acción que pueda cambiar el tamaño del contenido del dropdown
  private anclaDropdownOverInput() {
    /*  if (this.isTableVisible) {
       setTimeout(() => {
         const dropdownElement = this.elementRef.nativeElement.querySelector('.dropdown');
         const inputElementRect = this.elementRef.nativeElement.querySelector('input').getBoundingClientRect();
         const dropdownHeight = dropdownElement.offsetHeight;
         const viewportSize = this.viewportRuler.getViewportSize();
         // Calcula la nueva posición basada en la altura cambiante del dropdown
         let newTopPosition = inputElementRect.top - dropdownHeight;
         // Asegúrate de que el dropdown no se vaya por encima del borde superior de la ventana gráfica
         if (newTopPosition < window.scrollY) {
           newTopPosition = window.scrollY;
         }
         // Ajusta la posición del dropdown
         dropdownElement.style.top = `${newTopPosition}px`;
       });
     } */
  }

  // Calcula el tamaño de l atabla y si no se vera por completo hace que se muestre a lado contrario
  private initialPositionDropdown(height: any) {
    const inputElementRect = this.elementRef.nativeElement
      .querySelector('input')
      .getBoundingClientRect();
    const viewportSize = this.viewportRuler.getViewportSize();

    const tableHeight = height;

    let positionStyle = {
      top: `${inputElementRect.bottom + window.scrollY}px`,
      left: `${inputElementRect.left}px`,
    };

    // Si no hay suficiente espacio abajo, muestra la tabla arriba del input.
    if (inputElementRect.bottom + tableHeight > viewportSize.height) {
      positionStyle.top = `${
        inputElementRect.top - tableHeight + window.scrollY
      }px`;
    }

    // Si no hay suficiente espacio a la derecha, muestra la tabla a la izquierda.
    /*   if (inputElementRect.right + this.elementRef.nativeElement.querySelector('.dropdown').offsetWidth > viewportSize.width) {
       positionStyle.left = `${inputElementRect.left - this.elementRef.nativeElement.querySelector('.dropdown').offsetWidth}px`;
     }  */

    // Aplica el estilo calculado al dropdown.
    const dropdownElement =
      this.elementRef.nativeElement.querySelector('.dropdown');
    Object.assign(dropdownElement.style, positionStyle);

    setTimeout(() => {
      this.tableVisibility = 'visible';
    });
  }

  clearSelection(): void {
    this.selectedItem = null;
  }
}
