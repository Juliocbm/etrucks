import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html'
})
export class DialogContentComponent {
  resultSelected: any;
  selected: any;

  constructor(
    public dialogRef: MatDialogRef<DialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public dataSucursales: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close({ data: 'CLOSE' });
  }
}
