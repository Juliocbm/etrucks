import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportTableCsvService {
  constructor() { }

  exportToCsv(dataList: any[], name: string = 'Export', isColumns: boolean = true ): void {
    try {
      if (!dataList || !dataList.length) {
        throw new Error('No hay datos para exportar');
      }
      // Construir el nombre del archivo
      var fileName = `${name}.csv`;
      // Validar que el nombre del archivo no esté vacío
      if(!name) {
        // Si no hay nombre, concatenas la fecha actual con el nombre por defecto
        const timeSpan = new Date().toISOString();
        fileName += `${timeSpan}.csv`; // Nombre del archivo con la fecha actual concatenada
      }

      // Crear el contenido del archivo CSV
      const headers = Object.keys(dataList[0]);
      let csvRows: string[];

      if(isColumns){
        csvRows = [
          headers.join(','), // Encabezados de columnas
          ...dataList.map(row => headers.map(header => `"${row[header]}"`).join(',')) // Filas de datos
        ];
      }
      else{
        csvRows = [
          ...dataList.map(row => headers.map(header => `"${row[header]}"`).join(',')) // Filas de datos
        ];
      }
      const csvContent = csvRows.join('\r\n');

      // Crear un blob de tipo CSV y descargarlo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (error) {
      console.error(error);
    }
  }

}
