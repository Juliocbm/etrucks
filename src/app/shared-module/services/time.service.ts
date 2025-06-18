import { Injectable } from '@angular/core';
import { formatInTimeZone, toDate } from 'date-fns-tz';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  // Obtener la zona horaria del dispositivo del usuario
  userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor() { }

  toTimeZone(date: Date = new Date()): string {
    const isoString = formatInTimeZone(date, this.userTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"); // Formato ISO 8601
    return isoString;
  }

  stringToDate(fechaString: string): Date {
    const convertToDate = toDate(fechaString, { timeZone: this.userTimeZone });
    return convertToDate;
  }

  getDateTimeNow() {
    let date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  }


  /**
 * Formatea un objeto Date en formato 'YYYY-MM-DD'.
 * @param date Fecha a formatear
 * @returns Fecha en formato 'DD-MM-YYYY' o null si no es válida.
 */
  formatDate(date: Date): string {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}/${month}/${day}`; // Formato 'YYYY-MM-DD'
      // return `${day}/${month}/${year}`; // Formato 'DD/MM/YYYY'
    }
    return '';
  }

    /**
   * Formatea un objeto Date en formato 'YYYY-MM-DD HH:MM:SS'.
   * @param date Fecha a formatear
   * @returns Fecha en formato 'HH:MM' o null si no es válida.
   */
  formatTime(date: Date): string {
    // Si la fecha es válida
    if (date) {
      // Obtiene las horas y minutos
      const time = date;
      const hours = time.getHours();
      const minutes = time.getMinutes();

      const strHours = String(hours).padStart(2, '0');
      const strMinutes = String(minutes).padStart(2, '0');

      return `${strHours}:${strMinutes}`;  // Formato 'HH:mm'
    }
    return '';
  }


  /**
   * Aplica la zona horaria del usuario a un objeto Date y lo devuelve como Date.
   * @param date Fecha a transformar
   * @returns Fecha ajustada según la zona horaria del usuario
   */
  applyTimeZoneToDate(date: Date): Date {
    const isoString = this.toTimeZone(date); // Convierte la fecha a ISO en zona horaria del usuario
    return this.stringToDate(isoString); // Convierte el string ISO nuevamente a Date
  }


  /**
   * Convierte un string en formato 'HH:MM' a un objeto Date.
   * @param timeString Hora en formato 'HH:MM'
   * @returns Objeto Date con la hora especificada
   * @throws Error si el formato de la hora no es válido
   * @throws Error si la hora no es válida
   */
  formatTimeToDate(timeString: string): Date {
    const time = timeString.split(':');
    const hours = parseInt(time[0], 10);
    const minutes = parseInt(time[1], 10);

    // Si la hora es válida
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      const dateString = this.toTimeZone();
      const date = this.stringToDate(dateString);
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    throw new Error('La hora no es válida');
  }

}
