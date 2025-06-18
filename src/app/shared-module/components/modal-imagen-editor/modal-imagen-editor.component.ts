import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-modal-imagen-editor',
  templateUrl: './modal-imagen-editor.component.html',
  styleUrls: ['./modal-imagen-editor.component.css']
})
export class ModalImagenEditorComponent {
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;
  
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isImageLoaded = false;
  transform: { scale: number; rotate: number } = {
    scale: 1,
    rotate: 0
  };

  constructor(
    public dialogRef: MatDialogRef<ModalImagenEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageFile: File | string }
  ) {
    if (this.data.imageFile) {
      if (typeof this.data.imageFile === 'string') {
        // Si es una URL o base64, convertir a Blob y luego a File
        fetch(this.data.imageFile)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'image.png', { type: 'image/png' });
            this.imageChangedEvent = { target: { files: [file] } };
          })
          .catch(error => {
            console.error('Error al convertir la imagen:', error);
          });
      } else {
        // Si es un archivo
        this.imageChangedEvent = { target: { files: [this.data.imageFile] } };
      }
    }
  }

  imageLoaded(image: LoadedImage) {
    console.log('Imagen cargada correctamente');
    this.isImageLoaded = true;
    
    // Forzar un recorte inicial después de un breve retraso
    setTimeout(() => {
      if (this.imageCropper) {
        console.log('Iniciando recorte inicial...');
        this.imageCropper.crop();
      }
    }, 300);
  }

  loadImageFailed() {
    console.error('Error al cargar la imagen');
    this.isImageLoaded = false;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('Evento de recorte recibido', event);
    
    if (event.base64) {
      this.croppedImage = event.base64;
      console.log('Imagen recortada actualizada correctamente');
      
      // Verificar que la imagen base64 es válida
      try {
        const img = new Image();
        img.src = this.croppedImage;
        img.onload = () => {
          console.log('La imagen base64 es válida');
        };
        img.onerror = () => {
          console.error('La imagen base64 no es válida');
          this.croppedImage = '';
        };
      } catch (error) {
        console.error('Error al validar la imagen base64:', error);
        this.croppedImage = '';
      }
    } else if (event.blob) {
      // Si no hay base64 pero hay blob, convertir blob a base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.croppedImage = e.target.result;
        console.log('Imagen convertida de blob a base64');
      };
      reader.onerror = () => {
        console.error('Error al leer el blob de la imagen');
      };
      reader.readAsDataURL(event.blob);
    } else {
      console.error('No se generó ni base64 ni blob de la imagen');
      this.croppedImage = '';
    }
  }

  zoomIn() {
    this.transform = {
      ...this.transform,
      scale: this.transform.scale + 0.1
    };
    this.triggerCrop();
  }

  zoomOut() {
    if (this.transform.scale > 0.1) {
      this.transform = {
        ...this.transform,
        scale: this.transform.scale - 0.1
      };
      this.triggerCrop();
    }
  }

  rotateLeft() {
    this.transform = {
      ...this.transform,
      rotate: this.transform.rotate - 90
    };
    this.triggerCrop();
  }

  rotateRight() {
    this.transform = {
      ...this.transform,
      rotate: this.transform.rotate + 90
    };
    this.triggerCrop();
  }

  private triggerCrop() {
    if (this.imageCropper) {
      setTimeout(() => {
        console.log('Recortando después de transformación...');
        this.imageCropper.crop();
      }, 100);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('Intentando guardar...');
    console.log('¿Imagen cargada?', this.isImageLoaded);
    console.log('¿Hay imagen recortada?', !!this.croppedImage);
    
    if (!this.isImageLoaded) {
      console.error('La imagen no está cargada completamente');
      return;
    }
    
    if (!this.croppedImage) {
      console.error('No hay imagen recortada para guardar');
      return;
    }
    
    // Validar el formato base64 antes de guardar
    if (this.croppedImage.startsWith('data:image/')) {
      console.log('Guardando imagen recortada válida');
      this.dialogRef.close(this.croppedImage);
    } else {
      console.error('El formato de la imagen no es válido');
    }
  }
}
