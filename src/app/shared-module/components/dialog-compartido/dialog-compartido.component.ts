import { Component, Inject, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-compartido',
  templateUrl: './dialog-compartido.component.html',
  styleUrls: ['./dialog-compartido.component.css']
})
export class DialogCompartidoComponent implements AfterViewInit {
  @Input() isErrorsPage: boolean = false;
  @Output() timbrarClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() exportarClicked: EventEmitter<any> = new EventEmitter<any>();
  pageErrors: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogCompartidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit(): void {
    this.formatErrorAndComplement();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onTimbrar(): void {
    // Aquí puedes realizar cualquier lógica adicional antes de emitir el evento
    this.timbrarClicked.emit(this.data);
  }

  onExportarPDF(): void {
    // Aquí puedes realizar cualquier lógica adicional antes de cerrar el diálogo
    this.exportarClicked.emit(this.data);
  }

  onExportarXML(): void {
    // Aquí puedes realizar cualquier lógica adicional antes de cerrar el diálogo
    this.exportarClicked.emit(this.data);
  }

  isErrorPage(): void {
    this.pageErrors = true;
    console.log('isErrorPage', this.pageErrors);
  }


  private formatErrorAndComplement(): void {
    const errorsContent = document.getElementById('errors-content');
    if (errorsContent) {
      errorsContent.innerText = errorsContent.innerText.replace(/;/g, '\n');
    }

    const complementContent = document.getElementById('complement-content');
    if (complementContent) {
      complementContent.innerText = complementContent.innerText.replace(/;/g, '\n');
    }
  }
}
