import { Component, Input, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { map, Observable, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-operador-pedido-table',
  templateUrl: './operador-pedido-table.component.html',
  styleUrls: ['./operador-pedido-table.component.css']
})
export class OperadorPedidoTableComponent implements AfterViewInit, OnDestroy {
  @Input() isOperador: boolean = false;
  @Input() showSucursal: boolean = false;
  @Input() data: any[] = [];   // Datos para operadores o pedidos
  @Input() isLoading: boolean = false;  // Estado de carga

  scrollInterval: any;  // Variable para almacenar el intervalo de scroll
  // tiempoTranscurrido$: Observable<string> | undefined;
  tiempoTranscurridoOperador$: Observable<string> | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    // console.log('isOperador:', this.isOperador);
    this.startAutoScroll();
  }

  ngOnChanges() {
    // Cada vez que cambien los datos, reiniciar el autoscroll
    this.startAutoScroll();
    this.initializeTimers(); // Inicializar los contadores dinámicos
  }

  ngOnDestroy() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  // Inicializa el contador para cada elemento en data
  initializeTimers() {
    this.data.forEach(item => {
      item.tiempoTranscurrido$ = this.getTimeRemaining(item.fechaPedido);
      item.tiempoTranscurridoOperador$ = this.getTimeRemaining(item.fechaDisponible);
    });
  }

  startAutoScroll() {
    const tableWrapper = this.el.nativeElement.querySelector('.table-wrapper');

    // Primero, limpiar el intervalo si ya existe uno
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }

    // Verificar si hay suficientes datos para hacer scroll
    if (tableWrapper && this.data.length > 10) {
      this.scrollInterval = setInterval(() => {
        // Si el scroll llega al final, lo reiniciamos al inicio
        if (tableWrapper.scrollTop + tableWrapper.clientHeight >= tableWrapper.scrollHeight) {
          tableWrapper.scrollTop = 0;
        } else {
          tableWrapper.scrollTop += 1;  // Mover el scroll ligeramente hacia abajo
        }
      }, 50);  // Intervalo de tiempo para controlar la velocidad del scroll
    }
  }

  // Se puede usar esta propiedad para controlar el tamaño dinámico de la tabla
  get maxTableHeight(): string {
    console.log('isOperador:', this.isOperador);
    // Si solo una tabla está visible, ocupa toda la pantalla
    if (!this.isOperador || (this.isOperador && !this.showSucursal)) {
      console.log('100vh');
      return '100vh'; // Altura completa de la pantalla
    }
    return '400px'; // Si hay varias tablas, un tamaño fijo
  }



  // TIMER
  // Calcula el tiempo transcurrido dinámico desde la fecha del pedido
  getTimeRemaining(fechaPedido: string): Observable<string> {
    const pedidoTimestamp = new Date(fechaPedido).getTime(); // Convierte la fecha a timestamp
    const ahoraTimestamp = Date.now(); // Timestamp actual
    const diferenciaSegundos = Math.floor((ahoraTimestamp - pedidoTimestamp) / 1000); // Diferencia inicial en segundos

    return timer(0, 1000).pipe(
      map(n => this.formatTime(diferenciaSegundos + n)), // Incrementa el contador con el paso del tiempo
      takeWhile(() => true) // Mantén el contador activo
    );
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(remainingSeconds)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
