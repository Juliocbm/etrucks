import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'espaciado'
})
export class EspaciadoPipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    // Dividimos la ruta en segmentos separados por '/'
    const segments = value.split('/');
    
    // Iteramos a través de los segmentos y formateamos cada uno
    const formattedSegments = segments.map(segment => {
      // Si el segmento es ":id" o un UUID, lo ignoramos
      if (segment === ':id' || /^[A-Fa-f0-9-]{36}$/.test(segment)) {
        return '';
      }
      
      // Aplicamos el formateo para agregar espacios antes de las mayúsculas
      return segment.replace(/([A-Z])/g, ' $1');
    });

    // Filtramos los segmentos vacíos (donde estaba ":id" o el UUID)
    const filteredSegments = formattedSegments.filter(segment => segment !== '');
    
    // Unimos los segmentos formateados nuevamente con '/'
    const formattedValue = filteredSegments.join('/').trim().toLowerCase();
    
    return formattedValue;
  }
}
