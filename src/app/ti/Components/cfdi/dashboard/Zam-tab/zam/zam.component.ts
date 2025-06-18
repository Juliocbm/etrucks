import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartaPorteService } from '../../../../../Services/CartaPorteService';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-zam',
  templateUrl: './zam.component.html',
  styleUrls: ['./zam.component.css']
})
export class ZamComponent implements OnInit {
  zamForm!: FormGroup;

  private destroy$ = new Subject<void>(); // Para limpiar suscripciones
  
  constructor(private fb: FormBuilder, private cartaPorteService: CartaPorteService) {
    this.zamForm = this.fb.group({
      idClienteLis: new FormControl(''),
      idUnidadLis: new FormControl(''),
      idRemolqueLis: new FormControl(''),
      idRemolque2Lis: new FormControl(''),
      idPlazaOrLis: new FormControl(''),
      idPlazaDeLis: new FormControl(''),
      idRutaLis: new FormControl(''),
      idOperadorLis: new FormControl(''),
      idLineaRem1Lis: new FormControl(''),
      idLineaRem2Lis: new FormControl(''),
      idSucursalLis: new FormControl(''),
      idClienteRemitenteLis: new FormControl(''),
      idClienteDestinatarioLis: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.cartaPorteService.cartaPorte$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartaPorte => {
        this.zamForm.patchValue({ ...cartaPorte }, { emitEvent: false }); // 🔥 Evita disparar valueChanges
        this.cartaPorteService.actualizarValidacion2('zam', this.zamForm);
      });

    // 🔥 Solo actualizar si los valores realmente cambian
    this.zamForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.validarFormulario());
  }

  validarFormulario() {
    this.cartaPorteService.actualizarValidacion2('zam', this.zamForm);
    this.cartaPorteService.actualizarCartaPorte(this.zamForm.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
