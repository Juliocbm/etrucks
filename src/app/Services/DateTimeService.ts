import { Injectable } from '@angular/core';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { formatDate } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  // Obtener la zona horaria del dispositivo del usuario
  userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  constructor() {}

  toTimeZone(date: Date = new Date()): string {
    // Formatear la fecha en la zona horaria del usuario y en formato ISO 8601
    const isoString = formatInTimeZone(
      date,
      this.userTimeZone,
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    return isoString;
  }

  toUTCDate(dateInput: Date = new Date()) {
    const date = new Date(dateInput);
    // Obtener los componentes de la fecha
    const dayName = date.toLocaleString('en-US', { weekday: 'short' });
    const monthName = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Obtener el offset de la zona horaria en horas y minutos
    const timezoneOffset = -date.getTimezoneOffset();
    const timezoneHours = Math.floor(timezoneOffset / 60)
      .toString()
      .padStart(2, '0');
    const timezoneMinutes = (timezoneOffset % 60).toString().padStart(2, '0');
    const timezoneSign = timezoneOffset >= 0 ? '+' : '-';

    return new Date(
      `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}:${seconds} GMT${timezoneSign}${timezoneHours}${timezoneMinutes}`
    );
  }
  toTime(date: Date | null = new Date()): string {
    if (!date) {
      date = new Date();
    }
    // Formatear la fecha en la zona horaria del usuario y en formato ISO 8601
    const isoString = formatInTimeZone(date, this.userTimeZone, 'HH:mm:ssXXX');
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

  getformatDate(date: Date = new Date(), format:string = 'dd/MM/yyyy'): string{

    return formatDate(date , format,'en-US')
  }
}
