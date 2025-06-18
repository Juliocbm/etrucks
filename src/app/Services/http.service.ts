import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AlertService, Alert } from './alerts.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  alertMessage: Alert | null = null;
  alert: string = '';
  alertType: string = '';
  catalogo: string = '';
  errorCount: number = 0;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private dialog: MatDialog
  ) {
    this.alertService.alert$.subscribe((alert: Alert) => {
      this.alert = alert.message;
      this.alertType = alert.type;
    });
  }

  // Método genérico para peticiones GET
  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http
      .get<T>(`${endpoint}`, { params })
      .pipe(catchError(this.handleError));
  }

  // Método genérico para peticiones POST
  post<T>(
    endpoint: string,
    body: any,
    options?: any,
    cerrarModal: boolean = true
  ): Observable<HttpEvent<T>> {
    return this.http
      .post<T>(`${endpoint}`, body, { ...options, observe: 'body' })
      .pipe(
        tap(() => {
          if (cerrarModal) this.dialog.closeAll();
        }),
        catchError(this.handleError)
      );
  }

  // Método genérico para peticiones PUT
  put<T>(
    endpoint: string,
    body: any,
    cerrarModal: boolean = true
  ): Observable<T> {
    return this.http.put<T>(`${endpoint}`, body).pipe(
      tap(() => {
        if (cerrarModal) this.dialog.closeAll();
      }),
      catchError(this.handleError)
    );
  }

  // Método genérico para peticiones DELETE
  delete<T>(
    endpoint: string,
    params?: any,
    cerrarModal: boolean = true
  ): Observable<T> {
    return this.http.delete<T>(`${endpoint}`, { params, observe: 'body' }).pipe(
      tap(() => {
        if (cerrarModal) this.dialog.closeAll();
      }),
      catchError(this.handleError)
    );
  }

  // Manejo centralizado de errores
  private handleError = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      Swal.fire({
        title: 'No hay ninguna conexión a Internet.',
        text: 'Vuelve a conectar para continuar usando el sistema.',
        icon: 'error',
        showCloseButton: false, // Mostrar botón de cierre para todas las alertas
        allowEscapeKey: false, // No permitir cerrar con la tecla Escape
        allowOutsideClick: false, // No permitir cerrar al hacer clic fuera del pop-up
        footer:
          '<span href="#" class="underline-text">Comunicarse con soporte.</span>',
      }).then((result) => {
        this.errorCount = 0;

        if (result.isConfirmed) {
        }
      });
    } else {
      // Solo aplicamos a errores relacionados con el estado de la respuesta http.
      if (
        error.status === 500 ||
        error.status === 409 ||
        error.status === 400
      ) {
        // Asegúrate de que error.error.errorList esté disponible
        if (
          error.error &&
          error.error.errorList &&
          error.error.errorList.length > 0
        ) {
          // Emitir el error desde el servicio de alertas con el primer mensaje de error
          this.alertService.error(
            '{message}',
            {
              message: error.error.errorList[0],
            },
            true
          );
        } else {
          if (this.errorCount < 1) {
            Swal.fire({
              title: 'Error en Sistema.',
              text: 'No se pudo cargar los datos, no se puede continuar con el proceso.',
              icon: 'error',
              confirmButtonColor: 'red',
              confirmButtonText: 'Cerrar',
              footer:
                '<span href="#" class="underline-text">Comunicarse con soporte.</span>',
              showCloseButton: false, // Mostrar botón de cierre para todas las alertas
              allowEscapeKey: false, // No permitir cerrar con la tecla Escape
              allowOutsideClick: false, // No permitir cerrar al hacer clic fuera del pop-up
            }).then((result) => {
              this.errorCount = 0;

              // if (result.isConfirmed) {
              //   this.dialog.closeAll();
              // }
            });
          }
        }
      } else {
        // Maneja otros errores si es necesario
        this.alertService.error(error.message);
      }
    }

    this.errorCount++;

    // Lanza el error para que pueda ser manejado en otros lugares si es necesario
    return throwError(() => error);
  };
}
