import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiOperadoresApiService } from 'src/app/DataAccess/OperadorApp/api-operadores-api.service';
import { ServCliService } from '../../serv-cli.service';

@Component({
  selector: 'app-editar-bitacora',
  templateUrl: './editar-bitacora.component.html',
  styleUrls: ['./editar-bitacora.component.css']
})
export class EditarBitacoraComponent  {
  public flotas: any;

  /* Devuelve en el output la flota seleccionada */
  @Output() flotaSeleccionada: any;

  constructor(
    private apiService: ApiOperadoresApiService,
    private router: Router,
    private service: ServCliService
  )
   {
    let idCompania =  parseInt(localStorage.getItem('CompaniaSelect') || '0');
    // console.log('idCompania: ', idCompania);

    this.apiService.obtenerCatalogosGeneralFlotas(idCompania).subscribe(
      (data) => {
        this.flotas = data;
        // console.log('Flotas: ', this.flotas);
        if(this.flotas.length === 1)
          {
            console.log('1 Flota: ', this.flotas);
            this.flotaSeleccionada = this.flotas[0];
          }
      }
    );
  }
}
