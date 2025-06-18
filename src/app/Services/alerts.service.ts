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

  popComunicado(
    alertTitle: string, //Especifica el mensaje a mostrar
    text: string, //Detalla el por que de la alerta
    typeAlert: 'success' | 'error' | 'warning' | 'info' | 'question' //Especifica el tipo de icono a mostar para la alerta success, error, warning, info, question
  ): Observable<boolean> {
    return from(
      Swal.fire({
        title: alertTitle,
        text: text,
        icon: typeAlert,
        showCancelButton: false,
        confirmButtonText: 'Cerrar',
        showCloseButton: false, // Mostrar botón de cierre para todas las alertas
        allowEscapeKey: false, // No permitir cerrar con la tecla Escape
        allowOutsideClick: false, // No permitir cerrar al hacer clic fuera del pop-up
      })
    ).pipe(switchMap((result) => of(result.isConfirmed)));
  }

  // Función para mostrar el popup y retornar un Observable con el comentario, archivo y Base64
  showCommentPopup(
    titulo: string = '',//Especifica el titulo del popUp
    isCommentRequired: number = 0,//Bandera si el comentario es requerido
    isFileRequired: number = 0//Bandera si el archivo es requerido
  ): Observable<any> {
    const subject = new Subject<any>(); // Creamos un Subject que emitirá los valores

    Swal.fire({
      title: titulo,
      html: `
      <div>
        <div class="row">
          <div class="col-12">
            <textarea
              style="width: -webkit-fill-available !important;" 
              id="commentInput"
              class="swal2-textarea"
              placeholder="Escribe tu comentario aquí"
              toUpperCase
            ></textarea>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <input type="file" id="fileInput" class="swal2-input" />
          </div>
        </div>
      </div>`,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      width: '500px',
      heightAuto: false,
      preConfirm: async () => {
        const comment = (
          document.getElementById('commentInput') as HTMLTextAreaElement
        ).value;
        const fileInput = document.getElementById(
          'fileInput'
        ) as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (isCommentRequired == 1 && !comment) {
          Swal.showValidationMessage('El comentario es requerido');
          return false;
        }

        if (isFileRequired == 1 && !file) {
          Swal.showValidationMessage('El archivo es requerido');
          return false;
        }

        // Si hay archivo, lo convertimos a un arreglo de bytes
        if (file) {
          const byteArray = await this.convertFileToBytes(file); // Esperamos la conversión
          return { comment, file, byteArray };
        } else {
          return { comment, file: null, byteArray: null }; // Si no hay archivo, devolvemos null en el arreglo de bytes
        }
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          // Emitimos el resultado cuando el usuario confirma
          subject.next(result.value);
        } else {
          // Si el usuario cancela, emitimos un error o acción cancelada
          subject.error('Acción cancelada');
        }
        subject.complete(); // Finalizamos el Observable
      })
      .catch((error) => {
        // Manejo de errores y emisión
        console.error('Error:', error);
        subject.error(error);
        subject.complete();
      });

    return subject.asObservable(); // Retornamos el Observable
  }

  // Función para convertir el archivo a un arreglo de bytes
  private convertFileToBytes(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer; // Obtenemos el resultado como ArrayBuffer
        resolve(new Uint8Array(arrayBuffer)); // Convertimos a Uint8Array
      };
      reader.onerror = (error) => {
        reject('Error al leer el archivo');
      };
      reader.readAsArrayBuffer(file); // Leemos el archivo como ArrayBuffer
    });
  }
}
