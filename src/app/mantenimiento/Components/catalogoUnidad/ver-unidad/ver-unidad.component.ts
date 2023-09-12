import { Component } from '@angular/core';
import { UnidadService } from '../../../Services/unidad.service'
import { Unidad } from './../../../../models/Mantenimiento/unidad';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-unidad',
  templateUrl: './ver-unidad.component.html',
  styleUrls: ['./ver-unidad.component.css']
})
export class VerUnidadComponent {
  unidad: Unidad;

  constructor(private unidadService: UnidadService, private router: Router) {
    this.unidad = new Unidad();
  }

  ngOnInit() {
    console.log(this.unidad);
    this.unidadService.unidadActual.subscribe(unidad => this.unidad = unidad);
  }

  goToEditarUnidad() {
    this.unidadService.changeUnidad(this.unidad);
    this.router.navigate(['unidades/editarUnidad']);
  }
}
