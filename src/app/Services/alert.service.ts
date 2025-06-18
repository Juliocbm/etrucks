import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

export enum AlertType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
  Question = 'question',
}

export interface Alert {
  type: AlertType;
  message: string;
}

// Cambios en el servicio AlertService
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private config: any;

  private alertSubject = new Subject<Alert>();
  public alert$ = this.alertSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadConfig().subscribe((config) => {
      this.config = config;
    });
  }

  private loadConfig(): Observable<any> {
    const cachedConfig = localStorage.getItem('alerts-config');

    return this.http.get('assets/alerts-config.json').pipe(
      tap((config) => {
        localStorage.setItem('alerts-config', JSON.stringify(config));
      }),
      catchError((error) => {
        return of({});
      })
    );
  }

  private getMessage(module: string, type: AlertType): string {
    const pathParts = module.split('.');
    let currentLevel = this.config;

    for (const part of pathParts) {
      if (currentLevel && currentLevel[part]) {
        currentLevel = currentLevel[part];
      } else {
        currentLevel = null;
        break;
      }
    }

    // Si no se encuentra, devolver texto predeterminado
    return currentLevel ? currentLevel : module;
  }

  private replacePlaceholders(
    message: string,
    replacements: { [key: string]: string }
  ): string {
    if (!replacements) {
      return message;
    }

    Object.keys(replacements).forEach((key) => {
      const placeholder = `{${key}}`;
      message = message.replace(
        new RegExp(placeholder, 'g'),
        replacements[key]
      );
    });

    return message;
  }

  showAlert(
    module: string,
    type: AlertType,
    replacements?: { [key: string]: string },
    persist: boolean = false,
    customTimer: number = 3000
  ) {
    let message = this.getMessage(module, type);
    if (replacements) {
      message = this.replacePlaceholders(message, replacements);
    }

    const timer = persist ? undefined : customTimer;

    Swal.fire({
      icon: type,
      title: message,
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: !persist,
      width: 'auto',
      customClass: {
        popup: 'swal-' + type + ' swal-no-wrap',
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
      showCloseButton: false, // Mostrar botón de cierre para todas las alertas
      allowEscapeKey: false, // No permitir cerrar con la tecla Escape
    });

    this.alertSubject.next({ type, message });
  }

  success(
    module: string,
    replacements?: { [key: string]: string },
    persist: boolean = false,
    customTimer: number = 3000
  ) {
    this.showAlert(
      module,
      AlertType.Success,
      replacements,
      persist,
      customTimer
    );
  }

  error(
    module: string,
    replacements?: { [key: string]: string },
    persist: boolean = false,
    customTimer: number = 3000
  ) {
    this.showAlert(module, AlertType.Error, replacements, persist, customTimer);
  }

  info(
    module: string,
    replacements?: { [key: string]: string },
    persist: boolean = false,
    customTimer: number = 3000
  ) {
    this.showAlert(module, AlertType.Info, replacements, persist, customTimer);
  }

  warning(
    module: string,
    replacements?: { [key: string]: string },
    persist: boolean = false,
    customTimer: number = 3000
  ) {
    this.showAlert(
      module,
      AlertType.Warning,
      replacements,
      persist,
      customTimer
    );
  }

  question(
    alertTitle: string //Especifica el mensaje a mostrar
  ): Observable<boolean> {
    return from(
      Swal.fire({
        title: alertTitle,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        showCloseButton: false, // Mostrar botón de cierre para todas las alertas
        allowEscapeKey: false, // No permitir cerrar con la tecla Escape
        allowOutsideClick: false, // No permitir cerrar al hacer clic fuera del pop-up
      })
    ).pipe(switchMap((result) => of(result.isConfirmed)));
  }
}
