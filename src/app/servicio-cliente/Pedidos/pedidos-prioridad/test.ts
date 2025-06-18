/* import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { PriorityPedidosService } from 'src/app/DataAccess/api-priorityPedidos.service';
import { PriorityPedido } from 'src/app/models/Serv. Cliente/PriorityPedidos/PriorityPedido';

@Component({
  selector: 'app-pedidos-prioridad',
  templateUrl: './pedidos-prioridad.component.html',
  styleUrls: ['./pedidos-prioridad.component.css'],
})
export class PedidosPrioridadComponent_back {
  pedidos: PriorityPedido[] = [];

  constructor(private apiHgTools: PriorityPedidosService) {}

  ngOnInit() {
    this.getPedidos();
  }

  getPedidos() {
    this.apiHgTools.getPedidos().subscribe(
      (response: PriorityPedido[]) => {
        this.pedidos = response;
      },
      (error) => {
        console.error('Error al consultar los pedidos:', error);
      }
    );
  }

  drop(event: CdkDragDrop<PriorityPedido[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    // Identificar el pedido que fue arrastrado
    const draggedPedido = this.pedidos[event.previousIndex];

    // Mover el elemento en el array
    moveItemInArray(this.pedidos, event.previousIndex, event.currentIndex);

    // Reasignar las prioridades
    this.pedidos.forEach((pedido, index) => {
      pedido.priorityPosition = index + 1;
    });

    // Establecer manualPosition a true solo para el pedido arrastrado
    draggedPedido.manualPosition = true;
    // Actualizar el servidor con las nuevas posiciones
    this.updatePedidosPrioridad();
  }

  updatePedidosPrioridad() {
    this.apiHgTools.updatePedidos(this.pedidos).subscribe(
      (response) => {
        console.log('Prioridades actualizadas', response);
      },
      (error) => {
        console.error('Error al actualizar las prioridades:', error);
      }
    );
  }

  
  confirmarCambioPrioridad(pedido: PriorityPedido, index: number) {
    // Validar nueva prioridad
    if (pedido.priorityPosition < 1 || pedido.priorityPosition > this.pedidos.length) {
      alert('La prioridad debe estar entre 1 y ' + this.pedidos.length);
      return;
    }

    // Ordenar el array de pedidos por priorityPosition
    this.pedidos.sort((a, b) => a.priorityPosition - b.priorityPosition);

    // Reasignar las prioridades
    this.pedidos.forEach((pedido, index) => {
      pedido.priorityPosition = index + 1;
    });

    // Establecer manualPosition a true solo para el pedido modificado
    pedido.manualPosition = true;

    // Actualizar el servidor con las nuevas posiciones
    this.updatePedidosPrioridad();
  }

 

  getEstatusName(estatus: number): string {
    switch (estatus) {
      case 1:
        return 'Por asignar';
      case 2:
        return 'Asignado';
      case 3:
        return 'En tránsito';
      case 4:
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  }
}
 */