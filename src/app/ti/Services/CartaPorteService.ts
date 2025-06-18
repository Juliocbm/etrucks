import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartaPorte } from '../../models/ti/cfdi/cartaPorte';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CartaPorteService {
  private cartaPorteSubject = new BehaviorSubject<CartaPorte>(new CartaPorte(0, 0, '', '', '', [], [], [], [], [], [], []));
  cartaPorte$ = this.cartaPorteSubject.asObservable();

  // Almacenar estado de validaciones y errores de cada tab
  private validacionesSubject = new BehaviorSubject<{ [key: string]: boolean }>({});
  validaciones$ = this.validacionesSubject.asObservable();

  private erroresSubject = new BehaviorSubject<{ [key: string]: string[] }>({});
  errores$ = this.erroresSubject.asObservable();

   // ✅ Método para obtener un nuevo objeto "limpio"
   getNuevaCartaPorte(): CartaPorte {
    return new CartaPorte(0, 0, '', '', '', [], [], [], [], [], [], []);
  }

  // ✅ Método para limpiar completamente la carta porte
  resetCartaPorte() {
    this.cartaPorteSubject.next(this.getNuevaCartaPorte());
  }
  
  actualizarCartaPorte(parcial: Partial<CartaPorte>) {
    const cartaPorteActual = this.cartaPorteSubject.value;
    this.cartaPorteSubject.next({ ...cartaPorteActual, ...parcial });
  }


  actualizarErrores(tab: string, errores: string[]) {
    const erroresActuales = this.erroresSubject.value;
    this.erroresSubject.next({ ...erroresActuales, [tab]: errores });
  }

  actualizarValidacion2(tab: string, formulario: FormGroup) {
    const tieneErrores = formulario.invalid;
    const errores = this.obtenerErrores(formulario);

    const validacionesActuales = this.validacionesSubject.value;
    this.validacionesSubject.next({ ...validacionesActuales, [tab]: tieneErrores });

    const erroresActuales = this.erroresSubject.value;
    this.erroresSubject.next({ ...erroresActuales, [tab]: errores });
    if(tab = 'internacional'){

      console.log('tieneErrores internacional',tieneErrores); 
      console.log('errores internacional',errores); 
    }

    formulario.markAllAsTouched();
  }

  actualizarValidacion3(tab: string, formulario: FormGroup, erroresTabla: string[] = []) {
    const tieneErroresFormulario = formulario.invalid;
    const erroresFormulario = this.obtenerErrores(formulario);
  
    const tieneErroresTotales = tieneErroresFormulario || erroresTabla.length > 0;
    const erroresCombinados = [...erroresFormulario, ...erroresTabla];
  
    this.validacionesSubject.next({ ...this.validacionesSubject.value, [tab]: tieneErroresTotales });
    this.erroresSubject.next({ ...this.erroresSubject.value, [tab]: erroresCombinados });
  
    console.log(`🚨 [${tab.toUpperCase()}] - Tiene errores:`, tieneErroresTotales);
    console.log(`📜 [${tab.toUpperCase()}] - Lista de errores:`, erroresCombinados);
  
    formulario.markAllAsTouched();
  }
  

  obtenerErrores(formulario: FormGroup): string[] {
    const errores: string[] = [];

    Object.keys(formulario.controls).forEach(key => {
      const control = formulario.get(key);
      if (control?.invalid) {
        errores.push(this.obtenerMensajeError(control.errors, key));
      }
    });

    return errores;
  }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  obtenerMensajeError(errors: any, nombreCampo: string): string {
    if (errors?.['required']) return `El campo ${nombreCampo} es obligatorio.`;
    if (errors?.['minlength']) return `El campo ${nombreCampo} debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
    if (errors?.['maxlength']) return `El campo ${nombreCampo} no puede tener más de ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors?.['pattern']) return `El campo ${nombreCampo} tiene un formato incorrecto.`;

    return `El campo ${nombreCampo} no es válido.`;
  }



  // Método para actualizar el estado de validación de una tab
  actualizarValidacion(tab: string, tieneErrores: boolean) {
    const validacionesActuales = this.validacionesSubject.value;
    this.validacionesSubject.next({ ...validacionesActuales, [tab]: tieneErrores });
  }

  obtenerCartaPorteActual(): CartaPorte {
    return this.cartaPorteSubject.value; // ✅ Devuelve el valor actual de cartaPorte
  }
  
}
