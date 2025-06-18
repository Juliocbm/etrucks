import { Directive, HostListener, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators } from '@angular/forms';

@Directive({
  selector: '[appDocumentoValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TipoDocumentoValidatorDirective,
      multi: true,
    },
  ],
})
export class TipoDocumentoValidatorDirective implements Validator {
  @Input('appDocumentoValidator') tipoDocumentoId!: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return { required: true };

    const patterns: { [key: number]: ValidatorFn } = {
      1: Validators.pattern(/^[A-ZÑ&]{3,4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z\d]{3}$/), // RFC
      2: this.curpValidator(), // CURP
      3: Validators.pattern(/^\d{13}$/), // INE
    };

    const validator = patterns[this.tipoDocumentoId];
    if (!validator) return { invalidDocumentType: true };

    return validator(control) ? null : { invalidDocument: true };
  }

  private curpValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const curp = control.value;
      if (!this.curpValida(curp)) {
        return { invalidCurp: true };
      }
      return null;
    };
  }

  private curpValida(curp: string): boolean {
    console.log(curp);
    const re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    const validado = re.exec(curp);
    console.log(validado);

    if (!validado) return false;

    function digitoVerificador(curp17: string): number {
      const diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
      let lngSuma = 0.0;
      let lngDigito = 0.0;

      for (let i = 0; i < 17; i++) {
        lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
      }

      lngDigito = 10 - (lngSuma % 10);
      return lngDigito === 10 ? 0 : lngDigito;
    }

    console.log(parseInt(validado[2], 10), digitoVerificador(validado[1]));
    if (parseInt(validado[2], 10) !== digitoVerificador(validado[1])) return false;
    console.log("valido");

    return true;
  }
}
