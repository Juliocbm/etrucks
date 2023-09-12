import { LiquidacionService } from './../../../Services/liquidacion.service';
import { Component } from '@angular/core';
import { Liquidacion, DetalleLiquidacion } from '../../../../models/Despacho/Liquidacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-liquidacion',
  templateUrl: './ver-liquidacion.component.html',
  styleUrls: ['./ver-liquidacion.component.css']
})
export class VerLiquidacionComponent {
  liquidacion: Liquidacion;
  detalleLiquidacion: DetalleLiquidacion[]; // Cambiamos a un array de detalles

  constructor(private LiquidacionService: LiquidacionService, private router: Router) {
    this.liquidacion = new Liquidacion();
    this.detalleLiquidacion = []; // Inicializamos el array de detalles
  }

  ngOnInit() {
    this.LiquidacionService.liquidacionActual.subscribe(unidad => {
      this.liquidacion = unidad;
      // Asignamos los detalles a la variable correspondiente
      this.detalleLiquidacion = this.liquidacion.detalle_liquidacion; // Ahora asignamos el array completo
    });
  }

  goToEditarLiquidacion(liquidacion: Liquidacion) {
    this.LiquidacionService.changeLiquidacion(liquidacion);
    this.router.navigate(['liquidaciones/editarLiquidacion']);
  }
}
