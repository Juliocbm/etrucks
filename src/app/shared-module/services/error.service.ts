import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(message: string, type: string): void {

    let icon: string;

    switch (type) {
      case 'error':
        icon = 'error';
        break;
      case 'advertencia':
        icon = 'warning';
        break;
      case 'info':
        icon = 'info';
        break;
      default:
        icon = '';
    }

    console.log('icon:',icon);
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000, // Duración en milisegundos
      verticalPosition: 'top', // Posición vertical de la notificación
      horizontalPosition: 'end', // Posición horizontal de la notificación
      panelClass: [type + '-snackbar'],
     /*  politicaAriaLive: "off", */
      announcementMessage: `<mat-icon>${icon}</mat-icon> ${message}`
    });
  }
}