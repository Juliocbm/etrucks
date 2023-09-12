import { Component } from '@angular/core';
import { Liquidacion, Operadores, DetalleLiquidacion } from './../../../../models/Despacho/Liquidacion';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiLiquidacionService } from '../../../../DataAccess/api-servicio-liquidacion.service';
import { LiquidacionService } from '../../../Services/liquidacion.service';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-liquidacion',
  templateUrl: './editar-liquidacion.component.html',
  styleUrls: ['./editar-liquidacion.component.css']
})
export class EditarLiquidacionComponent {
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

}
