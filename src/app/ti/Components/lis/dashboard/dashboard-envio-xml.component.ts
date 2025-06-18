import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { ApiCfdiService } from 'src/app/DataAccess/api-cfdi.service';
import { CartaPorte } from 'src/app/models/ti/cfdi/cartaPorte';
import { NotificacionService } from '../../../../shared-module/services/notificacion.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorTimbrado } from '../../../../models/ti/cfdi/error';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiInterfacesLisService } from 'src/app/DataAccess/api-interfaces-lis';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-envio-xml.component.html',
  styleUrls: ['./dashboard-envio-xml.component.css'],
})
export class DashboardComponentLis {
  displayedColumns: string[] = [
    'num_guia',
    'estatusTimbrado',
    'mensajeTimbrado',
    'errores',
    'acciones',
  ];

  tipoOperacionOptions = [
    { key: 'IMPORTACION', value: 1 },
    { key: 'EXPORTACION', value: 2 },
    { key: 'NACIONAL', value: 3 },
    { key: 'VACIO IMPO', value: 4 },
    { key: 'VACIO EXPO', value: 5 },
    { key: 'VACIO NACIONAL', value: 6 },
    { key: 'LLEVAR VACIO', value: 7 },
    { key: 'LLEVAR CARGADO', value: 8 },
    { key: 'RECOGER VACIO', value: 9 },
    { key: 'RECOGER CARGADO', value: 10 },
    { key: 'MOVER VACIO', value: 11 },
    { key: 'MOVER CARGADO', value: 12 },
    { key: 'TRACTOR SOLO', value: 13 },
    { key: 'RENTADO', value: 14 },
    { key: 'REUBICAR UNIDAD', value: 15 },
    { key: 'CIRCUITO NACIONAL', value: 16 }
  ];

  tipoServicioOptions = [
    { key: 'Importación', value: 'I' },
    { key: 'Exportación', value: 'E' },
    { key: 'Doméstico', value: 'D' }
  ];

  sucursalOptions = [
    { key: 'M1', value: 1 },
    { key: 'L1', value: 3 },
    { key: 'ST', value: 2 },
    { key: 'QR', value: 5 },
    { key: 'XA', value: 1 },
    { key: 'HGAP', value: 1 },
    { key: 'HGNL', value: 3 },
    { key: 'HGST', value: 2 },
    { key: 'HGQR', value: 5 },
    { key: 'HGPU', value: 15 },
    { key: 'HGXA', value: 1 },
    { key: 'CHCH', value: 9 },
    { key: 'F', value: 9 },
    { key: 'LT', value: 10 },
    { key: 'LTAP', value: 10 },
    { key: 'LTXA', value: 10 },
    { key: 'NL', value: 13 },
    { key: 'RLAP', value: 11 },
    { key: 'RLCF', value: 11 },
    { key: 'RLNL', value: 13 },
    { key: 'RLPU', value: 12 },
    { key: 'RLXA', value: 11 }
  ];


  consultaForm!: FormGroup;
  cartaPorteForm!: FormGroup;
  ubicacionesForm!: FormGroup;
  cartaPorte!: CartaPorte;

  close(): void {
    this.dialogRef.close();
  }

  @Output() trasladoCompletado = new EventEmitter<string>();
  erroresAmigables: any[] = [];

  constructor(
    private apiInterfacesLis: ApiInterfacesLisService,
    public dialogRef: MatDialogRef<DashboardComponentLis>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiCfdi: ApiCfdiService,
    private formBuilder: FormBuilder,
    private notificacionService: NotificacionService,
    public dialog: MatDialog
  ) {
    console.log('data', data);
    this.cartaPorte = data;

    this.erroresAmigables = this.getErroresAmigables(this.cartaPorte?.erroresTimbradoGenerals || []);
    console.log(this.erroresAmigables);

  }

