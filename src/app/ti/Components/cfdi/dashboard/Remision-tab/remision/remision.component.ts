import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-remision',
  templateUrl: './remision.component.html',
  styleUrls: ['./remision.component.css']
})
export class RemisionComponent implements OnInit {
  remisionForm!: FormGroup;

  private destroy$ = new Subject<void>(); // Para limpiar suscripciones
  
  constructor(private fb: FormBuilder, private cartaPorteService: CartaPorteService) {
    this.remisionForm = this.fb.group({
   /*    id: new FormControl(''), */
      noGuia: new FormControl(''),
      numGuia: new FormControl(''),
      statusGuia: new FormControl(''),
      moneda: new FormControl('', [Validators.required]),
      formaPago: new FormControl('', [Validators.required]),
      metodoPago: new FormControl('', [Validators.required]),
      totalDistanciaRec: new FormControl(''),
      idUnidad: new FormControl(''),
      modeloUnidad: new FormControl(''),
      placaUnidad: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{5,7}$/)]),
      configVehicular: new FormControl(''),
      aseguradora: new FormControl('', [Validators.required]),
      pesoBrutoVehicular: new FormControl(''),
      operador: new FormControl(''),
      rfcOperador: new FormControl('', [Validators.required]),
      licenciaOperador: new FormControl(''),
      idRemolque: new FormControl(''),
      placaRemolque1: new FormControl('', [ Validators.pattern(/^[a-zA-Z0-9]{5,7}$/)]),
      subtipoRemolque1: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.cartaPorteService.cartaPorte$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartaPorte => {
        this.remisionForm.patchValue({ ...cartaPorte }, { emitEvent: false }); // 🔥 Evita disparar valueChanges
        this.cartaPorteService.actualizarValidacion2('remision', this.remisionForm);
      });

    // 🔥 Solo actualizar si los valores realmente cambian
    this.remisionForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.validarFormulario());
  }

  validarFormulario() {
    this.cartaPorteService.actualizarValidacion2('remision', this.remisionForm);
    this.cartaPorteService.actualizarCartaPorte(this.remisionForm.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
