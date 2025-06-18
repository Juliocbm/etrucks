import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class NotificacionService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(message: string, type: string = 'success', duration: number = 5000): void {

    if(type === "success"){
      this.snackBar.openFromComponent(CustomSnackbarComponent,
        {
          data:{ 
            message: message, 
            action: 'cerrar',
            icon:"check_circle",
            snackBar: this.snackBar  
          },
          duration: duration,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        }
      )
    }
    else if(type === "error"){
      this.snackBar.openFromComponent(CustomSnackbarComponent,
        {
          data:{ 
            message: message, 
            action: 'cerrar',
            icon:"error",
            snackBar: this.snackBar  
          },
          duration: duration,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      )
    }
    else if(type === "warning"){
      this.snackBar.openFromComponent(CustomSnackbarComponent,
        {
          data:{ 
            message: message, 
            action: 'cerrar',
            icon:"warning",
            snackBar: this.snackBar  
          },
          duration: duration,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['warning-snackbar']
        }
      )
    }
    else if(type === "info"){
      this.snackBar.openFromComponent(CustomSnackbarComponent,
        {
          data:{ 
            message: message, 
            action: 'cerrar',
            icon:"info",
            snackBar: this.snackBar  
          },
          duration: duration,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['info-snackbar']
        }
      )
    }

  }

}