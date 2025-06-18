import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { GeneralParametersService } from '../../../../shared-module/services/general-parameters.service';
import { cpMunicipio } from 'src/app/models/catalogo-sat/cpMunicipio';
import { ApiCpMunicipio } from 'src/app/DataAccess/api-catalogoSat-cpMunicipio.service';
import { CpMunicipioService } from 'src/app/catalogo-sat/Services/cpMunicipio.service';

@Component({
    selector: 'app-catalogo-cpMunicipioEditar',
    templateUrl: './cpMunicipio-editar.component.html',
    styleUrls: ['./cpMunicipio-editar.component.css']
})
export class CpMunicipioEditar {
cp: cpMunicipio;
cpForm: FormGroup = new FormGroup({});
showAlert = false;
alertMessage = '';
alertType = '';

    constructor(private fb: FormBuilder, private cpService : CpMunicipioService, private ApiCp: ApiCpMunicipio)
    {
        this.cp = new cpMunicipio;
    }
    ngOnInit() {
      this.cpService.CpMunicipioActual.subscribe(cp => this.cp = cp);
  
      this.cpForm = this.fb.group({
        id: [this.cp.id],
        cp: [this.cp.cp],
        estado: [this.cp.estado],
        municipio: [this.cp.municipio],
        localidad: [this.cp.localidad]
      });
  
    }
  
    onSubmit() {
  
      let updEstatus: cpMunicipio = this.cpForm.value;
  
      
  
      console.log(updEstatus);
      this.ApiCp.actualizarDatos(updEstatus).subscribe(data => {
        console.log(this.cpForm.value);
        this.triggerAlert("Estatus actualizado exitosamente!", "success");
      }, error => {
        console.log(error.error.errors);
        this.triggerAlert("Fallo al actualizar estatus!", "danger");
      });
    }
  
     // Esta función se llama para mostrar la alerta
     triggerAlert(message: string, type : string) {
      this.alertMessage = message;
      this.showAlert = true;
      this.alertType = type;
  
      // La alerta se ocultará después de 5 segundos
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    }
}