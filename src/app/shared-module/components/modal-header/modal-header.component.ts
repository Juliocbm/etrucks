import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.css']
})
export class ModalHeaderComponent<T> {

  @Input() TITULO_MODAL: string = '';
  @Input() TIPO_MODAL: string = '';
  @Input() IS_EDITABLE: boolean = false;
  @Input() showButtonEditable: boolean = true;
  @Input() isStepper: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() stepLenght: number = 0;
  @Input() stepSelect: number = 0;
  @Output() isEditableEvent = new EventEmitter<boolean>();
  @Output() submitEvent = new EventEmitter<void>();
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() antStep = new EventEmitter<void>();
  @Output() sigStep = new EventEmitter<void>();
  @Input() ELIMINADO: boolean = false;

  @Input() EXPORT: boolean = false;
  @Output() doExport = new EventEmitter<void>();
  
  constructor(    
    public dialogRef: MatDialogRef<T>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  cerrarModal(){
    this.closeModalEvent.emit();
  }

  onSubmit(){
    this.submitEvent.emit();
  }

  onExport() {
    this.doExport.emit();
  }

  editableChange(isEditable: boolean): void {
    this.isEditableEvent.emit(isEditable);
  }

  previousStep(){
    this.antStep.emit();
  }

  nextStep(){
    this.sigStep.emit();
  }
}
