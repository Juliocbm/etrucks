import { Component } from '@angular/core';
import { CatalogoGeneralService } from '../../../services/catalogo-general.service'
import { ElementoDetalle } from '../../../../models/SistemaGeneral/ElementoDetalle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-elemento-det-ver',
  templateUrl: './elemento-det-ver.component.html',
  styleUrls: ['./elemento-det-ver.component.css']
})
export class ElementoDetVerComponent {
  elementoDetalle: ElementoDetalle; 

  constructor(
    private serviceCatGeneral: CatalogoGeneralService, // Cambiado de tramoService: TramoService
    private router: Router
  ){

    this.elementoDetalle = new ElementoDetalle();
  }

  ngOnInit(){
    console.log("Elemento");
    this.serviceCatGeneral.regGeneralSourceActual.subscribe(registroGeneral => this.elementoDetalle = registroGeneral);

    console.log(this.elementoDetalle);
    
  }

  goToEditarRegistroGeneral() { 
    this.serviceCatGeneral.changeRegistroGeneral(this.elementoDetalle);
    this.router.navigate(['/elemento-detalle/editar']); 
  }
}
