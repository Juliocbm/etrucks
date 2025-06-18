import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-parse-edi',
  templateUrl: './parse-edi.component.html',
  styleUrls: ['./parse-edi.component.css']
})
export class ParseEdiComponent {
  @Output() close = new EventEmitter<void>();
  @Output() ediParsed = new EventEmitter<any>();
  
  ediContent: string = '';
  isParsing: boolean = false;
  errorMessage: string = '';
  
  constructor() { }

  cerrarModal(): void {
    this.close.emit();
  }

  manejarArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    
    const file = input.files[0];
    // Verificar si es un archivo EDI o TXT
    if (!file.name.endsWith('.edi') && !file.name.endsWith('.txt')) {
      this.errorMessage = 'Por favor, seleccione un archivo .edi o .txt';
      return;
    }
    
    // Leer el archivo
    const reader = new FileReader();
    reader.onload = (e) => {
      const contenido = e.target?.result as string;
      this.ediContent = contenido;
      this.errorMessage = '';
    };
    reader.onerror = () => {
      this.errorMessage = 'Error al leer el archivo';
    };
    reader.readAsText(file);
  }

  manejarPegado(event: ClipboardEvent): void {
    const texto = event.clipboardData?.getData('text');
    if (texto) {
      this.ediContent = texto;
      this.errorMessage = '';
    }
  }

  parsearEdi(): void {
    if (!this.ediContent) {
      this.errorMessage = 'Por favor, seleccione un archivo o pegue el contenido EDI';
      return;
    }
    
    this.isParsing = true;
    
    // Simulamos un procesamiento asíncrono
    setTimeout(() => {
      try {
        // En un entorno real, aquí llamaríamos a un servicio para procesar el EDI
        // Por ahora, simplemente devolvemos un objeto mock
        const shipmentData = this.obtenerDatosMockup();
        this.ediParsed.emit(shipmentData);
        this.isParsing = false;
      } catch (error) {
        this.errorMessage = 'Error al procesar el archivo EDI';
        this.isParsing = false;
      }
    }, 1500);
  }

  private obtenerDatosMockup(): any {
    return {
      id: 'RBLT-2024-03-15-7890',
      cabecera: {
        estatus: '7 - REPORTANDO EVENTOS',
        scac: 'RBLT',
        fecha_ingreso: '2025-04-15 08:30:00',
        shipment_id: 'RBLT-2024-03-15-7890'
      },
      transporte: {
        pedido: 'ORD-7890',
        viaje: 'TRIP-456',
        unidad: 'TRUCK-202',
        satelite_mac: '00:1B:44:11:3A:B7',
        inicio_viaje: '2025-04-15 09:00:00',
        fin_viaje: '2025-04-15 14:30:00',
        rango_horas: '5h 30m'
      },
      remitente: {
        nombre: 'Empresa X S.A.',
        site_id: 'SITE-100',
        geocerca: 'PATIO CHARQUEÑO II'
      },
      destinatario: {
        nombre: 'Cliente Y Inc.',
        site_id: 'SITE-200',
        geocerca: 'ALMACÉN LOS ANDES'
      },
      eventos_app: [
        {
          mensaje: 'Se procesó archivo EDI',
          fecha: '2025-04-15 08:30:00',
          sistema: 'SISTEMA-EDI',
          viaje: 'TRIP-456',
          id_personalizado: 'EV-001'
        },
        {
          mensaje: 'Inicio de carga',
          fecha: '2025-04-15 09:15:00',
          sistema: 'APP-MÓVIL',
          viaje: 'TRIP-456',
          id_personalizado: 'EV-002'
        },
        {
          mensaje: 'En ruta hacia destino',
          fecha: '2025-04-15 10:30:00',
          sistema: 'APP-MÓVIL',
          viaje: 'TRIP-456',
          id_personalizado: 'EV-003'
        },
        {
          mensaje: 'Llegada a destino',
          fecha: '2025-04-15 14:00:00',
          sistema: 'APP-MÓVIL',
          viaje: 'TRIP-456',
          id_personalizado: 'EV-004'
        }
      ],
      stops: [
        {
          numero: 1,
          cliente: 'BODEGA NORTE',
          tipo: 'Carga',
          entrada: '2025-04-15 09:00:00',
          salida: '2025-04-15 10:20:00',
          lugar: 'Parque Industrial Norte'
        },
        {
          numero: 2,
          cliente: 'PARADA TÉCNICA',
          tipo: 'Revisión',
          entrada: '2025-04-15 12:00:00',
          salida: '2025-04-15 12:15:00',
          lugar: 'Estación de Servicio'
        },
        {
          numero: 3,
          cliente: 'CLIENTE Y INC.',
          tipo: 'Descarga',
          entrada: '2025-04-15 14:00:00',
          salida: '2025-04-15 14:30:00',
          lugar: 'Almacén Los Andes'
        }
      ],
      eventos_reportados: [
        {
          caso: 'RT-RBLT-001',
          descripcion: 'Retraso en carga por inspección',
          fecha: '2025-04-15 10:15:00'
        },
        {
          caso: 'RT-RBLT-002',
          descripcion: 'Parada técnica por mantenimiento',
          fecha: '2025-04-15 12:00:00'
        }
      ],
      estatus_seguimiento: [
        {
          caso: 'ST-RBLT-001',
          estatus: 'Resuelto',
          fecha_notificacion: '2025-04-15 11:00:00'
        },
        {
          caso: 'ST-RBLT-002',
          estatus: 'En proceso',
          fecha_notificacion: '2025-04-15 12:30:00'
        }
      ],
      mapa: {
        ruta: [
          [-100.310, 25.710],
          [-100.330, 25.720],
          [-100.350, 25.730],
          [-100.370, 25.740],
          [-100.390, 25.750]
        ],
        geocercas: [
          {
            nombre: 'PATIO CHARQUEÑO II',
            poligono: [
              [-100.300, 25.700],
              [-100.300, 25.720],
              [-100.320, 25.720],
              [-100.320, 25.700]
            ]
          },
          {
            nombre: 'ALMACÉN LOS ANDES',
            poligono: [
              [-100.380, 25.740],
              [-100.380, 25.760],
              [-100.400, 25.760],
              [-100.400, 25.740]
            ]
          }
        ],
        marcadores: [
          {
            tipo: 'Origen',
            posicion: [-100.310, 25.710],
            datos: {
              nombre: 'Empresa X S.A.',
              tiempo: '2025-04-15 09:00:00',
              estado: 'Visitado'
            }
          },
          {
            tipo: 'Parada',
            posicion: [-100.350, 25.730],
            datos: {
              nombre: 'Parada Técnica',
              tiempo: '2025-04-15 12:00:00',
              estado: 'Completado'
            }
          },
          {
            tipo: 'Destino',
            posicion: [-100.390, 25.750],
            datos: {
              nombre: 'Cliente Y Inc.',
              tiempo: '2025-04-15 14:00:00',
              estado: 'Activo'
            }
          },
          {
            tipo: 'Posición',
            posicion: [-100.370, 25.740],
            datos: {
              nombre: 'Posición actual',
              tiempo: '2025-04-15 13:45:00',
              estado: 'En ruta'
            }
          }
        ]
      }
    };
  }
}
