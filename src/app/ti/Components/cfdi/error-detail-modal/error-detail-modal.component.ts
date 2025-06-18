
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
/* import { CartaPorte } from '../../../../models/ti/cfdi/CartaPorte'; */
import { CartaPorte } from 'src/app/models/ti/cfdi/cartaPorte';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorTimbrado } from '../../../../models/ti/cfdi/error';

@Component({
  selector: 'app-error-detail-modal',
  templateUrl: './error-detail-modal.component.html',
  styleUrls: ['./error-detail-modal.component.css']
})
export class ErrorDetailModalComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ErrorTimbrado[]
  ) {}

  ngOnInit() {
  }

  close() {
    this.dialog.closeAll();
  }

}
