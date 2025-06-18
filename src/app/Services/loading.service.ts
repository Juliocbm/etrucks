import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private spinner: NgxSpinnerService) {}

  // Método para abrir el spinner
  open(): void {
    this.spinner.show();    
  }

  // Método para cerrar el spinner
  close(): void {
    this.spinner.hide();
  }

  // Método para abrir y cerrar el spinner después de un tiempo
  delay(seconds: number): void {
    this.open();
    setTimeout(() => {
      this.close();
    }, seconds * 1000);
  }
}
