import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, take } from 'rxjs';

// Función para crear el validador de dominio de correo
const DOMINIOS_PERMITIDOS_DEFAULT = ['hgtransportaciones.com', 'lindatransportaciones.com'];

export function validarDominioCorreoAsync(dominiosPermitidos: string[] = DOMINIOS_PERMITIDOS_DEFAULT): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(500),// Esperar 500ms después de cada cambio para reducir peticiones
      distinctUntilChanged(),// Solo emitir si el valor actual es diferente al último
      take(1), // Toma el primer cambio después de la pausa
      map(valor => {
        const dominioCorreo = valor.split('@')[1];
        const esValido = dominiosPermitidos.includes(dominioCorreo.toLowerCase());
        console.log('Dominio válido:', esValido);
        return esValido ? null : { dominioInvalido: true };
      }),
      catchError(() => of(null))// En caso de error
    );
  };
}

export function validarDominioCorreoPersonalAsync(dominiosNoPermitidos: string[] = DOMINIOS_PERMITIDOS_DEFAULT): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(500), // Esperar 500ms después de cada cambio para reducir peticiones
      distinctUntilChanged(), // Solo emitir si el valor actual es diferente al último
      take(1), // Toma el primer cambio después de la pausa
      map(valor => {
        const dominioCorreo = valor.split('@')[1];
        const esNoValido = dominiosNoPermitidos.includes(dominioCorreo.toLowerCase());
        console.log('Dominio no válido:', esNoValido);
        return esNoValido ? { dominioInvalido: true } : null;
      }),
      catchError(() => of(null)) // En caso de error
    );
  };
}


//funcion para validar el formato de email
export function validarFormatoCorreoAsync(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return of(control.value).pipe(
      debounceTime(500),// Esperar 500ms después de cada cambio para reducir peticiones
      distinctUntilChanged(),// Solo emitir si el valor actual es diferente al último
      take(1), // Toma el primer cambio después de la pausa
      map(valor => {
        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const esValido = patronCorreo.test(valor);
        console.log('Formato de correo válido:', esValido);
        return esValido ? null : { formatoInvalido: true };
      }),
      catchError(() => of(null))// En caso de error
    );
  };
}

// validacion para numeros telefonicos
export const patterTelefono = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
export function validarTelefonoAsync(pattern: RegExp): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }    
    return of(control.value).pipe(
      debounceTime(500), // Esperar 500ms después de cada cambio para reducir peticiones
      distinctUntilChanged(), // Solo emitir si el valor actual es diferente al último
      take(1), // Toma el primer cambio después de la pausa
      map(valor => {
        const esValido = pattern.test(valor);
        console.log('Número telefónico válido:', esValido);
        return esValido ? null : { patronInvalido: true };
      }),
      catchError(() => of(null)) // En caso de error
    );
  };
}

export const patterCURP: string = "^[A-Z]{4}\\d{6}[HM][A-Z]{5}[0-9A-Z]{2}$";
export const patterCP: string = "^\\d{5}$";
export const patterNumber: string = '/^\d+$/';
// función validadora para el correo electrónico
export const patterRfc: string = "^(XAXX010101000|XEXX010101000|([A-Z&Ñ]{3,4})(\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]))([A-Z\\d]{3}))$";
/* export function validarRfcExistente(validarRfcFn: (rfc: string) => Observable<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      // Si el campo está vacío, no necesitamos validar
      return of(null);
    }
    return control.valueChanges.pipe(
      debounceTime(700), // Espera por 500ms después de cada pulsación para evitar demasiadas peticiones
      distinctUntilChanged(), // Solo emitir si el valor actual es diferente al último
      take(1), // Toma el primer cambio después de la pausa
      switchMap(valor => validarRfcFn(valor)),// aqui debo agregar el idPermisionario 
      map(existe => {
        console.log('RFC existente:', existe);
        return existe ? { correoExistente: true } : null;
      }),
      catchError(() => of(null)) // En caso de error
    );
  };
} */
export function validarRfcExistente(idPermisionario: number | null, validarRfcFn: (idPermisionario: number | null, rfc: string) => Observable<boolean>): AsyncValidatorFn {
  console.log('validarRfcExistente', idPermisionario);
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      // Si el campo está vacío, no necesitamos validar
      return of(null);
    }
    return control.valueChanges.pipe(
      debounceTime(700), // Espera por 500ms después de cada pulsación para evitar demasiadas peticiones
      distinctUntilChanged(), // Solo emitir si el valor actual es diferente al último
      take(1), // Toma el primer cambio después de la pausa
      switchMap(valor => validarRfcFn(idPermisionario, valor)),
      map(existe => {
        console.log('RFC existente:', existe);
        return existe ? { correoExistente: true } : null;
      }),
      catchError(() => of(null)) // En caso de error
    );
  };
}



