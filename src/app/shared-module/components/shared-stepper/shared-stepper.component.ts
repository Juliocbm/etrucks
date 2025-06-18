import { StepInfo } from './../../Interfaces/StepInfo';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ColumnConfig } from '../../Interfaces/ColumnConfig';
import { TableConfig } from '../../Interfaces/TableConfig';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { DialogCompartidoComponent } from '../dialog-compartido/dialog-compartido.component';
import { TableAction } from '../../Interfaces/TableAction';
@Component({
  selector: 'app-shared-stepper',
  templateUrl: './shared-stepper.component.html',
  styleUrls: ['./shared-stepper.component.css']
})

export class SharedStepperComponent implements OnChanges, OnInit{
  goToXML(item: any): void {
    throw new Error('Method not implemented.');
  }

  goToPDF(item: any): void {
    throw new Error('Method not implemented.');
  }

  @Input() steps: StepInfo[] = [];
  @Input() data: any[] = [];
  @Input() currentStep: number = 0;
  @Output() stepCompleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() enviarDatos: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() exportarDatos: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Output() obtenerPDF: EventEmitter<any> = new EventEmitter<any>();
  @Output() obtenerXML: EventEmitter<any> = new EventEmitter<any>();

  enviarInformacion = new EventEmitter<any>();

  columnConfigs: { [key: string]: ColumnConfig; } = {};
  tableConfigs: TableConfig = {
    pageSizeOptions: [],
    headerColumFontSize: undefined,
    heightRow: undefined,
    createCallback: undefined
  };
  datos: any[] = [];
  currentIndex: number = 1;
  //actions: TableAction[] = []; // Initialize the 'actions' property with an empty array

  constructor(public bsModalRef: BsModalRef, public dialog: MatDialog) { }

  ngOnChanges(): void {
    // Verificar si hay pasos y si los datos del primer paso han cambiado
    if (this.steps && this.steps.length > 0 && this.steps[0].datos !== undefined) {
      this.datos = this.steps[0].datos;
      this.columnConfigs = this.steps[0].columnConfigs;
      this.tableConfigs = this.steps[0].tableConfigs;
    }
  }

  ngOnInit(): void {
    console.log(this.currentIndex);

    if(this.currentIndex === 1)
    {
      DialogCompartidoComponent.prototype.isErrorPage();
    }
  }

  completeStep(index: number) {

    if(this.currentIndex === 1)
    {
      DialogCompartidoComponent.prototype.isErrorPage();
    }

    //console.log(this.currentIndex);
    console.log('Step', index, 'completed')
    this.stepCompleted.emit(index);
  }

  selectionChanged(event: any) {
    this.currentIndex = event.selectedIndex; // Actualiza el índice actual con el índice seleccionado
    this.completeStep(this.currentIndex);
  }

  goToEnviar(data: any): void {
    //console.log('Data:', data );
    this.bsModalRef.hide();
    this.enviarInformacion.emit(data);
    this.openDialog(data);
  }

  openDialog(data: any): void {
    const dialogRef = this.dialog.open(DialogCompartidoComponent, {
      width: 'auto', // Ajusta el ancho según tus necesidades
      height: 'auto', // Ajusta el alto según tus necesidades
      data: data
    });

    dialogRef.componentInstance.timbrarClicked.subscribe((timbrarData: any) => {
      this.enviarDatos.emit(timbrarData);
    });

    dialogRef.componentInstance.exportarClicked.subscribe((exportarData: any) => {
      console.log('Exportar', exportarData);
      this.currentIndex.toPrecision(exportarData);
    });

    dialogRef.componentInstance.exportarClicked.subscribe((exportarData: any) => {
      this.exportarDatos.emit(exportarData);
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
    });
  }

}
export { StepInfo };

