import { Component } from '@angular/core';

import { Liquidacion, Operadores, DetalleLiquidacion } from './../../../../models/Despacho/Liquidacion';
import { Router } from '@angular/router';
import { ApiLiquidacionService } from '../../../../DataAccess/api-servicio-liquidacion-jcbm.service';
import { LiquidacionService } from '../../../Services/liquidacion.service';

@Component({
  selector: 'app-liquidacion-view',
  templateUrl: './liquidacion-view.component.html',
  styleUrls: ['./liquidacion-view.component.css']
})
export class LiquidacionViewComponent {
  datos: Liquidacion[] = [];
  datosFiltrados: Liquidacion[] = [];

  showAlert = false;
  alertMessage = '';
  alertType = '';
  
  constructor(
    private apiService: ApiLiquidacionService,
    private router: Router,
    private LiquidacionService: LiquidacionService
  ) { }


  ngOnInit(): void {
    this.apiService.obtenerDatos().subscribe(
      response => {
        this.datos = response;
        this.datosFiltrados = this.datos;
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
      }
    );
  }

  filtrarDatos(term: string) {
    console.log(term);
    if (!term) {
      this.datosFiltrados = this.datos;
    } else {
      term = term.toLowerCase();
      this.datosFiltrados = this.datos.filter(liq => {
        return liq.no_liquidacion?.toPrecision().includes(term)
          || liq.operador?.toLocaleString().toLowerCase().includes(term)
          || liq.liquidado_por?.toLocaleString().toLowerCase().includes(term)
          || liq.monto?.toPrecision().includes(term);
      });
    }
  }

  filtrarActivos(clave: boolean) {
    if (!clave) {
      this.datosFiltrados = this.datos;
    } else {
      this.datosFiltrados = this.datos.filter(unidad => {
        //return unidad.estado === 'A' || unidad.estado === null;
      });
    }
  }

  filtrarPorFecha(event: { startDate: Date, endDate: Date }) {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    // Establecer la hora, minutos, segundos y milisegundos en 0
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999); // Establecerlo al final del día

    this.datosFiltrados = this.datos.filter(dato => {
      const fechaCreacion = new Date(dato.fecha_liquidacion);
      fechaCreacion.setHours(0, 0, 0, 0); // Ignorar la parte de la hora
      return fechaCreacion >= startDate && fechaCreacion <= endDate;
    });
  }

  onDateRangeCleared() {
    this.datosFiltrados = this.datos;
  }

  goToVerLiquidacion(liquidacion: Liquidacion) {
    this.LiquidacionService.changeLiquidacion(liquidacion);
    this.router.navigate(['liquidaciones/verLiquidacion']);
  }

  goToEditarLiquidacion(liquidacion: Liquidacion) {
    this.LiquidacionService.changeLiquidacion(liquidacion);
    this.router.navigate(['liquidaciones/editarLiquidacion']);
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
