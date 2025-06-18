import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { GeneralParametersService } from '../../../../shared-module/services/general-parameters.service';
import { cpMunicipio } from 'src/app/models/catalogo-sat/cpMunicipio';
import { ApiCpMunicipio } from 'src/app/DataAccess/api-catalogoSat-cpMunicipio.service';
import { CpMunicipioService } from 'src/app/catalogo-sat/Services/cpMunicipio.service';

@Component({
    selector: 'app-catalogo-cpMunicipioCrear',
    templateUrl: './cpMunicipio-crear.component.html',
    styleUrls: ['./cpMunicipio-crear.component.css']
})
export class CpMunicipioCrear{
cp: cpMunicipio;

showAlert = false;
alertMessage = '';
alertType = '';

    constructor(private cpService : CpMunicipioService, private ApiCp: ApiCpMunicipio, private router :  Router)
    {
        this.cp = new cpMunicipio;
    }
    ngOnInit() {
        this.resetForm();
      }

      resetForm(CpForm?: NgForm) {
        if (CpForm != null) {
            CpForm.resetForm();
        }
        this.cp = new cpMunicipio();
      }
    
      onSubmit(CpForm: NgForm) {
        this.ApiCp.enviarDatos(this.cp).subscribe(
          data => {
            console.log(data);
            this.resetForm(CpForm);
            this.triggerAlert('CP/Municipio creado exitosamente!', 'success');
          },
          error => {
            console.error(error);
            this.triggerAlert('Operación fallida!', 'danger');
          }
        );
      }
    
      // Esta función se llama para mostrar la alerta
      triggerAlert(message: string, type: string) {
        this.alertMessage = message;
        this.showAlert = true;
        this.alertType = type;
    
        // La alerta se ocultará después de 5 segundos
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
}