  private getErroresAmigables(errores: any[]): any[] {
    const identificadoresAmigables: { [key: string]: string } = {
      'LineaRem1': 'Linea transportista',
      'Remolque1': 'Remolque',
      'TipoOperacion': 'Tipo de operación',
      'Ubicacion.IdDestinatario': 'Cliente destinatario',
      'Ubicacion.IdRemitente': 'Cliente remitente',
      'Operador': 'Operador',
      'Concepto.IdConcepto': 'Concepto facturable',
      'Object reference not set to an instance of an object.': '(Object reference not set to an instance of an object.) - Alguna referencia no existe en el sistema ZAM.',
    };

    return errores.map(errorObj => {
      let errorTexto = errorObj.error;

      for (const identificador in identificadoresAmigables) {
        const nombreAmigable = identificadoresAmigables[identificador];

        // Reemplazo solo si existe el identificador en el texto
        const regex = new RegExp(identificador.replace('.', '\\.'), 'g'); // escapamos puntos
        errorTexto = errorTexto.replace(regex, nombreAmigable);
      }

      return {
        ...errorObj,
        error: errorTexto
      };
    });
  }


  guardarCartaPorte() {
    this.isLoading = true;

    if (this.cartaPorteForm.valid) {
      const cartaPorteFormValues = this.cartaPorteForm.value;

      this.cartaPorte = {
        ...this.cartaPorte,
        ...cartaPorteFormValues,
      };


      this.cartaPorte.cartaPorteDetalles = this.cartaPorte.cartaPorteDetalles.map((concepto, idx) => {
        return {
          ...concepto,
          idConceptolis: cartaPorteFormValues.detalles[idx].idConceptolis
        };
      });



      // Crear una copia de cartaPorte y fusionarla con los valores del formulario
      let cartaPorteToSend = {
        ...this.cartaPorte,
        ...cartaPorteFormValues,
      };


      // Eliminar la propiedades innecesarias
      delete cartaPorteToSend.archivoCFDi;
      delete cartaPorteToSend.erroresTimbradoGenerals;
      /*    delete cartaPorteToSend.cartaPorteDetalles; */
      delete cartaPorteToSend.cartaPorteMercancia;
      delete cartaPorteToSend.cartaPorteUbicaciones;

      console.log("carta porte enviada", cartaPorteToSend);

      this.apiInterfacesLis.PutDatosLis(cartaPorteToSend).subscribe(
        (response) => {
          this.notificacionService.showNotification("Datos guardados exitosamente!", 'success');
          this.isLoading = false;
        },
        (error) => {
          this.notificacionService.showNotification("Fallo al guardar!", 'error');
          this.isLoading = false;
        }
      );
    } else {
      this.notificacionService.showNotification("Favor de llenar datos requeridos en carta porte!", 'error');
    }
    this.isLoading = false;
  }

  estatusTimbrado?: number = 0;
  isLoading: boolean = false;

  trasladarRemision() {
    this.isLoading = true;

    this.cartaPorte!.estatusTimbrado = 1;
    this.cartaPorteForm.patchValue(this.cartaPorte!);

    this.apiInterfacesLis.postTrasladoFacturaAsync(this.cartaPorte.numGuia).subscribe(
      (response) => {
        this.isLoading = false;
        if (response.isSuccess) {
          this.notificacionService.showNotification("Traslado exitoso!", 'success');
          this.cartaPorte!.estatusTrasladoLis = 3;
          this.cartaPorteForm.patchValue(this.cartaPorte!);
          console.log("cambio estatus a 3");


          const erroresNuevos: ErrorTimbrado[] = response.errores.map((error: string) => new ErrorTimbrado(
            0, // id
            0, // noGuia
            '', // numGuia
            '', // compania
            error, // error
            0, // idOperadorLis
            '', // idUnidadLis
            '', // idRemolqueLis
            new Date() // fechaInsert
          ));

          this.cartaPorte.erroresTimbradoGenerals = erroresNuevos;

          this.trasladoCompletado.emit(this.cartaPorte.numGuia); // Emitir el evento con el numGuia
          /*   this.dialogRef.close(); // Cerrar el modal */

        } else {
          console.log('response', response);
          this.notificacionService.showNotification(response.mensaje, 'error');
          this.cartaPorte!.estatusTimbrado = 2;
          

          if (response.errores.length > 0) {
            const erroresNuevos: ErrorTimbrado[] = response.errores.map((error: string) => new ErrorTimbrado(
              0, // id
              0, // noGuia
              '', // numGuia
              '', // compania
              error, // error
              0, // idOperadorLis
              '', // idUnidadLis
              '', // idRemolqueLis
              new Date() // fechaInsert
            ));

            this.cartaPorte.erroresTimbradoGenerals = erroresNuevos;
          }
          
          this.cartaPorteForm.patchValue(this.cartaPorte!);
          
          this.erroresAmigables = this.getErroresAmigables(this.cartaPorte?.erroresTimbradoGenerals || []);
        }

      },
      (error) => {
        this.isLoading = false;
        this.notificacionService.showNotification("Fallo en el servicio!", 'error');
        this.cartaPorte!.estatusTimbrado = 2;
        this.cartaPorteForm.patchValue(this.cartaPorte!);
      }
    );
  }

