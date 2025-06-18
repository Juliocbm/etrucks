import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalImagenEditorComponent } from '../modal-imagen-editor/modal-imagen-editor.component';

@Component({
  selector: 'app-modal-imagen-preview',
  templateUrl: './modal-imagen-preview.component.html',
  styleUrls: ['./modal-imagen-preview.component.css']
})
export class ModalImagenPreviewComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalImagenPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
    private dialog: MatDialog
  ) {
    if (!this.data?.imageUrl) {
      console.error('No se proporcionó una URL de imagen válida');
      this.onClose();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    // Convertir la URL de la imagen a un Blob
    fetch(this.data.imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        
        // Abrir el editor
        const dialogRef = this.dialog.open(ModalImagenEditorComponent, {
          width: '800px',
          height: '600px',
          panelClass: 'editor-dialog',
          disableClose: true,
          data: { imageFile: file }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Cerrar este modal y devolver la nueva imagen
            this.dialogRef.close(result);
          }
        });
      })
      .catch(error => {
        console.error('Error al cargar la imagen:', error);
      });
  }
}
