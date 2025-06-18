import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParametrosGeneralesService {
  private configUrl = 'assets/parametrosGenerales.json';

  constructor(private http: HttpClient) {}

  // Método para obtener todo el archivo de configuración
  private loadConfig(): Observable<any> {
    return this.http.get(this.configUrl).pipe(
      catchError(() => {
        console.error('Error al cargar el archivo de configuración');
        return of({});
      })
    );
  }

  // Método para obtener una propiedad específica usando una ruta dinámica
  getParametro(ruta: string): Observable<any> {
    return this.loadConfig().pipe(
      map((config) => this.getValueFromPath(config, ruta))
    );
  }

  // Función auxiliar para navegar por el objeto según la ruta proporcionada
  private getValueFromPath(config: any, path: string): any {
    const pathParts = path.split('.');
    let currentValue = config;

    for (const part of pathParts) {
      if (currentValue && currentValue.hasOwnProperty(part)) {
        currentValue = currentValue[part];
      } else {
        return 'Valor no encontrado'; // Manejo de error en caso de que la propiedad no exista
      }
    }

    return currentValue;
  }
}
