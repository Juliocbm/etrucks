import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

interface Evento {
  mensaje: string;
  fecha: string;
  sistema: string;
  viaje: string;
  id_personalizado: string;
}

interface EventoReportado {
  caso: string;
  descripcion: string;
  fecha: string;
}

interface EstatusSeguimiento {
  caso: string;
  estatus: string;
  fecha_notificacion: string;
}

@Component({
  selector: 'app-events-edi',
  templateUrl: './events-edi.component.html',
  styleUrls: ['./events-edi.component.css']
})
export class EventsEdiComponent implements OnInit, OnChanges {
  @Input() eventos: Evento[] = [];
  @Input() eventosReportados: EventoReportado[] = [];
  @Input() estatusSeguimiento: EstatusSeguimiento[] = [];

  // Propiedades para filtrado y búsqueda
  filteredEvents: Evento[] = [];
  searchTerm: string = '';
  currentFilter: 'all' | 'app' | 'system' = 'all';

  constructor() { }

  ngOnInit(): void {
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventos']) {
      this.applyFilters();
    }
  }

  // Métodos para buscar y filtrar
  applySearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  setFilter(filter: 'all' | 'app' | 'system'): void {
    this.currentFilter = filter;
    this.applyFilters();
  }

  private applyFilters(): void {
    if (!this.eventos) {
      this.filteredEvents = [];
      return;
    }

    let result = [...this.eventos];

    // Aplicar filtro por tipo
    if (this.currentFilter !== 'all') {
      result = result.filter(evento => {
        if (this.currentFilter === 'app') {
          return evento.sistema.includes('APP');
        } else {
          return !evento.sistema.includes('APP');
        }
      });
    }

    // Aplicar término de búsqueda
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase().trim();
      result = result.filter(evento => 
        evento.mensaje.toLowerCase().includes(searchLower) || 
        evento.id_personalizado.toLowerCase().includes(searchLower) || 
        evento.viaje.toLowerCase().includes(searchLower)
      );
    }

    this.filteredEvents = result;
  }

  // Formateador de fechas
  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      return date.toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }
}
