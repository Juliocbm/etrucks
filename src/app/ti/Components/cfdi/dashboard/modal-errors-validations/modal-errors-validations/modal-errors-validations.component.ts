import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-errors-validations',
  templateUrl: './modal-errors-validations.component.html',
  styleUrls: ['./modal-errors-validations.component.css']
})
export class ModalErrorsValidationsComponent {
constructor(
  public dialogRef: MatDialogRef<ModalErrorsValidationsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: { errores: string[] }
) {}
}
