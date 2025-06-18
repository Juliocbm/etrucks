import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { PriorityPedidosService } from 'src/app/DataAccess/api-priorityPedidos.service';
import { PriorityPedido } from 'src/app/models/Serv. Cliente/PriorityPedidos/PriorityPedido';

@Component({
  selector: 'app-pedidos-prioridad',
  templateUrl: './pedidos-prioridad.component.html',
  styleUrls: ['./pedidos-prioridad.component.css'],
})
export class PedidosPrioridadComponent {
  pedidos: PriorityPedido[] = [];
  paginatedPedidos: { [sucursal: string]: PriorityPedido[] } = {};
  sucursales: string[] = [];
  currentPage: { [sucursal: string]: number } = {};
  itemsPerPage: number = 20;
  totalPages: { [sucursal: string]: number } = {};
  loading: boolean = false;

  constructor(private apiHgTools: PriorityPedidosService) {}

  ngOnInit() {
    this.getPedidos();
  }

  getPedidos() {
    this.apiHgTools.getPedidos().subscribe(
      (response: PriorityPedido[]) => {
        this.pedidos = response;
        this.groupPedidosBySucursal();
      },
      (error) => {
        console.error('Error al consultar los pedidos:', error);
      }
    );
  }

  groupPedidosBySucursal() {
    const grouped: { [key: string]: PriorityPedido[] } = this.pedidos.reduce(
      (acc: { [key: string]: PriorityPedido[] }, pedido) => {
        (acc[pedido.sucursal] = acc[pedido.sucursal] || []).push(pedido);
        return acc;
      },
      {}
    );

    // Ordena las sucursales alfabéticamente
    this.sucursales = Object.keys(grouped).sort();

    this.sucursales.forEach((sucursal) => {
      this.paginatedPedidos[sucursal] = [];
      this.currentPage[sucursal] = 1;
      this.totalPages[sucursal] = Math.ceil(
        grouped[sucursal].length / this.itemsPerPage
      );
      this.paginatePedidos(sucursal);
    });
  }

  paginatePedidos(sucursal: string) {
    const start = (this.currentPage[sucursal] - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedPedidos[sucursal] = this.pedidos
      .filter((p) => p.sucursal === sucursal)
      .slice(start, end);
  }

  changePage(sucursal: string, page: number) {
    if (page >= 1 && page <= this.totalPages[sucursal]) {
      this.currentPage[sucursal] = page;
      this.paginatePedidos(sucursal);
    }
  }

  getPages(sucursal: string): number[] {
    return Array(this.totalPages[sucursal])
      .fill(0)
      .map((x, i) => i + 1);
  }

  canGoNext(sucursal: string): boolean {
    return (
      this.currentPage[sucursal] * this.itemsPerPage <
      this.pedidos.filter((p) => p.sucursal === sucursal).length
    );
  }

  drop(event: CdkDragDrop<PriorityPedido[]>, sucursal: string) {
    const pedidosSucursal = this.pedidos.filter((p) => p.sucursal === sucursal);
    const previousIndex = pedidosSucursal.findIndex(
      (p) => p === this.paginatedPedidos[sucursal][event.previousIndex]
    );
    const currentIndex = pedidosSucursal.findIndex(
      (p) => p === this.paginatedPedidos[sucursal][event.currentIndex]
    );

    if (previousIndex === currentIndex) {
      return;
    }

    moveItemInArray(pedidosSucursal, previousIndex, currentIndex);

    this.reassignPriorities(pedidosSucursal);

    this.pedidos = this.pedidos.map((p) => {
      const pedidoEnSucursal = pedidosSucursal.find(
        (ps) => ps.idPedido === p.idPedido
      );
      return pedidoEnSucursal ? pedidoEnSucursal : p;
    });

    this.pedidos.sort((a, b) => a.priorityPosition - b.priorityPosition - 1);

    this.paginatePedidos(sucursal);

    const draggedPedido = pedidosSucursal[currentIndex];
    draggedPedido.manualPosition = true;

    this.loading = true;

    this.updatePedidosPrioridad();
  }

  confirmarCambioPrioridad(pedido: PriorityPedido, sucursal: string) {
    /* if (pedido.priorityPosition < 1 || pedido.priorityPosition > this.pedidos.length) {
      alert('La prioridad debe estar entre 1 y ' + this.pedidos.length);
      return;
    } */

    const pedidosSucursal = this.pedidos.filter((p) => p.sucursal === sucursal);

    if (
      pedido.priorityPosition < 1 ||
      pedido.priorityPosition > pedidosSucursal.length
    ) {
      alert('La prioridad debe estar entre 1 y ' + pedidosSucursal.length);
      return;
    }

    this.loading = true;

    this.pedidos.sort((a, b) => a.priorityPosition - b.priorityPosition - 1);

    this.reassignPrioritiesInput(sucursal);

    this.paginatePedidos(sucursal);

    pedido.manualPosition = true;

    this.updatePedidosPrioridad();
  }

  reassignPrioritiesInput(sucursal: string) {
    this.pedidos
      .filter((p) => p.sucursal === sucursal)
      .forEach((pedido, index) => {
        pedido.priorityPosition = index + 1;
      });
  }

  reassignPriorities(pedidosSucursal: PriorityPedido[]) {
    pedidosSucursal.forEach((pedido, index) => {
      pedido.priorityPosition = index + 1;
    });
  }

  updatePedidosPrioridad() {
    this.apiHgTools.updatePedidos(this.pedidos).subscribe(
      (response) => {
        console.log('Prioridades actualizadas', response);
        this.sucursales.forEach((sucursal) => this.paginatePedidos(sucursal));
        this.loading = false;
      },
      (error) => {
        console.error('Error al actualizar las prioridades:', error);
        this.loading = false;
      }
    );
  }

  getGlobalIndex(localIndex: number, sucursal: string): number {
    const pedidosSucursal = this.pedidos.filter((p) => p.sucursal === sucursal);
    return pedidosSucursal.findIndex(
      (p) => p === this.paginatedPedidos[sucursal][localIndex]
    );
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