  markFormAsTouched() {
    this.cartaPorteForm.markAllAsTouched();
  }

  ngOnInit() {
    this.cartaPorteForm = new FormGroup({
      id: new FormControl(''),
      noGuia: new FormControl(''),
      numGuia: new FormControl(''),
      statusGuia: new FormControl(''),
      compania: new FormControl(''),
      observacionesPedido: new FormControl('', [Validators.required]),
      idClienteLis: new FormControl('', [Validators.required]),
      idUnidadLis: new FormControl('', [Validators.required]),
      idRemolqueLis: new FormControl('', [Validators.required]),
      idRemolque2Lis: new FormControl(''),
      idPlazaOrLis: new FormControl('', [Validators.required]),
      idPlazaDeLis: new FormControl('', [Validators.required]),
      idRutaLis: new FormControl('', [Validators.required]),
      idOperadorLis: new FormControl('', [Validators.required]),
      idLineaRem1Lis: new FormControl('', [Validators.required]),
      idLineaRem2Lis: new FormControl(''),
      idSucursalLis: new FormControl('', [Validators.required]),
      idClienteRemitenteLis: new FormControl('', [Validators.required]),
      idClienteDestinatarioLis: new FormControl('', [Validators.required]),

      idTipoServicioLis: new FormControl('', [Validators.required]),
      idTipoOperacionLis: new FormControl('', [Validators.required]),
      estatusTrasladoLis: new FormControl(0),

      detalles: this.formBuilder.array([])
    });

    this.markFormAsTouched();
    this.cartaPorte.observacionesPedido = this.cartaPorte.observacionesPedido?.trim() === '' ? 'Sin observaciones' : this.cartaPorte.observacionesPedido?.trim();

    this.initDetallesFormArray();
    // Dentro de ngOnInit, tras initDetallesFormArray()
this.detalles.controls.forEach(ctrl => {
  // Hacemos 'tocado' y 'modificado' para que el ngClass/ng-invalid.ng-touched se active
  ctrl.get('idConceptolis')?.markAsTouched();
  ctrl.get('idConceptolis')?.markAsDirty();
});


    console.log(' this.cartaPorte.observacionesPedido', this.cartaPorte.observacionesPedido);
    this.cartaPorteForm.patchValue(this.cartaPorte);
    this.isLoading = false;
  }

  // Getter para acceder más fácilmente al FormArray desde la plantilla y el código
  get detalles(): FormArray {
    return this.cartaPorteForm.get('detalles') as FormArray;
  }

  private initDetallesFormArray() {
    // Si no hay detalles, nada que inicializar
    if (!this.cartaPorte.cartaPorteDetalles || this.cartaPorte.cartaPorteDetalles.length === 0) {
      return;
    }

    // Por cada concepto en el modelo, creamos un FormGroup con al menos el control idConceptoLis
    this.cartaPorte.cartaPorteDetalles.forEach(concepto => {
      const fg = this.formBuilder.group({
        // Mapeamos idConceptolis (puedes agregar más campos si necesitas)
        idConceptolis: [concepto.idConceptolis ?? '', Validators.required],
        // Si quieres hacer editable la descripción u otros campos, inclúyelos como controles:
        // descripcion: [concepto.descripcion ?? '', Validators.required],
        // …otros controles que quieras exponer en el formulario…
      });
      this.detalles.push(fg);
    });
  }
}
