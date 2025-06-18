import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { MapboxService, EventType, IconConfig, RouteProfile, ClusterOptions } from 'src/app/shared-module/services/mapbox.service';

interface MapMarkerOptions {
  color: string;
  popup?: {
    title: string;
    description: string;
  };
  icon?: IconConfig;
}

interface RoutePoint {
  coordinates: [number, number];
  properties: Record<string, any>;
}

interface RouteStyle {
  color: string;
  width: number;
  opacity: number;
}

interface GeocercaPoint {
  coordinates: [number, number];
  properties: Record<string, any>;
}

interface Geocerca {
  points: GeocercaPoint[];
  title: string;
}

@Component({
  selector: 'app-trackin-edi',
  templateUrl: './trackin-edi.component.html',
  styleUrls: ['./trackin-edi.component.css']
})
export class TrackinEdiComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('map') mapElement!: ElementRef;
  
  @Input() shipmentData: any;
  
  private mapInitialized = false;
  private positionUpdateInterval: number | null = null;
  private currentPosition: [number, number] | null = null;
  private geocercasVisibles = true;
  private currentClusterId: string | null = null;
  
  constructor(private mapboxService: MapboxService) { }

  ngOnInit(): void {
    console.log('TrackinEdiComponent - ngOnInit');
    // Inicialización inicial si tenemos datos
    if (this.shipmentData) {
      console.log('TrackinEdiComponent - Datos de shipment disponibles en ngOnInit:', this.shipmentData.id);
      setTimeout(() => this.setupMap(), 500); // Retrasar la inicialización para asegurar que el DOM esté listo
    } else {
      console.warn('TrackinEdiComponent - No hay datos de shipment disponibles en ngOnInit');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('TrackinEdiComponent - ngOnChanges detectado');
    // Reiniciar mapa si cambian los datos del shipment
    if (changes['shipmentData']) {
      console.log('TrackinEdiComponent - El input shipmentData ha cambiado');
      
      if (changes['shipmentData'].currentValue) {
        console.log('TrackinEdiComponent - Nuevos datos recibidos para:', 
                   changes['shipmentData'].currentValue.id);
        
        if (this.mapInitialized) {
          console.log('TrackinEdiComponent - Reiniciando mapa existente');
          // Reiniciar el mapa con los nuevos datos
          this.cleanupMap();
          setTimeout(() => this.setupMap(), 500); // Retrasar para asegurar que el DOM esté actualizado
        } else if (this.mapElement) {
          console.log('TrackinEdiComponent - Inicializando mapa por primera vez');
          // Inicializar el mapa por primera vez
          setTimeout(() => this.setupMap(), 500);
        } else {
          console.warn('TrackinEdiComponent - Elemento del mapa no disponible');
        }
      } else {
        console.warn('TrackinEdiComponent - Se recibió un valor nulo o indefinido para shipmentData');
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanupMap();
  }

  // Métodos públicos para los controles del mapa
  centerMap(): void {
    // Centrar el mapa en la ruta completa
    if (this.shipmentData?.mapa?.ruta && this.shipmentData.mapa.ruta.length > 0) {
      // Usar la nueva funcionalidad para centrar en geocercas
      this.mapboxService.centerOnGeocercas();
      console.log('Centrando mapa en la ruta y geocercas');
    }
  }

  toggleGeocercas(): void {
    // Usar la nueva funcionalidad para alternar la visibilidad
    this.geocercasVisibles = this.mapboxService.toggleGeocercasVisibility();
    console.log(`Geocercas ${this.geocercasVisibles ? 'mostradas' : 'ocultas'}`);
  }

  private setupMap(): void {
    if (!this.shipmentData || !this.shipmentData.mapa || !this.mapElement) {
      console.error('No se pueden configurar datos del mapa: falta shipmentData, datos de mapa o elemento del mapa');
      return;
    }

    const mapElementId = 'shipment-map';
    this.mapElement.nativeElement.id = mapElementId;

    console.log('Inicializando mapa para shipment:', this.shipmentData.id);
    console.log('Datos del mapa:', JSON.stringify(this.shipmentData.mapa));

    // Inicializar el mapa
    this.mapboxService.initializeMap(mapElementId).then(() => {
      console.log('Mapa inicializado correctamente');
      this.mapInitialized = true;
      
      // Dibujar ruta en el mapa
      if (this.shipmentData.mapa.ruta && this.shipmentData.mapa.ruta.length > 1) {
        this.drawRoute();
      } else {
        console.warn('No hay suficientes puntos para dibujar una ruta');
      }
      
      // Dibujar geocercas
      if (this.shipmentData.mapa.geocercas && this.shipmentData.mapa.geocercas.length > 0) {
        this.drawGeocercas();
      } else {
        console.warn('No hay geocercas para dibujar');
      }
      
      // Añadir marcadores
      if (this.shipmentData.mapa.marcadores && this.shipmentData.mapa.marcadores.length > 0) {
        this.addMarkers();
      } else {
        console.warn('No hay marcadores para añadir al mapa');
      }
      
      // Simular posición satelital actualizada cada 30s
      this.startPositionUpdates();
    }).catch(error => {
      console.error('Error al inicializar el mapa:', error);
      // Intentar reiniciar el proceso después de un breve retraso
      setTimeout(() => {
        if (!this.mapInitialized) {
          console.log('Reintentando inicialización del mapa...');
          this.setupMap();
        }
      }, 2000);
    });
  }
  
  private drawRoute(): void {
    // Convertir datos de ruta al formato que espera el servicio de Mapbox
    const routePoints = this.shipmentData.mapa.ruta.map((coord: [number, number]) => {
      return {
        lat: coord[1],
        lng: coord[0]
      };
    });
    
    // Configuración de estilo para la ruta
    const routeStyle = {
      color: '#FF0000',
      width: 4,
      opacity: 0.8
    };
    
    console.log(`Dibujando ruta con ${routePoints.length} puntos siguiendo trazado de calles`);
    
    // Usar el nuevo método para dibujar rutas siguiendo calles
    this.mapboxService.drawRouteFollowingStreets(routePoints, {
      id: `shipment-route-${this.shipmentData.id}`,
      color: routeStyle.color,
      width: routeStyle.width,
      opacity: routeStyle.opacity,
      profile: RouteProfile.DRIVING,
      addMarkers: true
    }).then(routeInfo => {
      console.log(`Ruta dibujada correctamente. Distancia: ${(routeInfo.distance / 1000).toFixed(2)} km, Duración: ${(routeInfo.duration / 60).toFixed(0)} min`);
    }).catch(error => {
      console.error('Error al dibujar la ruta siguiendo calles:', error);
      
      // Fallback: si falla la ruta por calles, usar línea recta
      console.log('Usando método alternativo con líneas rectas');
      this.mapboxService.drawRoute(routePoints, {
        id: `shipment-route-${this.shipmentData.id}`,
        color: routeStyle.color,
        width: routeStyle.width,
        opacity: routeStyle.opacity
      });
      
      // Añadir marcadores de inicio y fin manualmente
      if (routePoints.length > 0) {
        this.mapboxService.addEventMarker(
          routePoints[0],
          EventType.ENTRY
        );
        
        if (routePoints.length > 1) {
          this.mapboxService.addEventMarker(
            routePoints[routePoints.length - 1],
            EventType.EXIT
          );
        }
      }
    });
  }
  
  private drawGeocercas(): void {
    // Preparar geocercas para dibujarlas en el mapa
    const geocercas: Geocerca[] = this.shipmentData.mapa.geocercas.map((geocerca: any) => {
      // Convertir al formato que espera el servicio de Mapbox
      return {
        points: geocerca.poligono.map((coord: [number, number]) => {
          return {
            coordinates: coord,
            properties: {}
          };
        }),
        title: geocerca.nombre
      };
    });
    
    // Dibujar las geocercas
    this.mapboxService.drawGeocerca(geocercas);
  }
  
  private addMarkers(): void {
    // Si hay muchos marcadores, usar clustering para mejorar rendimiento
    if (this.shipmentData.mapa.marcadores.length > 5) {
      this.addMarkersWithClustering();
    } else {
      this.addMarkersIndividually();
    }
  }
  
  private addMarkersWithClustering(): void {
    // Convertir marcadores al formato esperado por el sistema de clustering
    const points = this.shipmentData.mapa.marcadores.map((marcador: any) => {
      // Determinar el tipo de evento según los datos del marcador
      let eventType = EventType.TRANSIT; // Por defecto
      
      if (marcador.tipo === 'origen') {
        eventType = EventType.ENTRY;
      } else if (marcador.tipo === 'destino') {
        eventType = EventType.EXIT;
      }
      
      return {
        lat: marcador.posicion[1],
        lng: marcador.posicion[0],
        eventType: eventType,
        properties: {
          title: marcador.nombre || `Marcador ${marcador.tipo}`,
          description: marcador.descripcion || `Marcador tipo: ${marcador.tipo}`,
          fecha: marcador.fecha || 'No disponible',
          tipo: marcador.tipo || 'No especificado'
        }
      };
    });
    
    // Configuración del cluster
    const clusterOptions: ClusterOptions = {
      enabled: true,
      radius: 50,
      maxZoom: 14,
      colorRanges: [
        { min: 0, max: 5, color: '#41A3D5' },  // Pocos puntos - azul claro
        { min: 5, max: 15, color: '#2176AE' }, // Cantidad media - azul medio
        { min: 15, max: Number.MAX_SAFE_INTEGER, color: '#08415C' } // Muchos puntos - azul oscuro
      ]
    };
    
    // Añadir el cluster al mapa
    if (this.currentClusterId) {
      // Actualizar cluster existente
      this.mapboxService.updateMarkerCluster(this.currentClusterId, points);
    } else {
      // Crear nuevo cluster
      this.currentClusterId = this.mapboxService.addMarkerCluster(
        points,
        {
          clusterId: `shipment-markers-${this.shipmentData.id}`,
          clusterOptions: clusterOptions,
          onClick: (properties) => {
            console.log('Marcador seleccionado:', properties);
            // Aquí puedes implementar lógica adicional al hacer clic en un marcador
          }
        }
      );
    }
    
    console.log(`Se agregaron ${points.length} marcadores con clustering`);
  }
  
  private addMarkersIndividually(): void {
    // Para pocos marcadores, añadirlos individualmente
    this.shipmentData.mapa.marcadores.forEach((marcador: any) => {
      // Determinar el tipo de evento según los datos del marcador
      let eventType = EventType.TRANSIT; // Por defecto
      
      if (marcador.tipo === 'origen') {
        eventType = EventType.ENTRY;
      } else if (marcador.tipo === 'destino') {
        eventType = EventType.EXIT;
      }
      
      // Añadir el marcador usando la funcionalidad de eventos
      this.mapboxService.addEventMarker(
        { lat: marcador.posicion[1], lng: marcador.posicion[0] },
        eventType,
        marcador.icono ? {
          url: marcador.icono,
          size: { width: 35, height: 35 },
          anchor: 'bottom'
        } : undefined
      );
      
      console.log(`Marcador tipo ${marcador.tipo} añadido en posición ${marcador.posicion}`);
    });
  }

  private startPositionUpdates(): void {
    // Iniciar con la primera posición de la ruta
    if (this.shipmentData.mapa.ruta && this.shipmentData.mapa.ruta.length > 0) {
      this.currentPosition = this.shipmentData.mapa.ruta[0];
      this.updateTruckMarker();
    }
    
    // Simular actualización cada 30s
    this.positionUpdateInterval = window.setInterval(() => {
      this.simulatePositionUpdate();
    }, 30000);
  }
  
  private simulatePositionUpdate(): void {
    // Simulación simplificada: mover a lo largo de la ruta
    if (!this.currentPosition || !this.shipmentData.mapa.ruta || this.shipmentData.mapa.ruta.length < 2) {
      return;
    }
    
    // Encontrar índice actual y avanzar al siguiente punto
    const currentIndex = this.shipmentData.mapa.ruta.findIndex(
      (coord: [number, number]) => coord[0] === this.currentPosition![0] && coord[1] === this.currentPosition![1]
    );
    
    if (currentIndex >= 0 && currentIndex < this.shipmentData.mapa.ruta.length - 1) {
      // Avanzar al siguiente punto
      this.currentPosition = this.shipmentData.mapa.ruta[currentIndex + 1];
    } else {
      // Volver al inicio si llegamos al final
      this.currentPosition = this.shipmentData.mapa.ruta[0];
    }
    
    this.updateTruckMarker();
  }
  
  private updateTruckMarker(): void {
    if (!this.currentPosition) return;
    
    // Actualizar marcador del camión usando la nueva funcionalidad con icono personalizado
    this.mapboxService.addEventMarker(
      { lat: this.currentPosition[1], lng: this.currentPosition[0] },
      EventType.TRANSIT,
      {
        url: 'https://cdn-icons-png.flaticon.com/512/3774/3774289.png', // Camión
        size: { width: 40, height: 40 },
        anchor: 'bottom'
      }
    );
    
    console.log(`Posición del camión actualizada a: ${this.currentPosition}`);
  }
  
  private cleanupMap(): void {
    // Limpiar el intervalo de actualización
    if (this.positionUpdateInterval) {
      window.clearInterval(this.positionUpdateInterval);
      this.positionUpdateInterval = null;
    }
    
    // Limpiar el cluster si existe
    if (this.currentClusterId) {
      this.mapboxService.removeMarkerCluster(this.currentClusterId);
      this.currentClusterId = null;
    }
    
    // El servicio de Mapbox se encargará de limpiar el mapa en su ngOnDestroy
    this.mapInitialized = false;
  }
}
