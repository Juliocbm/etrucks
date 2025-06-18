import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.css']
})
export class SingleFileUploadComponent {
  status: "initial" | "uploading" | "success" | "fail" = "initial";
  files: File[] = [];

  @Input() UrlFile: string = '';
  @Input() allowedTypes: string = '';  // Tipos de archivos permitidos
  @Input() multiple: boolean = false;  // Permitir selección múltiple
  @Input() uploadLabel: string = 'Subir Archivo';
  @Input() customMessages: any = {
    uploading: 'Subiendo...',
    success: '¡Hecho!',
    fail: 'Error durante la carga. Favor de intentar de nuevo.',
    default: 'Esperando para subir...'
  };

  @Output() fileUploaded = new EventEmitter<File[]>();
  @Output() responseFile = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  // On file Select
  onChange(event: any) {
    this.files = Array.from(event.target.files);  // Permitir múltiples archivos
    this.status = 'initial';
  }

  onUpload() {
    if (this.files.length === 0) {
      return;
    }

    const formData = new FormData();
    [...this.files].forEach((file) => {
      formData.append("file", file, file.name);
    });

    this.status = "uploading";

    // Emit the files to the parent component
    this.fileUploaded.emit(this.files);
    console.log('Archivos subidos:', this.files);

    this.http.post(this.UrlFile, formData)
    .subscribe({
      next: (response) => {
        // console.log('Archivo subido exitosamente', response);
        this.status = 'success';
        this.responseFile.emit(response);
      },
      error: (error) => {
        console.error('Error al subir el archivo', error);
        this.status = 'fail';
      }
    });
  }

  // Transform bytes to KB, MB, etc.
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }



}
