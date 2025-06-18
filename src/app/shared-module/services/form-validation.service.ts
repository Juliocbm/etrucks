import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { AlertService } from '../../Services/alerts.service';
import { FieldsFormConfig } from '../Interfaces/FieldsFormConfig';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor(private alertService: AlertService) {}

  camposNoCompletos: { key: string; alias: string; index: number }[] = [];

  getAlias(
    formControlName: string,
    fieldsForm?: FieldsFormConfig | any
  ): string {
    return fieldsForm[formControlName]?.alias || formControlName;
  }

  /** VIGENTE
   * Se usa en campos requeridos numericos, para que no se pueda ingresar 0 como valor valido
   * @param control - control del formulario reactivo a validar
   * @returns boolean - Indica si el formulario es valido
   */
  noZeroValidator(control: AbstractControl): ValidationErrors | null {
    return control.value === 0 ? { noZero: true } : null;
  }

  /** VIGENTE
   * Verifica si todos los campos del formulario son validos con respecto a sus validaciones [required, pattern, max, min, email, minlength, maxlength, ...]
   * @param formulario - Formulario reactivo a validar
   * @returns boolean - Indica si el formulario es valido
   */
 /*  isFormValid(
    formulario: FormGroup,
    fieldsForm?: FieldsFormConfig | any
  ): boolean {
    let formularioCompleto: boolean = true; // Inicialmente asumimos que el formulario es válido

    Object.keys(formulario.controls).forEach((controlName) => {
      const control = formulario.get(controlName);

      if (control && this.esRequerido(control) && control.value === 0) {
        // Convertir el valor 0 a null
        control.setValue(null);
      } else if (control && this.esRequerido(control) && control.value === '') {
        // Convertir la cadena vacía a null
        control.setValue(null);
      }
    });

    // Obtener las claves en el orden en el que están definidas en fieldsFormLinea
    const orderedKeys = Object.keys(fieldsForm);

    // Obtener todos los campos del formulario junto con su índice calculado dinámicamente
    const camposFormulario = Object.keys(formulario.controls).map((key) => {
      const control = formulario.get(key);

      return {
        key,
        control,
        index: orderedKeys.indexOf(key) !== -1 ? orderedKeys.indexOf(key) : 999, // Si no está en la lista, asigna 999
        alias: fieldsForm?.[key]?.alias || key, // Nombre amigable del campo
      };
    });

    // Ordenar los campos por indexForm (prioridad más baja primero)
    camposFormulario.sort((a, b) => b.index - a.index);

    // Limpiar la lista de campos no completos
    this.camposNoCompletos = [];

    // Recorrer todos los campos y validar si están llenos y válidos
    for (const { key, control, alias, index } of camposFormulario) {
      if (!control!.valid) {
        const mensajeError = this.obtenerMensajeError(control!.errors, alias);
        this.camposNoCompletos.push({ key, alias, index });

        // Mostrar alerta con el mensaje específico
        this.alertService.error(mensajeError);
        formularioCompleto = false; // Si al menos un campo es inválido, el formulario no está completo
      }
    }

    this.camposNoCompletos = []; // Limpiar la lista después de la validación
    formulario.markAllAsTouched();
    return formularioCompleto;
  } */
 
  /** VIGENTE
   * Verifica si todos los campos del formulario son validos con respecto a sus validaciones [required, pattern, max, min, email, minlength, maxlength, ...]
   * @param formulario - Formulario reactivo a validar
   * @param initialFormValues - Valores iniciales del formulario (para modo EDIT)
   * @param tipoModal - Tipo de modal ('CREATE', 'EDIT', 'DETAIL')
   * @returns boolean - Indica si el formulario es valido
   */
  isFormValid(
    formulario: FormGroup,
    initialFormValues?: any,
    tipoModal?: string,
    fieldsForm?: FieldsFormConfig | any
  ): boolean {
    let formularioCompleto: boolean = true; // Inicialmente asumimos que el formulario es válido

    Object.keys(formulario.controls).forEach((controlName) => {
      const control = formulario.get(controlName);

      if (control && this.esRequerido(control) && (control.value === 0 || control.value == '0' ||
         control.value == '00000000-0000-0000-0000-000000000000')) {
        // Convertir el valor 0 a null
        control.setValue(null);
      } else if (control && this.esRequerido(control) && control.value === '') {
        // Convertir la cadena vacía a null
        control.setValue(null);
      }
    });

    // Obtener las claves en el orden en el que están definidas en fieldsFormLinea
    const orderedKeys = Object.keys(fieldsForm);

    // Obtener todos los campos del formulario junto con su índice calculado dinámicamente
    const camposFormulario = Object.keys(formulario.controls).map((key) => {
      const control = formulario.get(key);

      return {
        key,
        control,
        index: orderedKeys.indexOf(key) !== -1 ? orderedKeys.indexOf(key) : 999, // Si no está en la lista, asigna 999
        alias: fieldsForm?.[key]?.alias || key, // Nombre amigable del campo
      };
    });

    // Ordenar los campos por indexForm (prioridad más baja primero)
    camposFormulario.sort((a, b) => b.index - a.index);

    // Limpiar la lista de campos no completos
    this.camposNoCompletos = [];

    // Recorrer todos los campos y validar si están llenos y válidos
    for (const { key, control, alias, index } of camposFormulario) {
      if (!control!.valid) {
        const mensajeError = this.obtenerMensajeError(control!.errors, alias);
        this.camposNoCompletos.push({ key, alias, index });

        // Mostrar alerta con el mensaje específico
        this.alertService.error(mensajeError);
        formularioCompleto = false; // Si al menos un campo es inválido, el formulario no está completo
      }
    }

    // Validación adicional en modo edición
    if (tipoModal === 'EDIT' && formularioCompleto && initialFormValues) {
      console.log('nuevo', JSON.stringify(formulario.getRawValue()));
      console.log('original', JSON.stringify(initialFormValues));
      if (
        JSON.stringify(formulario.getRawValue()) ===
        JSON.stringify(initialFormValues)
      ) {
        formularioCompleto = false;
        this.alertService.error(`No hay cambios por actualizar`);
      }
    }

    this.camposNoCompletos = []; // Limpiar la lista después de la validación
    formulario.markAllAsTouched();
    return formularioCompleto;
  }

  private obtenerMensajeError(
    errors: ValidationErrors | null,
    nombreCampo: string
  ): string {
    if (!errors) return `El campo ${nombreCampo} tiene un error desconocido`;

    if (errors['required']) {
      return `El campo ${nombreCampo} es obligatorio`;
    }
    if (errors['pattern']) {
      if (errors['pattern'].requiredPattern === '/.*\\S.*/') {
        return `El campo ${nombreCampo} no puede contener solo espacios en blanco`;
      }
      return `El campo ${nombreCampo} tiene un formato incorrecto`;
    }
    if (errors['max']) {
      return `El valor de ${nombreCampo} no puede ser mayor a ${errors['max'].max}`;
    }
    if (errors['min']) {
      return `El valor de ${nombreCampo} no puede ser menor a ${errors['min'].min}`;
    }
    if (errors['email']) {
      return `El campo ${nombreCampo} debe ser un correo válido`;
    }
    if (errors['minlength']) {
      return `El campo ${nombreCampo} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `El campo ${nombreCampo} no puede tener más de ${errors['maxlength'].requiredLength} caracteres`;
    }

    /* return `El campo ${nombreCampo} no es válido`; */
    return `El campo ${nombreCampo} es obligatorio`;
  }

  /**
   * Verifica si todos los campos requeridos del formulario están completos
   * @param formulario - Formulario reactivo a validar
   * @param initialFormValues - Valores iniciales del formulario (para modo EDIT)
   * @param tipoModal - Tipo de modal ('CREATE', 'EDIT', 'DETAIL')
   * @returns boolean - Indica si el formulario está completo
   */
  verificarCamposRequeridosCompletos(
    formulario: FormGroup,
    initialFormValues?: any,
    tipoModal?: string
  ): boolean {
    let alertaMostrada = false;

    Object.keys(formulario.controls).forEach((controlName) => {
      const control = formulario.get(controlName);

      if (control && this.esRequerido(control) && control.value === 0) {
        // Convertir el valor 0 a null
        control.setValue(null);

        if (!alertaMostrada) {
          // Generar nombre amigable para la alerta
          const nombreMostrar = this.generarNombreAmigable(controlName);

          this.alertService.error('default.formulario.error.campos', {
            source: nombreMostrar,
          });

          alertaMostrada = true;
        }
      } else if (control && this.esRequerido(control) && control.value === '') {
        // Convertir la cadena vacía a null
        control.setValue(null);

        if (!alertaMostrada) {
          // Generar nombre amigable para la alerta
          const nombreMostrar = this.generarNombreAmigable(controlName);

          this.alertService.error('default.formulario.error.campos', {
            source: nombreMostrar,
          });

          alertaMostrada = true;
        }
      }
    });

    if (alertaMostrada) {
      return false;
    }

    const formularioCompleto = Object.values(formulario.controls).every(
      (control: AbstractControl) => {
        return this.esRequerido(control)
          ? control.value !== null && control.value !== '' && control.valid
          : true;
      }
    );

    // Para modo edición, verificar si ha habido cambios
    if (tipoModal === 'EDIT' && formularioCompleto && initialFormValues) {
      return !(
        JSON.stringify(formulario.getRawValue()) ===
        JSON.stringify(initialFormValues)
      );
    }

    return formularioCompleto;
  }

  /**
   * Verifica si un control tiene el validador 'required'
   * @param control - Control a verificar
   * @returns boolean - Indica si el control es requerido
   */
  esRequerido(control: AbstractControl): boolean {
    if (control.validator) {
      const validator = control.validator({} as AbstractControl);
      return validator && validator['required'] ? true : false;
    }
    return false;
  }

  /**
   * Determina automáticamente si un campo debe ser excluido de las alertas
   * Esta función detecta automáticamente campos ID y otros que típicamente no requieren alertas
   * El comportamiento ahora es configurable para incluir campos ID que son requeridos
   *
   * @param nombreCampo - Nombre del campo a evaluar
   * @param incluirIdsRequeridos - Si es true, no excluirá campos ID que son requeridos (por defecto false)
   * @returns boolean - True si el campo debe ser excluido de las alertas, false en caso contrario
   */
  debeExcluirDeAlertas(
    nombreCampo: string,
    incluirIdsRequeridos: boolean = false
  ): boolean {
    // Si estamos incluyendo IDs requeridos, no retornamos aquí
    // Este flag se usará principalmente en las funciones de validación
    if (!incluirIdsRequeridos) {
      // Detectar campos que comienzan con 'id' o contienen 'Id' como parte del nombre
      if (nombreCampo.startsWith('id') || nombreCampo.includes('Id')) {
        return true;
      }
    }

    // Lista de sufijos y prefijos comunes para campos que no deberían mostrar alertas
    // Excluimos 'id' de la lista si estamos incluyendo IDs requeridos
    const prefijosExcluir = incluirIdsRequeridos
      ? ['ref', 'codigo', 'uuid', 'guid']
      : ['id', 'ref', 'codigo', 'uuid', 'guid'];

    const sufijosExcluir = incluirIdsRequeridos
      ? ['Ref', 'Code', 'Codigo', 'UUID', 'GUID']
      : ['Id', 'Ref', 'Code', 'Codigo', 'UUID', 'GUID'];

    // Verificar prefijos
    for (const prefijo of prefijosExcluir) {
      if (nombreCampo.toLowerCase().startsWith(prefijo.toLowerCase())) {
        return true;
      }
    }

    // Verificar sufijos
    for (const sufijo of sufijosExcluir) {
      if (nombreCampo.endsWith(sufijo)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Genera un nombre amigable a partir del nombre del campo
   * Convierte camelCase o snake_case a texto legible con espacios
   * Ahora maneja mejor los campos con prefijo 'id' para generar nombres descriptivos
   *
   * @param nombreCampo - Nombre del campo a convertir
   * @returns string - Nombre amigable para mostrar en alertas
   */
  generarNombreAmigable(nombreCampo: string): string {
    // Si el nombre ya tiene espacios, probablemente ya sea amigable
    if (nombreCampo.includes(' ')) {
      return nombreCampo;
    }

    // Procesamiento especial para campos que comienzan con 'id'
    let nombreProcesado = nombreCampo;
    let prefijo = '';

    // Detectar si comienza con 'id' seguido de mayúscula (ej: idPlazaOrigen, idTipoRuta)
    if (nombreCampo.match(/^id[A-Z]/)) {
      // Extraer la parte después de 'id' para procesarla
      nombreProcesado = nombreCampo.substring(2);

      // En algunos casos específicos, agregar un prefijo descriptivo
      if (nombreProcesado.includes('Plaza')) {
        prefijo = 'Plaza de ';
      } else if (nombreProcesado.includes('Tipo')) {
        prefijo = 'Tipo de ';
      }
    }

    // Reemplazar camelCase con espacios
    let nombreAmigable = nombreProcesado
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase();

    // Reemplazar snake_case con espacios
    nombreAmigable = nombreAmigable.replace(/_/g, ' ');

    // Eliminar cualquier 'id ' que pueda quedar al principio después de procesar
    nombreAmigable = nombreAmigable.replace(/^id /i, '');

    // Capitalizar primera letra y agregar prefijo si existe
    nombreAmigable =
      nombreAmigable.charAt(0).toUpperCase() + nombreAmigable.slice(1);

    return prefijo + nombreAmigable;
  }

  /**
   * Valida campos específicos y muestra alertas para campos requeridos no completados
   * @param formulario - Formulario reactivo a validar
   * @param nombresCampos - Objeto con nombres de campos y sus etiquetas para mostrar en alertas
   * @returns boolean - Indica si todos los campos son válidos
   */
  validarCamposRequeridos(
    formulario: FormGroup,
    nombresCampos: { [key: string]: string }
  ): boolean {
    let esValido = true;

    for (const controlName of Object.keys(nombresCampos)) {
      const control = formulario.get(controlName);

      // Verificar si el control es requerido y tiene valor 0
      if (control && this.esRequerido(control) && control.value === 0) {
        // Convertir el valor 0 a null
        control.setValue(null);

        this.alertService.error('default.formulario.error.campos', {
          source: nombresCampos[controlName],
        });
        esValido = false;
        break; // Mostrar solo la primera alerta para no sobrecargar al usuario
      }
      // Verificar si el control es requerido y tiene valor cadena vacía
      else if (control && this.esRequerido(control) && control.value === '') {
        // Convertir la cadena vacía a null
        control.setValue(null);

        this.alertService.error('default.formulario.error.campos', {
          source: nombresCampos[controlName],
        });
        esValido = false;
        break; // Mostrar solo la primera alerta para no sobrecargar al usuario
      }
      // Verificar si el control es requerido y está vacío
      else if (
        control &&
        this.esRequerido(control) &&
        (control.value === null || control.value === '')
      ) {
        this.alertService.error('default.formulario.error.campos', {
          source: nombresCampos[controlName],
        });
        esValido = false;
        break; // Mostrar solo la primera alerta para no sobrecargar al usuario
      }
    }

    return esValido;
  }

  /**
   * Valida todos los campos requeridos del formulario de forma 100% dinámica
   * No requiere configuración manual de campos, todo se detecta automáticamente
   *
   * @param formulario - Formulario reactivo a validar
   * @returns boolean - Indica si todos los campos requeridos son válidos
   */
  validarFormularioCompleto(formulario: FormGroup): boolean {
    // Primero limpiamos espacios en blanco
    if (!this.validarEspaciosEnBlanco(formulario)) {
      return false;
    }

    // Luego validamos los campos requeridos dinámicamente
    if (!this.validarCamposRequeridosDinamico(formulario)) {
      return false;
    }

    return true;
  }

  /**
   * Valida de forma dinámica todos los campos requeridos del formulario
   * Marca todos los campos como tocados y muestra una alerta para el primer campo requerido vacío
   * Detecta automáticamente campos ID y genera nombres amigables para alertas
   *
   * @param formulario - Formulario reactivo a validar
   * @param camposPersonalizados - Objeto opcional para personalizar los nombres mostrados en las alertas
   * @param camposIgnorar - Array opcional de nombres de campos adicionales a ignorar en la validación de alertas
   * @param soloIncluir - Array opcional de nombres de campos a incluir en la validación de alertas (si se especifica, solo se validarán estos campos)
   * @returns boolean - Indica si todos los campos requeridos son válidos
   */
  validarCamposRequeridosDinamico(
    formulario: FormGroup,
    camposPersonalizados?: { [key: string]: string },
    camposIgnorar?: string[],
    soloIncluir?: string[]
  ): boolean {
    let esValido = true;
    let alertaMostrada = false;

    // Marcar todos los campos como tocados
    formulario.markAllAsTouched();

    // Arreglos para control de campos
    const ignorar = camposIgnorar || [];
    const incluir = soloIncluir || [];
    const hayListaIncluir = incluir.length > 0;

    // Recorrer todos los controles del formulario
    Object.keys(formulario.controls).forEach((nombreControl) => {
      // Verificar si el campo debe ser procesado según las listas de inclusión/exclusión
      const debeIgnorar = ignorar.includes(nombreControl);
      const noEstaIncluido =
        hayListaIncluir && !incluir.includes(nombreControl);

      // Obtener el control para verificar si es requerido
      const control = formulario.get(nombreControl);
      const esRequerido = control ? this.esRequerido(control) : false;

      // Determinar automáticamente si es un campo ID u otro tipo que típicamente no requiere alerta
      // Ahora pasamos true para incluirIdsRequeridos si el campo es requerido
      const esId = this.debeExcluirDeAlertas(nombreControl, esRequerido);

      if (debeIgnorar || noEstaIncluido || esId) {
        return; // Saltar este campo
      }

      // Verificar si el control es requerido y tiene valor 0
      if (control && this.esRequerido(control) && control.value === 0) {
        // Convertir el valor 0 a null
        control.setValue(null);

        // Si todavía no se ha mostrado una alerta, mostrarla ahora
        if (!alertaMostrada) {
          // Usar el nombre personalizado si está disponible, de lo contrario generar uno amigable
          const nombreMostrar =
            camposPersonalizados && camposPersonalizados[nombreControl]
              ? camposPersonalizados[nombreControl]
              : this.generarNombreAmigable(nombreControl);

          this.alertService.error('default.formulario.error.campos', {
            source: nombreMostrar,
          });

          alertaMostrada = true;
          esValido = false;
        }
      }
      // Verificar si el control es requerido y tiene valor cadena vacía
      else if (control && this.esRequerido(control) && control.value === '') {
        // Convertir la cadena vacía a null
        control.setValue(null);

        // Si todavía no se ha mostrado una alerta, mostrarla ahora
        if (!alertaMostrada) {
          // Usar el nombre personalizado si está disponible, de lo contrario generar uno amigable
          const nombreMostrar =
            camposPersonalizados && camposPersonalizados[nombreControl]
              ? camposPersonalizados[nombreControl]
              : this.generarNombreAmigable(nombreControl);

          this.alertService.error('default.formulario.error.campos', {
            source: nombreMostrar,
          });

          alertaMostrada = true;
          esValido = false;
        }
      }
      // Verificar si el control es requerido y está vacío
      else if (
        control &&
        this.esRequerido(control) &&
        (control.value === null ||
          control.value === '' ||
          (typeof control.value === 'string' && control.value.trim() === ''))
      ) {
        // Si todavía no se ha mostrado una alerta, mostrarla ahora
        if (!alertaMostrada) {
          // Usar el nombre personalizado si está disponible, de lo contrario generar uno amigable
          const nombreMostrar =
            camposPersonalizados && camposPersonalizados[nombreControl]
              ? camposPersonalizados[nombreControl]
              : this.generarNombreAmigable(nombreControl);

          this.alertService.error('default.formulario.error.campos', {
            source: nombreMostrar,
          });

          alertaMostrada = true;
          esValido = false;
        }
      }
    });

    return esValido;
  }

  /**
   * Valida si los campos tienen solo espacios en blanco, aplica trim a todos los campos y muestra alertas
   * Este método es dinámico y no requiere un listado de campos, ya que recorre todos los controles del formulario
   * Detecta automáticamente campos ID que no deberían mostrar alertas
   *
   * @param formulario - Formulario reactivo a validar
   * @param camposIgnorar - Array opcional de nombres de campos adicionales a ignorar en la validación de alertas
   * @returns boolean - Indica si la validación fue exitosa (true) o si se encontró algún error (false)
   */
  validarEspaciosEnBlanco(
    formulario: FormGroup,
    camposIgnorar?: string[]
  ): boolean {
    let esValido = true;
    let alertaMostrada = false;

    // Arreglo para control de campos a ignorar
    const ignorar = camposIgnorar || [];

    // Recorrer todos los controles del formulario
    Object.keys(formulario.controls).forEach((nombreControl) => {
      const control = formulario.get(nombreControl);

      // Verificar si el control es requerido para determinar si debemos incluir campos ID
      const esRequerido = control ? this.esRequerido(control) : false;

      // Verificar si el control es requerido y tiene valor 0
      if (control && this.esRequerido(control) && control.value === 0) {
        // Convertir el valor 0 a null
        control.setValue(null);

        // Verificar si el campo debe ser ignorado o es un campo ID
        const debeIgnorar = ignorar.includes(nombreControl);
        const esId = this.debeExcluirDeAlertas(nombreControl, esRequerido);

        if (!debeIgnorar && !esId && !alertaMostrada) {
          // Generar nombre amigable para la alerta
          const nombreMostrar = this.generarNombreAmigable(nombreControl);

          this.alertService.error('default.formulario.error.campos', {
            source: nombreMostrar,
          });

          control.markAsTouched();
          alertaMostrada = true;
          esValido = false;
        }
      }
      // Verificar si el control es requerido y tiene valor cadena vacía explícita
      else if (control && this.esRequerido(control) && control.value === '') {
        // Convertir la cadena vacía a null
        control.setValue(null);

        // Verificar si el campo debe ser ignorado o es un campo ID
        const debeIgnorar = ignorar.includes(nombreControl);
        const esId = this.debeExcluirDeAlertas(nombreControl, esRequerido);

        if (!debeIgnorar && !esId && !alertaMostrada) {
          // Generar nombre amigable para la alerta
          const nombreMostrar = this.generarNombreAmigable(nombreControl);

          this.alertService.error('default.formulario.error.campos', {
            source: nombreMostrar,
          });

          control.markAsTouched();
          alertaMostrada = true;
          esValido = false;
        }
      }
      // Solo procesar controles que existen y tienen valor tipo string
      else if (control && typeof control.value === 'string') {
        const valorOriginal = control.value;
        const valorTrimmed = valorOriginal.trim();

        // Aplicar trim al principio y final para todos los campos (requeridos y no requeridos)
        if (valorOriginal !== valorTrimmed) {
          control.setValue(valorTrimmed);
        }

        // Verificar si el campo debe ser ignorado o es un campo ID
        const debeIgnorar = ignorar.includes(nombreControl);
        const esId = this.debeExcluirDeAlertas(nombreControl, esRequerido);

        // Si el campo es requerido y después del trim queda vacío
        if (
          this.esRequerido(control) &&
          valorTrimmed === '' &&
          !debeIgnorar &&
          !esId
        ) {
          // Si tenía contenido (solo espacios) antes del trim
          if (valorOriginal !== '' && !alertaMostrada) {
            // Generar nombre amigable para la alerta
            const nombreMostrar = this.generarNombreAmigable(nombreControl);

            this.alertService.error('default.formulario.error.campos', {
              source: nombreMostrar,
            });
            control.markAsTouched();
            alertaMostrada = true;
            esValido = false;
          }
        }
      }
    });

    return esValido;
  }
}
