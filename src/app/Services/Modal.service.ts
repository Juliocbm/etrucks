import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openModal(
    component: any,
    rowData: any = null,
    tipoModal: string,
    callback: () => void,
    tituloModal: string = 'Modal',
    width: any = '1000px',
    height: any = 'auto',
    data: any = null
  ) {
    const dataForModal = rowData
      ? {
          ...rowData,
          TITULO_MODAL: tituloModal,
          TIPO_MODAL: tipoModal,
          ...data
        }
      : {
          ...data,
          TITULO_MODAL: tituloModal,
          TIPO_MODAL: tipoModal,
        };

    const dialogRef = this.dialog.open(component, {
      width: width,
      height: height,
      data: dataForModal,
    });

    dialogRef.afterClosed().subscribe(() => {
      callback(); // Ejecuta el callback cuando el modal se cierra
    });
  }
}
