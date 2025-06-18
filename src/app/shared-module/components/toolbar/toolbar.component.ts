import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RegistroGeneral } from '../../../security/models/RegistroGeneral';
import { ExportTableExcelService } from '../../services/export-table-excel.service';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() createRoute: string = '';
  @Input() showCreateButton = true;
  @Input() showCreateButtonDetGral = false;
  @Input() showExportButton = true;
  @Input() showSaveButton = true;
  @Input() showEditButton = true;
  @Input() showFilter = true;
  @Input() showFilterDate = true;
  @Input() showFilterActivos = true;

  @Input() nombreMenu: string = '';

  @Input() excelFileName: string = '';
  @Input() idTablaExport: string = '';

  @Output() saveClicked: EventEmitter<void> = new EventEmitter();
  @Output() editClicked: EventEmitter<void> = new EventEmitter();
  @Output() onFiltrar: EventEmitter<string> = new EventEmitter();
  @Output() onFiltrarActivos: EventEmitter<boolean> = new EventEmitter();
  @Output() onCreate: EventEmitter<void> = new EventEmitter();

  @Output() dateRangeChanged: EventEmitter<{ startDate: Date, endDate: Date }> = new EventEmitter();
  @Output() dateRangeCleared = new EventEmitter<void>();

  @Input() registrosPadre: RegistroGeneral[] = []; // Nuevo input
  @Output() onFiltrarPorIdCatPadre: EventEmitter<string> = new EventEmitter(); // Nuevo output
  selectedIdCatPadre: string = ''; // Nuevo estado para almacenar el valor seleccionado

   
  bsConfig: Partial<BsDaterangepickerConfig> = {
    containerClass: 'theme-orange',
    dateInputFormat: 'DD/MM/YYYY',
    isAnimated: true,
  };

  selectedRange: Date[] = [];
  filtro: string = '';
  filtroActivosBool: boolean = true;

  constructor(private excelService: ExportTableExcelService) {
  }

  filtrarPorFecha(selectedRange: (Date | undefined)[] | undefined) {
    console.log('Rango de fechas:', selectedRange);
    if (selectedRange && selectedRange.length === 2 && selectedRange[0] && selectedRange[1]) {
      const [startDate, endDate] = selectedRange as Date[]; // Esto es seguro ahora
      this.selectedRange = selectedRange as Date[];
      this.dateRangeChanged.emit({ startDate, endDate });
    } else {
      console.log('Rango de fechas no válido:', selectedRange); // Puedes manejar esto como desees
    }
  }

  filtrarPorIdCatPadre() {
    this.onFiltrarPorIdCatPadre.emit(this.selectedIdCatPadre);
  }
  
  clearDateRange() {
    this.selectedRange = []; // O establecerlo en un rango de fechas predeterminado si prefieres
    this.dateRangeCleared.emit();
  }

  

  filtrar() {
    //console.log('Rrere'); // Para depuración
    this.onFiltrar.emit(this.filtro);
  }

  filtrarActivos() {
    this.onFiltrarActivos.emit(this.filtroActivosBool);
  }

  saveData() {
    this.saveClicked.emit();
  }

  edit() {
    this.editClicked.emit();
  }

  create() {
    this.onCreate.emit();
  }


  exportTable() {
    this.excelService.exportToExcel(this.idTablaExport, this.excelFileName);
  }
}
