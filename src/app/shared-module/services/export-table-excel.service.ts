import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportTableExcelService {
  constructor() { }

  exportToExcel(tableId: string, name?: string, dataList?:any[]): void {

    try {
      let timeSpan = new Date().toISOString();
      let fileName = `${name || 'Export'}-${timeSpan}`;
      
       if(dataList != undefined){
        
        const workSheet = XLSX.utils.json_to_sheet(dataList);
        const workBook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, name);
        XLSX.writeFile(workBook, `${fileName}.xlsx`);

      }else{
        { throw new Error('No hay datos'); } 
      }
    } catch (error) {
      console.error(error);
    }
   
  }

}