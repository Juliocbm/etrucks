import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportTableExcelService {
  constructor() { }

  exportToExcel(tableId: string, name?: string): void {
    try {
      let timeSpan = new Date().toISOString();
      let sheetName = 'Sheet';
      let fileName = `${name || 'Export'}-${timeSpan}`;
      let exportTable = document.getElementById(tableId) as HTMLTableElement;         
      if (!exportTable) { throw new Error('No se encontro tabla'); }
      let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(exportTable);
      let data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (data.length <= 1) { throw new Error('No hay datos'); }    
      data = data.map(row => row.slice(0, -1)); // Elimina el último elemento de cada fila
      ws = XLSX.utils.aoa_to_sheet(data);  
      let wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);  
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (error) {
      console.error(error);
    }
  }
}