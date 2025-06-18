import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { Ubicacion } from '../../../../../../models/ti/cfdi/ubicacion';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrls: ['./ubicaciones.component.css']
})
export class UbicacionesComponent implements OnInit {
  ubicacionesForm!: FormGroup;

  private destroy$ = new Subject<void>(); // Para limpiar suscripciones

  constructor(private fb: FormBuilder, private cartaPorteService: CartaPorteService) {
    this.ubicacionesForm = this.fb.group({
      id: new FormControl(''),
      noGuia: new FormControl(''),
      compania: new FormControl(''),
      fechaInsert: [''],

      tipoUbicacionOrigen: ['', Validators.required],
      nombreRemitente: ['', Validators.required],
      remitenteRfc: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(/^(?:[A-ZÑ&]{3,4})\d{6}(?:[A-Z0-9]{3})$/i)]),
      remitenteResidenciaFiscal: [''],
      remitenteId: ['', Validators.required],
      remitenteCp: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]], // Solo números y 5 dígitos
      remitenteEstado: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2,3}$/)]],
      remitentePais: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2,3}$/)]],
      remitenteMunicipio: [''],
      remitenteLocalidad: [''],
      remitenteNumRegIdTrib: [''],
      fechaDespachoProgramado: [''],
      tipoUbicacionDestino: ['', Validators.required],
      nombreDestinatario: ['', Validators.required],
      destinatarioRfc: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(13), Validators.pattern(/^(?:[A-ZÑ&]{3,4})\d{6}(?:[A-Z0-9]{3})$/i)]),
      destinatarioResidenciaFiscal: [''],
      destinatarioId: ['', Validators.required],
      destinatarioCp: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]], // Solo números y 5 dígitos
      destinatarioEstado: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2,3}$/)]],
      destinatarioPais: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{2,3}$/)]],
      destinatarioMunicipio: [''],
      destinatarioLocalidad: [''],
      destinatarioNumRegIdTrib: [''],
      fechaArriboProgramado: [''],
      distanciaRecorrida: ['', Validators.required]
    });
  }


  datosUbicaciones: number = 0;

  ngOnInit(): void {
    this.cartaPorteService.cartaPorte$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartaPorte => {
        if (cartaPorte.cartaPorteUbicaciones && cartaPorte.cartaPorteUbicaciones.length > 0) {

          this.datosUbicaciones = cartaPorte.cartaPorteUbicaciones.length

          const ubicacion = cartaPorte.cartaPorteUbicaciones[0]; // Solo tomamos la primera ubicación
          this.ubicacionesForm.patchValue(ubicacion, { emitEvent: false });

          this.cartaPorteService.actualizarValidacion2('ubicaciones', this.ubicacionesForm);
        } else {
          const erroresLista = ["No se encontraro ubicación de origen y destino en el ccp(dummy), corregirlo y asociarlo a una nueva guia."];

          this.cartaPorteService.actualizarValidacion2('ubicaciones', this.ubicacionesForm);

          this.cartaPorteService.actualizarErrores('ubicaciones', erroresLista);
          return;
        }
      });

    this.ubicacionesForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.validarFormulario());
  }

  validarFormulario() {
    this.cartaPorteService.actualizarValidacion2('ubicaciones', this.ubicacionesForm);

    this.cartaPorteService.actualizarCartaPorte({
      cartaPorteUbicaciones: [this.ubicacionesForm.value] // 🔥 Se envuelve en un array
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
