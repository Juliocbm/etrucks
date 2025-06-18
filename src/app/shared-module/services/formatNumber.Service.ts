import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as JsBarcode from 'jsbarcode';

@Injectable({
  providedIn: 'root',
})
export class FormatNumberService {
  constructor() {}

  formatNumber(value: any, char?: string) {

    if (value == null || value == undefined ) 
      return;

    // Convertir a string si es un número
    if (typeof value === 'number') {
      value = value.toString();
    }

    value = value.replace(/[^0-9.-]*/g, '');
    const parts = value.split('.');

    //Agrega una coma cada 3 cifras
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    value = parts.join('.');

    //Solo acepta un punto decimal
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }

       // Solo acepta dos decimales y completa con ceros si es necesario
       if (parts.length > 1) {
        let decimalPart = parts[1].slice(0, 4);
        // if (decimalPart.length < 4) {
        //   decimalPart = decimalPart.padEnd(4, '0');
        // }
        value = `${parts[0]}.${decimalPart}`;
      } 
      // else {
      //   value = `${parts[0]}.0000`;
      // }

      if(char != null)
      value = char + value;

    return value;
  }

  convertToNumber(value: any): number {
    if (value == null || value === '0') return 0;

    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }

    value = value.replace(/[^0-9.]*/g, '');
    const numberValue = Number(value);

    return isNaN(numberValue) ? 0 : numberValue;
  }

  // convertToNumber(value: any): number {
  //   console.log('convertToNumber',value);
  //   if (value == null || value == '0') return 0;

  //   if (typeof value === 'number')
  //     return value;
   
  //   value = value.replace(/[^0-9.-]*/g, '');

  //   return Number(value);
  // }

  textNumber(num: number) {

    console.log('textNumber', num);
    let numWord: string = '';
    let numUnidad: number = 0;
    let numResult: number = num;
    let and: string = ' ';

    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);

    const decimalPartInWords = decimalPart.toString().padStart(2, '0');

    numUnidad = Math.floor(numResult / 1000);
    if (numUnidad > 0) {
      if (numUnidad > 1)
        numWord = numWord + this.numberToWords(numUnidad) + ' MIL';
      else numWord = 'MIL ';
      numResult = numResult - numUnidad * 1000;
    }

    numUnidad = Math.floor(numResult / 100) * 100;
    if (numUnidad > 0) {
      numWord = numWord + ' ' + this.numberToWords(numUnidad);
      numResult = numResult - numUnidad;
    }

    numUnidad = Math.floor(numResult / 10) * 10;
    if (numUnidad > 0) {
      numWord = numWord + ' ' + this.numberToWords(numUnidad);
      numResult = numResult - numUnidad;
      and = ' Y ';
    }

    numUnidad = Math.floor(numResult);
    if (numUnidad > 0) {
      numWord = numWord + and + this.numberToWords(numUnidad);
      numResult = numResult - numUnidad;
    }
    return `${numWord} ${decimalPartInWords}/100 M.N.`;
  }

  numberToWords(num: number): string {
    const units = [
      '',
      'UNO',
      'DOS',
      'TRES',
      'CUATRO',
      'CINCO',
      'SEIS',
      'SIETE',
      'OCHO',
      'NUEVE',
    ];
    const tens = [
      '',
      'DIEZ',
      'VEINTE',
      'TREINTA',
      'CUARENTA',
      'CINCUENTA',
      'SESENTA',
      'SETENTA',
      'OCHENTA',
      'NOVENTA',
    ];
    const teens = [
      'ONCE',
      'DOCE',
      'TRECE',
      'CATORCE',
      'QUINCE',
      'DIECISEIS',
      'DIECISIETE',
      'DIECIOCHO',
      'DIECINUEVE',
    ];
    const hundreds = [
      '',
      'CIENTO',
      'DOSCIENTOS',
      'TRESCIENTOS',
      'CUATROCIENTOS',
      'QUINIENTOS',
      'SEISCIENTOS',
      'SETECIENTOS',
      'OCHOCIENTOS',
      'NOVECIENTOS',
    ];

    if (num === 0) return 'CERO';

    if (num === 100) return 'CIEN';

    let word = '';

    if (Math.floor(num / 100) > 0) {
      word += hundreds[Math.floor(num / 100)] + ' ';
    }

    let remainder = num % 100;

    if (remainder >= 11 && remainder <= 19) {
      word += teens[remainder - 11];
    } else {
      if (Math.floor(remainder / 10) > 0) {
        word += tens[Math.floor(remainder / 10)] + ' ';
      }
      remainder = remainder % 10;
      if (remainder > 0) {
        word += units[remainder];
      }
    }

    return word.trim();
  }
}
