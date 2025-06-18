import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { StorageService } from 'src/app/Services/StorageService';
import { shipments, shipmentDetailedData, estatusShipments } from '../../data/mock-shipments';

interface Company {
  id: number;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-edi-tracker',
  templateUrl: './edi-tracker.component.html',
  styleUrls: ['./edi-tracker.component.css']
})
export class EdiTrackerComponent implements OnInit {
  // Propiedades de búsqueda
  searchInput: string = '';
  selectedCompany: Company | null = null;
  searchResults: any[] = [];
  isLoading: boolean = false;
  
  // Datos del shipment seleccionado
  selectedShipment: any = null;
  
  // Columnas para mostrar en tabla de stops
  displayedStopColumns: string[] = ['numero', 'cliente', 'tipo', 'entrada', 'salida', 'lugar'];
  
  // Control de componente EDI
  showParseEdi: boolean = false;
  
  // Control de visibilidad del mapa
  isMapHidden: boolean = false;
  
  // Lista de empresas
  companies: Company[] = [
    { id: 1, name: 'HG Transporte', icon: 'local_shipping' },
    { id: 2, name: 'Navistar', icon: 'directions_bus' },
    { id: 3, name: 'Daimler', icon: 'commute' }
  ];
  
  // Subject para manejar búsqueda con debounce
  private searchSubject = new Subject<string>();

