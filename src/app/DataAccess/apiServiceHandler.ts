import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ApiServiceHandler {
  constructor() {}

  // Manejar la obtención de datos Async
  getDatosAsync(apiService: () => Observable<any>, dataProperty: string): Observable<any> {
    return apiService().pipe(
      catchError(error => {
        console.error(`Error al obtener ${dataProperty}:`, error);
        return of(null);
      })
    );
  }

  // Manejar la obtención de datos Sync
  getDatosSync(apiService: () => void, dataProperty: string) {
    try {
      apiService();
    } catch (error) {
      console.error(`Error al obtener ${dataProperty}:`, error);
    }
  }
}
