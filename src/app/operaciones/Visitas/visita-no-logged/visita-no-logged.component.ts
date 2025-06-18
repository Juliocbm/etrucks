import { filter } from 'rxjs/operators';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { AuthService } from 'src/app/security/services/auth.service';
import { ApiSecurityService } from 'src/app/DataAccess/api-security.service';

@Component({
  selector: 'app-visita-no-logged',
  templateUrl: './visita-no-logged.component.html',
  styleUrls: ['./visita-no-logged.component.css']
})
export class VisitaNoLoggedComponent {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    correoCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    auth: ['', Validators.required],
  });
  isLinear = true;
  idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');

  constructor(
    private apiHandler: ApiServiceHandler,
    private apiOperacionesService: ApiOperacionesService,
    private apiAuthentificacion: AuthService,
    private apiSecurityService: ApiSecurityService
  ) {
  }


  ngOnInit() {
  }

  // Función para enviar los datos de la visita
  enviarVisita() {
    let empresa = 1;
    let sucursal = 0;
    const correo = this.firstFormGroup.get('correoCtrl')?.value?.toString() || '';

    console.log('Enviando visita:', empresa, sucursal, correo);


    this.apiOperacionesService.postRegistrarOTP(empresa, sucursal, correo).subscribe((res) => {
      console.log('Respuesta del servidor:', res);
    },
    (error) => {
      console.error('Error al enviar la visita:', error);
    });
  }

  // Función para validar Visita
  validarVisita() {
    let empresa = 1;
    let sucursal = 0;
    const correo = this.firstFormGroup.get('correoCtrl')?.value?.toString() || '';
    const otp = this.secondFormGroup.get('auth')?.value?.toString() || '';
    // sucursal = 1;

    this.apiOperacionesService.postValidarOTP(empresa, sucursal, correo,otp).subscribe((res) => {
      console.log('Respuesta del servidor:', res);
      if (res) {
        const credentials = {
          usuario: 'VISITA',
          contrasena: 'oT^cPQL20',
          idSistema: 4
        };
        this.apiSecurityService.login(credentials).subscribe((res) => {
          console.log('Respuesta del servidor:', res);
          // Reiniciar la pagina(F5)
          window.location.reload();
        },
        (error) => {
          console.error('Error al enviar la visita:', error);
        });
      }

    },
    (error) => {
      console.error('Error al enviar la visita:', error);
    });
  }

}