  constructor(
    private shipmentStorageService: StorageService<any>,
    private companyStorageService: StorageService<Company>
  ) { }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchShipment(term);
    });
    
    // Inicializamos los servicios de almacenamiento con sus respectivas claves
    this.shipmentStorageService.init('selectedShipment');
    this.companyStorageService.init('selectedCompany');
    
    this.loadStoredData();
    
    // Cargar preferencia de visibilidad del mapa si existe
    const savedMapVisibility = localStorage.getItem('edi-tracker-map-visibility');
    if (savedMapVisibility) {
      this.isMapHidden = savedMapVisibility === 'hidden';
    }
  }

  loadStoredData(): void {
    // Intentamos recuperar los datos almacenados
    this.shipmentStorageService.itemActual.subscribe(data => {
      if (data) {
        this.selectedShipment = data;
      }
    });

    this.companyStorageService.itemActual.subscribe(data => {
      if (data) {
        this.selectedCompany = data;
      }
    });
  }

  // Métodos para manejo de búsqueda
  onSearchChange(value: string): void {
    if (value && value.trim()) {
      this.searchSubject.next(value);
    } else {
      this.searchResults = [];
    }
  }

  selectShipment(shipment: any): void {
    this.clearSearch();
    this.isLoading = true;
    
    console.log('Seleccionando shipment:', shipment.shipment || shipment.id);
    
    // Simulamos un retardo en la carga
    setTimeout(() => {
      // Obtener datos detallados del shipment
      const shipmentDetallado = this.obtenerDatosDetallados(shipment.shipment || shipment.id);
      
      // Verificar si tenemos todos los datos necesarios para el mapa
      if (shipmentDetallado && shipmentDetallado.mapa) {
        console.log('Datos de mapa encontrados para el shipment:', shipmentDetallado.id);
        
        // Asegurarnos de que existan todas las propiedades necesarias para el mapa
        if (!shipmentDetallado.mapa.ruta || shipmentDetallado.mapa.ruta.length === 0) {
          console.warn('El shipment no tiene datos de ruta definidos. Inicializando array vacío.');
          shipmentDetallado.mapa.ruta = [];
        }
        
        if (!shipmentDetallado.mapa.geocercas || shipmentDetallado.mapa.geocercas.length === 0) {
          console.warn('El shipment no tiene geocercas definidas. Inicializando array vacío.');
          shipmentDetallado.mapa.geocercas = [];
        }
        
        if (!shipmentDetallado.mapa.marcadores || shipmentDetallado.mapa.marcadores.length === 0) {
          console.warn('El shipment no tiene marcadores definidos. Inicializando array vacío.');
          shipmentDetallado.mapa.marcadores = [];
        }
      } else {
        console.error('No se encontraron datos de mapa para el shipment:', shipment.shipment || shipment.id);
      }
      
      // Asignar los datos al componente principal
      this.selectedShipment = shipmentDetallado;
      console.log('Datos completos asignados a selectedShipment:', this.selectedShipment);
      
      // Guardar en el servicio de almacenamiento
      this.shipmentStorageService.changeItem(this.selectedShipment);
      
      this.isLoading = false;
    }, 800);
  }

  selectCompany(company: Company): void {
    this.selectedCompany = company;
    this.companyStorageService.changeItem(company);
    // Si hay un término de búsqueda, actualizamos los resultados
    if (this.searchInput) {
      this.searchShipment(this.searchInput);
    }
  }

  searchShipment(term: string): void {
    if (!term || !term.trim()) {
      this.searchResults = [];
      return;
    }
    
    this.isLoading = true;
    
    // Simulamos una búsqueda con delay
    setTimeout(() => {
      // Buscar en los datos mock utilizando el término
      this.searchResults = this.buscarEnDatosMock(term);
      this.isLoading = false;
    }, 500);
  }

  private buscarEnDatosMock(term: string): any[] {
    // Buscar en shipments por número de shipment, origen o destino
    const lowerTerm = term.toLowerCase();
    return shipments.filter(s => 
      s.shipment.toLowerCase().includes(lowerTerm) || 
      s.origen.toLowerCase().includes(lowerTerm) || 
      s.destino.toLowerCase().includes(lowerTerm)
    ).slice(0, 5); // Limitamos a 5 resultados
  }

  clearSearch(): void {
    this.searchInput = '';
    this.searchResults = [];
  }

  // Métodos para acciones
  generateReport(): void {
    if (!this.selectedShipment) return;
    
    // Aquí iría la lógica para generar un reporte en PDF
    console.log('Generando reporte para:', this.selectedShipment.cabecera.shipment_id);
    alert('Reporte 214 generado con éxito');
  }

  // Métodos para mostrar/ocultar EDI parser
  toggleParseEdi(): void {
    this.showParseEdi = !this.showParseEdi;
  }

  onEdiParsed(data: any): void {
    this.showParseEdi = false;
    if (data) {
      this.selectedShipment = data;
      this.shipmentStorageService.changeItem(data);
    }
  }

  // Métodos para controlar la visibilidad del mapa
  toggleMapVisibility(): void {
    this.isMapHidden = !this.isMapHidden;
    // Guardar preferencia del usuario
    localStorage.setItem('edi-tracker-map-visibility', this.isMapHidden ? 'hidden' : 'visible');
  }

  // Helpers
  getStatusColor(status: string): string {
    if (!status) return 'gray';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('nuevo') || statusLower.includes('por confirmar')) {
      return '#2196F3'; // Azul
    } else if (statusLower.includes('confirmado') || statusLower.includes('relacionado')) {
      return '#4CAF50'; // Verde
    } else if (statusLower.includes('reportando')) {
      return '#FF9800'; // Naranja
    } else if (statusLower.includes('cancelado')) {
      return '#F44336'; // Rojo
    } else if (statusLower.includes('finalizado')) {
      return '#9C27B0'; // Morado
    }
    return 'gray';
  }

  // Método para obtener los datos del shipment
  private obtenerDatosDetallados(id: string): any {
    // Buscar el shipment en los datos detallados
    const shipmentData = shipmentDetailedData.find(s => s.id === id);
    
    // Si encontramos el shipment, lo devolvemos
    if (shipmentData) {
      return shipmentData;
    }
    
    // Si no encontramos el shipment, intentamos encontrarlo en la lista básica
    const basicShipment = shipments.find(s => s.shipment === id);
    
    if (basicShipment) {
      // Crear un objeto de datos detallados a partir del básico
      return this.crearDatosDetalladosDesdeBasico(basicShipment);
    }
    
    // Si no encontramos nada, devolvemos el primer shipment de los datos detallados
    return shipmentDetailedData[0];
  }
  
  private crearDatosDetalladosDesdeBasico(shipmentBasic: any): any {
    // Obtener el estatus del shipment
    const estatus = estatusShipments.find(e => e.idEstatusShipment === shipmentBasic.idEstatusShipment);
    
    return {
      id: shipmentBasic.shipment,
      cabecera: {
        estatus: `${estatus?.idEstatusShipment || ''} - ${estatus?.estatusShipment || 'Desconocido'}`,
        scac: shipmentBasic.origen.substring(0, 4),
        fecha_ingreso: shipmentBasic.fechaCreacion,
        shipment_id: shipmentBasic.shipment
      },
      transporte: {
        pedido: shipmentBasic.numControl,
        viaje: shipmentBasic.idEdiViaje || '',
        unidad: shipmentBasic.equipo || '',
        satelite_mac: '',
        inicio_viaje: shipmentBasic.fechaCreacion,
        fin_viaje: '',
        rango_horas: ''
      },
      remitente: {
        nombre: shipmentBasic.origen,
        site_id: `SITE-${Math.floor(Math.random() * 1000)}`,
        geocerca: shipmentBasic.origen
      },
      destinatario: {
        nombre: shipmentBasic.destino,
        site_id: `SITE-${Math.floor(Math.random() * 1000)}`,
        geocerca: shipmentBasic.destino
      },
      eventos_app: [
        {
          mensaje: `Se procesa archivo EDI para shipment ${shipmentBasic.shipment}`,
          fecha: shipmentBasic.fechaCreacion,
          sistema: 'SISTEMA-EDI',
          viaje: shipmentBasic.idEdiViaje || '',
          id_personalizado: `EV-${shipmentBasic.idShipment}-001`
        }
      ],
      stops: [],
      eventos_reportados: [],
      estatus_seguimiento: [],
      mapa: {
        ruta: [
          [-100.246, 25.676],
          [-100.250, 25.680],
          [-100.255, 25.685]
        ],
        geocercas: [
          {
            nombre: shipmentBasic.origen,
            poligono: [
              [-100.240, 25.670],
              [-100.240, 25.680],
              [-100.250, 25.680],
              [-100.250, 25.670]
            ]
          },
          {
            nombre: shipmentBasic.destino,
            poligono: [
              [-100.251, 25.681],
              [-100.251, 25.691],
              [-100.261, 25.691],
              [-100.261, 25.681]
            ]
          }
        ],
        marcadores: []
      }
    };
  }
}
