import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Validador de RFC
 */
export function validarRFC(): ValidatorFn {
  return (control: AbstractControl) => {
    const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i;
    return RFC_REGEX.test(control.value) ? null : { rfcInvalido: true };
  };
}

/**
 * Validador de INE
 */
export function validarINE(): ValidatorFn {
  return (control: AbstractControl) => {
    const INE_REGEX = /^[0-9]{13}$/; // Ajusta según el formato de INE
    return INE_REGEX.test(control.value) ? null : { ineInvalido: true };
  };
}

/**
 * Validador de CURP
 */
export function validarCURP(): ValidatorFn {
  return (control: AbstractControl) => {
    const CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/i;
    return CURP_REGEX.test(control.value) ? null : { curpInvalido: true };
  };
}

/**
 * Función para aplicar validadores dinámicamente
 */
export function obtenerValidadoresPorTipo(tipo: number): ValidatorFn[] {
  switch (tipo) {
    case 1: // RFC
      return [validarRFC()];
    case 2: // INE
      return [validarINE()];
    case 3: // CURP
      return [validarCURP()];
    default:
      return [];
  }
}
