import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/app/environments/environment.prod';

export interface IconConfig {
  url: string;
  size?: { width: number, height: number };
  anchor?: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

export interface ClusterOptions {
  enabled: boolean;
  radius?: number;
  maxZoom?: number;
  minPoints?: number;
  colorRanges?: Array<{
    min: number;
    max: number;
    color: string;
  }>;
}

export enum EventType {
  ENTRY = 'entrada',
  EXIT = 'salida',
  TRANSIT = 'transito'
}

export enum RouteProfile {
  DRIVING = 'driving',
  WALKING = 'walking',
  CYCLING = 'cycling',
  DRIVING_TRAFFIC = 'driving-traffic'
}

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  private map: mapboxgl.Map | undefined;
  private longLat: [number, number] = [0, 0];
  private currentLayers: Set<string> = new Set();
  private currentSources: Set<string> = new Set();
  private geolocationSubscription: number | undefined;
  private styleMapbox: string = 'mapbox://styles/mapbox/streets-v12';
  private zoomMapbox: number = 4;
  
  // Controlar visibilidad de geocercas
  private geocercasVisibles: boolean = true;
  private geocercasList: Array<{ layerId: string, sourceId: string }> = [];
  
  // Marcadores
  private markers: { [id: string]: mapboxgl.Marker } = {};
  
  // Clustering
  private clusterSources: { [id: string]: boolean } = {};
  private defaultClusterOptions: ClusterOptions = {
    enabled: true,
    radius: 50,
    maxZoom: 14,
    minPoints: 2,
    colorRanges: [
      { min: 0, max: 10, color: '#51bbd6' },
      { min: 10, max: 30, color: '#f1f075' },
      { min: 30, max: Number.MAX_SAFE_INTEGER, color: '#f28cb1' }
    ]
  };
  
  // Configuración de iconos por defecto para eventos
  private defaultIcons: { [key in EventType]: IconConfig } = {
    [EventType.ENTRY]: {
      url: 'https://cdn-icons-png.flaticon.com/512/447/447031.png', // Icono verde
      size: { width: 30, height: 30 },
      anchor: 'bottom'
    },
    [EventType.EXIT]: {
      url: 'https://cdn-icons-png.flaticon.com/512/4379/4379548.png', // Icono rojo
      size: { width: 30, height: 30 },
      anchor: 'bottom'
    },
    [EventType.TRANSIT]: {
      url: 'https://cdn-icons-png.flaticon.com/512/5089/5089738.png', // Icono azul
      size: { width: 30, height: 30 },
      anchor: 'bottom'
    }
  };

  constructor() {
    // Obtener la ubicación actual del usuario

    // Usar un token de prueba si no está definido en el environment
    const mapboxToken = environment.mapboxToken || 'pk.eyJ1Ijoic2lzdGVtYXNoZ3QyNCIsImEiOiJjbHdnamhmemUwNXo1MmpwMW96dXpwdnd0In0._xEiMNs0ftII0IA6-Uhnjg';
    (mapboxgl as any).accessToken = mapboxToken;
    this.initGeolocation();
  }

  /**
   * Método para obtener la instancia del mapa
   * @returns La instancia del mapa o undefined si no está inicializado
   */
  getMap(): mapboxgl.Map | undefined {
    return this.map;
  }

  private initGeolocation(): void {
    this.geolocationSubscription = navigator.geolocation.watchPosition(
      (position) => {
        this.longLat = [position.coords.longitude, position.coords.latitude];
      },
      (error) => console.error('Geolocation error:', error),
      { enableHighAccuracy: true }
    );
  }

  ngOnDestroy(): void {
    if (this.geolocationSubscription) {
      navigator.geolocation.clearWatch(this.geolocationSubscription);
    }
    this.cleanupMap();
  }

  private cleanupMap(): void {
    if (this.map) {
      // Limpiar todas las capas y fuentes registradas
      this.currentLayers.forEach(layerId => {
        if (this.map?.getLayer(layerId)) {
          this.map.removeLayer(layerId);
        }
      });
      this.currentSources.forEach(sourceId => {
        if (this.map?.getSource(sourceId)) {
          this.map.removeSource(sourceId);
        }
      });
      this.currentLayers.clear();
      this.currentSources.clear();
      
      // Limpiar marcadores
      Object.values(this.markers).forEach(marker => marker.remove());
      this.markers = {};
      
      // Reiniciar la lista de geocercas
      this.geocercasList = [];

      // Remover listeners y destruir el mapa
      this.map.remove();
      this.map = undefined;
    }
  }

  private addLayerAndTrack(layerId: string, layerConfig: mapboxgl.AnyLayer): void {
    if (this.map) {
      this.map.addLayer(layerConfig);
      this.currentLayers.add(layerId);
    }
  }

  private addSourceAndTrack(sourceId: string, sourceConfig: mapboxgl.AnySourceData): void {
    if (this.map) {
      this.map.addSource(sourceId, sourceConfig);
      this.currentSources.add(sourceId);
    }
  }

  private removeLayerAndSource(layerId: string, sourceId: string): void {
    if (this.map) {
      if (this.map.getLayer(layerId)) {
        this.map.removeLayer(layerId);
        this.currentLayers.delete(layerId);
      }
      if (this.map.getSource(sourceId)) {
        this.map.removeSource(sourceId);
        this.currentSources.delete(sourceId);
      }
    }
  }

  initializeMap(containerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Si el mapa ya está inicializado, limpiarlo primero
        if (this.map) {
          this.cleanupMap();
        }

        // Coordenadas para México (fallback si no hay geolocalización)
        this.longLat = [-100.20979811377374, 25.73767037525833]; 
      
        const containerElement = document.getElementById(containerId);
        if (!containerElement) {
          console.error(`Container element with id ${containerId} not found`);
          reject(new Error(`Container element with id ${containerId} not found`));
          return;
        }

        // Crear nuevo mapa
        this.map = new mapboxgl.Map({
          container: containerId,
          style: this.styleMapbox,
          projection: 'globe',
          zoom: this.zoomMapbox,
          pitch: 25,
          bearing: -5.6,
          center: this.longLat
        });

        this.map.on('style.load', () => {
          if (this.map) {
            this.map.setFog({}); // Set the default atmosphere style
          }
        });

        // this.map.scrollZoom.disable();
      
        this.map.on('load', () => {
          console.log('Mapa cargado correctamente');
          this.addMarker(this.longLat[0], this.longLat[1]);
          resolve();
        });
      
        this.map.on('error', (error) => {
          console.error('Mapbox error:', error);
          reject(error);
        });
      } catch (error) {
        console.error('Map initialization error:', error);
        reject(error);
      }
    });
  }

  addMarker(longitude: number, latitude: number, options?: { id?: string, color?: string, popup?: { title: string, description: string }, icon?: IconConfig }): mapboxgl.Marker | undefined {
    if (!this.map) {
      console.error('Map is not initialized');
      return undefined;
    }
    
    const id = options?.id || `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Si ya existe un marcador con este ID, eliminarlo primero
    if (options?.id && this.markers[options.id]) {
      this.markers[options.id].remove();
    }
    
    // Crear elemento DOM para el icono personalizado si se proporciona
    let markerElement: HTMLElement | undefined;
    if (options?.icon) {
      markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.style.backgroundImage = `url(${options.icon.url})`;
      markerElement.style.width = `${options.icon.size?.width || 30}px`;
      markerElement.style.height = `${options.icon.size?.height || 30}px`;
      markerElement.style.backgroundSize = 'contain';
      markerElement.style.backgroundRepeat = 'no-repeat';
    }
    
    // Crear el marcador con el icono personalizado o usar el marcador estándar
    const marker = markerElement 
      ? new mapboxgl.Marker({ element: markerElement })
      : new mapboxgl.Marker({ color: options?.color || '#3FB1CE' });
    
    marker.setLngLat([longitude, latitude]).addTo(this.map);
    
    // Añadir popup si se proporciona
    if (options?.popup) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${options.popup.title}</h3><p>${options.popup.description}</p>`);
      marker.setPopup(popup);
    }
    
    // Almacenar referencia al marcador
    this.markers[id] = marker;
    
    return marker;
  }

  calculateETA(origin: [number, number], destination: [number, number]): Promise<number> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?access_token=${environment.mapboxToken}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.routes?.[0]?.duration) {
          return data.routes[0].duration;
        }
        throw new Error('No route found');
      });
  }

  /**
   * Obtiene y dibuja una ruta siguiendo las calles entre puntos
   * @param waypoints Array de puntos {lat, lng} que conforman la ruta
   * @param options Opciones adicionales para la ruta
   * @returns Promesa que resuelve con la información de la ruta
   */
  drawRouteFollowingStreets(
    waypoints: Array<{lat: number, lng: number}>, 
    options?: {
      id?: string,
      color?: string,
      width?: number,
      opacity?: number,
      profile?: RouteProfile,
      addMarkers?: boolean
    }
  ): Promise<{
    duration: number,
    distance: number,
    geometry: any
  }> {
    if (!this.map || waypoints.length < 2) {
      return Promise.reject(new Error('Map is not initialized or insufficient points for route'));
    }
    
    const routeId = options?.id || `route-streets-${Date.now()}`;
    const sourceId = `${routeId}-source`;
    const layerId = `${routeId}-layer`;
    
    // Construir el string de coordenadas para la API de direcciones
    const coordinates = waypoints.map(point => `${point.lng},${point.lat}`).join(';');
    
    // Configurar parámetros de la API
    const profile = options?.profile || RouteProfile.DRIVING;
    const geometries = 'geojson';
    const overview = 'full';
    
    // Construir URL para la API de Directions
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?alternatives=false&geometries=${geometries}&overview=${overview}&steps=true&access_token=${(mapboxgl as any).accessToken}`;
    
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al obtener direcciones: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data.routes || data.routes.length === 0) {
          throw new Error('No se encontró ninguna ruta');
        }
        
        const route = data.routes[0];
        const routeGeometry = route.geometry;
        
        // Añadir fuente para la ruta
        this.addSourceAndTrack(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeGeometry
          }
        });
        
        // Añadir capa para visualizar la ruta
        this.addLayerAndTrack(layerId, {
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': options?.color || '#0080ff',
            'line-width': options?.width || 6,
            'line-opacity': options?.opacity || 0.8
          }
        });
        
        // Añadir marcadores si se especifica
        if (options?.addMarkers) {
          // Primer punto como entrada
          this.addEventMarker(
            waypoints[0],
            EventType.ENTRY
          );
          
          // Puntos intermedios como tránsito
          for (let i = 1; i < waypoints.length - 1; i++) {
            this.addEventMarker(
              waypoints[i],
              EventType.TRANSIT
            );
          }
          
          // Último punto como salida
          if (waypoints.length > 1) {
            this.addEventMarker(
              waypoints[waypoints.length - 1],
              EventType.EXIT
            );
          }
        }
        
        // Ajustar la vista para mostrar toda la ruta
        this.fitBoundsToCoordinates(routeGeometry.coordinates as [number, number][]);
        
        return {
          duration: route.duration,
          distance: route.distance,
          geometry: routeGeometry
        };
      });
  }

  drawGeocerca(geocercas: Array<{ points: Array<{ coordinates: [number, number], properties?: any }>, title?: string }>): void {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }

    // Limpiar geocercas existentes
    this.clearGeocerca();
    
    // Lista para mantener un seguimiento de las nuevas geocercas
    const newGeocercasList: Array<{ layerId: string, sourceId: string }> = [];

    geocercas.forEach(({ points, title }) => {
      const polygonId = `geocerca-polygon-${title || 'default'}-${Date.now()}`;
      const sourceId = `geocerca-source-${title || 'default'}-${Date.now()}`;
      const titleLayerId = `geocerca-title-${title || 'default'}-${Date.now()}`;
      const titleSourceId = `geocerca-title-source-${title || 'default'}-${Date.now()}`;

      // Crear el polígono cerrado
      const coordinates = this.createClosedPolygon(points.map(point => point.coordinates));
      const center = this.calculateCenter(coordinates);

      // Agregar fuente y capa del polígono
      this.addSourceAndTrack(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature' as const,
          geometry: {
            type: 'Polygon' as const,
            coordinates: [coordinates]
          },
          properties: { height: 20 }
        }
      });

      this.addLayerAndTrack(polygonId, {
        id: polygonId,
        type: 'fill-extrusion',
        source: sourceId,
        paint: {
          'fill-extrusion-color': '#FF0000',
          'fill-extrusion-opacity': 0.6,
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-translate': [0, 0],
          'fill-extrusion-translate-anchor': 'map'
        },
        layout: {
          'visibility': this.geocercasVisibles ? 'visible' : 'none'
        }
      });

      // Agregar título si se proporciona
      if (title) {
        this.addSourceAndTrack(titleSourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: center
            },
            properties: { title }
          }
        });

        this.addLayerAndTrack(titleLayerId, {
          id: titleLayerId,
          type: 'symbol',
          source: titleSourceId,
          layout: {
            'text-field': ['get', 'title'],
            'text-size': 16,
            'text-anchor': 'center',
            'text-offset': [0, 0],
            'text-justify': 'center',
            'visibility': this.geocercasVisibles ? 'visible' : 'none'
          },
          paint: {
            'text-color': '#FFFFFF',
            'text-halo-color': '#000000',
            'text-halo-width': 2
          }
        });
        
        // Registrar los IDs para controlar la visibilidad
        newGeocercasList.push({ layerId: titleLayerId, sourceId: titleSourceId });
      }
      
      // Registrar los IDs para controlar la visibilidad
      newGeocercasList.push({ layerId: polygonId, sourceId: sourceId });
    });
    
    // Actualizar la lista de geocercas
    this.geocercasList = newGeocercasList;

    // Ajustar la vista si hay geocercas y están visibles
    if (geocercas.length > 0 && this.geocercasVisibles) {
      this.centerOnGeocercas();
    }
  }

  private createClosedPolygon(coordinates: [number, number][]): [number, number][] {
    if (coordinates.length === 0) return [];
    
    const firstPoint = coordinates[0];
    const lastPoint = coordinates[coordinates.length - 1];
    
    return firstPoint[0] === lastPoint[0] && firstPoint[1] === lastPoint[1]
      ? coordinates
      : [...coordinates, firstPoint];
  }

  private calculateCenter(coordinates: [number, number][]): [number, number] {
    if (coordinates.length === 0) return [0, 0];
    
    const sum = coordinates.reduce(
      (acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]],
      [0, 0]
    );
    
    return [
      sum[0] / coordinates.length,
      sum[1] / coordinates.length
    ];
  }

  private fitBoundsToCoordinates(coordinates: [number, number][]): void {
    if (!this.map || coordinates.length === 0) return;

    const bounds = coordinates.reduce(
      (bounds, coord) => bounds.extend(coord as any),
      new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
    );

    this.map.fitBounds(bounds, {
      padding: 50,
      duration: 1000
    });
  }

  // Método para limpiar recursos específicos
  clearGeocerca(): void {
    // Eliminar todas las geocercas registradas
    this.geocercasList.forEach(({ layerId, sourceId }) => {
      if (this.map?.getLayer(layerId)) {
        this.map.removeLayer(layerId);
        this.currentLayers.delete(layerId);
      }
      if (this.map?.getSource(sourceId)) {
        this.map.removeSource(sourceId);
        this.currentSources.delete(sourceId);
      }
    });
    
    // Limpiar la lista
    this.geocercasList = [];
  }
  
  /**
   * Centra el mapa en todas las geocercas activas
   */
  centerOnGeocercas(): void {
    if (!this.map || this.geocercasList.length === 0) {
      console.warn('No hay geocercas para centrar');
      return;
    }
    
    // Crear un bounds que incluya todas las geocercas
    const allCoordinates: [number, number][] = [];
    
    // Para cada geocerca, obtener sus coordenadas y añadirlas al array
    this.geocercasList.forEach(({ sourceId }) => {
      if (this.map?.getSource(sourceId)) {
        const source = this.map.getSource(sourceId) as mapboxgl.GeoJSONSource;
        const data = (source as any)._data;
        
        if (data?.geometry?.type === 'Polygon' && data.geometry.coordinates?.length > 0) {
          // Es un polígono, añadir todas sus coordenadas
          allCoordinates.push(...data.geometry.coordinates[0]);
        } else if (data?.geometry?.type === 'Point') {
          // Es un punto (título), añadirlo también
          allCoordinates.push(data.geometry.coordinates);
        }
      }
    });
    
    // Si tenemos coordenadas, ajustar la vista
    if (allCoordinates.length > 0) {
      this.fitBoundsToCoordinates(allCoordinates);
    }
  }
  
  /**
   * Controla la visibilidad de todas las geocercas
   * @param visible Indica si las geocercas deben ser visibles
   */
  setGeocercasVisibility(visible: boolean): void {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }
    
    // Actualizar el estado interno
    this.geocercasVisibles = visible;
    
    // Actualizar la visibilidad de todas las capas de geocercas
    this.geocercasList.forEach(({ layerId }) => {
      if (this.map?.getLayer(layerId)) {
        this.map.setLayoutProperty(
          layerId,
          'visibility',
          visible ? 'visible' : 'none'
        );
      }
    });
  }
  
  /**
   * Alterna la visibilidad de las geocercas
   * @returns El nuevo estado de visibilidad
   */
  toggleGeocercasVisibility(): boolean {
    this.setGeocercasVisibility(!this.geocercasVisibles);
    return this.geocercasVisibles;
  }
  
  /**
   * Dibuja una ruta en el mapa a partir de un array de puntos (línea recta)
   * @param routePoints Array de puntos {lat, lng} que forman la ruta
   * @param options Opciones de configuración de la ruta
   */
  drawRoute(routePoints: Array<{lat: number, lng: number}>, options?: {
    id?: string,
    color?: string,
    width?: number,
    opacity?: number
  }): void {
    if (!this.map || routePoints.length < 2) {
      console.error('Map is not initialized or insufficient points for route');
      return;
    }
    
    const routeId = options?.id || `route-${Date.now()}`;
    const sourceId = `${routeId}-source`;
    const layerId = `${routeId}-layer`;
    
    // Convertir los puntos al formato requerido por Mapbox
    const coordinates = routePoints.map(point => [point.lng, point.lat] as [number, number]);
    
    // Añadir la fuente para la ruta
    this.addSourceAndTrack(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      }
    });
    
    // Añadir la capa para visualizar la ruta
    this.addLayerAndTrack(layerId, {
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': options?.color || '#0080ff',
        'line-width': options?.width || 5,
        'line-opacity': options?.opacity || 0.75
      }
    });
    
    // Centrar la vista en la ruta
    this.fitBoundsToCoordinates(coordinates);
  }
  
  /**
   * Añade un marcador para un tipo de evento específico en el punto final de una ruta
   * @param point Punto donde colocar el marcador {lat, lng}
   * @param eventType Tipo de evento (entrada, salida, transito)
   * @param customIcon Configuración de icono personalizado (opcional)
   */
  addEventMarker(point: {lat: number, lng: number}, eventType: EventType, customIcon?: IconConfig): mapboxgl.Marker | undefined {
    // Determinar qué icono usar
    const icon = customIcon || this.defaultIcons[eventType];
    
    // Determinar el título según el tipo de evento si está disponible
    let title = 'Punto de ruta';
    let description = '';
    
    switch(eventType) {
      case EventType.ENTRY:
        title = 'Entrada';
        description = 'Punto de entrada a geocerca';
        break;
      case EventType.EXIT:
        title = 'Salida';
        description = 'Punto de salida de geocerca';
        break;
      case EventType.TRANSIT:
        title = 'Tránsito';
        description = 'Punto de tránsito';
        break;
    }
    
    // Añadir el marcador
    return this.addMarker(
      point.lng,
      point.lat,
      {
        id: `event-marker-${eventType}-${Date.now()}`,
        icon: icon,
        popup: {
          title: title,
          description: description
        }
      }
    );
  }
  
  /**
   * Configura un icono personalizado para un tipo de evento
   * @param eventType Tipo de evento para el que configurar el icono
   * @param config Configuración del icono
   */
  setEventIcon(eventType: EventType, config: IconConfig): void {
    this.defaultIcons[eventType] = config;
  }
  
  /**
   * Añade un conjunto de marcadores agrupados en clusters para optimizar rendimiento
   * @param points Array de puntos para agregar al cluster
   * @param options Opciones de configuración del cluster
   * @returns ID del cluster creado
   */
  addMarkerCluster(
    points: Array<{
      lat: number,
      lng: number,
      properties?: any,
      icon?: IconConfig,
      eventType?: EventType
    }>,
    options?: {
      clusterId?: string,
      clusterOptions?: ClusterOptions,
      onClick?: (properties: any) => void
    }
  ): string {
    if (!this.map) {
      console.error('Map is not initialized');
      return '';
    }
    
    // Generar ID único para el cluster si no se proporciona
    const clusterId = options?.clusterId || `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const sourceId = `${clusterId}-source`;
    const clusterLayerId = `${clusterId}-clusters`;
    const clusterCountLayerId = `${clusterId}-cluster-count`;
    const unclusteredPointLayerId = `${clusterId}-unclustered-point`;
    
    // Fusionar opciones personalizadas con opciones por defecto
    const clusterOptions: ClusterOptions = {
      ...this.defaultClusterOptions,
      ...options?.clusterOptions
    };
    
    // Convertir puntos al formato GeoJSON
    const features = points.map(point => {
      // Determinar propiedades adicionales basadas en el tipo de evento
      let properties = point.properties || {};
      
      if (point.eventType) {
        properties = {
          ...properties,
          eventType: point.eventType,
          iconUrl: point.icon?.url || this.defaultIcons[point.eventType].url
        };
      }
      
      return {
        type: 'Feature' as const,
        properties,
        geometry: {
          type: 'Point' as const,
          coordinates: [point.lng, point.lat]
        }
      };
    });
    
    // Configurar la fuente con soporte para clustering
    this.addSourceAndTrack(sourceId, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      },
      cluster: clusterOptions.enabled,
      clusterMaxZoom: clusterOptions.maxZoom,
      clusterRadius: clusterOptions.radius
    });
    
    // Recordar que esta fuente es un cluster
    this.clusterSources[sourceId] = true;
    
    // Añadir capa para mostrar los clusters
    this.addLayerAndTrack(clusterLayerId, {
      id: clusterLayerId,
      type: 'circle',
      source: sourceId,
      filter: ['has', 'point_count'],
      paint: {
        // Usar un step para asignar colores según la cantidad de puntos en el cluster
        'circle-color': [
          'step',
          ['get', 'point_count'],
          ...clusterOptions.colorRanges!.reduce((acc: any[], range) => {
            acc.push(range.color);
            if (range.max !== Number.MAX_SAFE_INTEGER) {
              acc.push(range.max);
            }
            return acc;
          }, [])
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,      // radio para clusters pequeños
          10,      // umbral para clusters medianos
          30,      // radio para clusters medianos
          50,      // umbral para clusters grandes
          40       // radio para clusters grandes
        ]
      }
    });
    
    // Añadir capa para mostrar el contador de puntos en cada cluster
    this.addLayerAndTrack(clusterCountLayerId, {
      id: clusterCountLayerId,
      type: 'symbol',
      source: sourceId,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      },
      paint: {
        'text-color': '#ffffff'
      }
    });
    
    // Añadir capa para mostrar los puntos individuales cuando no están agrupados
    this.addLayerAndTrack(unclusteredPointLayerId, {
      id: unclusteredPointLayerId,
      type: 'circle',
      source: sourceId,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });
    
    // Manejar eventos de clic en el cluster para expandirlo
    if (this.map) {
      // Definimos las funciones de los eventos para poder eliminarlos después
      const clickClusterHandler = (e: mapboxgl.MapMouseEvent) => {
        if (!this.map) return;
        
        const features = this.map.queryRenderedFeatures(e.point, { layers: [clusterLayerId] });
        if (!features.length || !features[0].properties) return;
        
        const clusterId = features[0].properties['cluster_id'];
        if (!clusterId) return;
        
        const source = this.map.getSource(sourceId) as mapboxgl.GeoJSONSource;
        if (!source) return;
        
        source.getClusterExpansionZoom(
          clusterId,
          (err, zoom) => {
            if (err || !this.map || !features[0].geometry) return;
            
            const coordinates = (features[0].geometry as GeoJSON.Point).coordinates;
            this.map.easeTo({
              center: [coordinates[0], coordinates[1]],
              zoom: zoom || this.map.getZoom() + 1
            });
          }
        );
      };
      
      const mouseEnterHandler = () => {
        if (this.map) {
          this.map.getCanvas().style.cursor = 'pointer';
        }
      };
      
      const mouseLeaveHandler = () => {
        if (this.map) {
          this.map.getCanvas().style.cursor = '';
        }
      };
      
      const clickPointHandler = (e: mapboxgl.MapMouseEvent) => {
        if (!this.map || !e.features || !e.features.length || !e.features[0].geometry) return;
        
        const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice();
        const properties = e.features[0].properties;
        
        if (!properties) return;
        
        // Ajustar la posición del popup si el mapa ha sido movido
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        // Mostrar popup con la información del punto
        new mapboxgl.Popup()
          .setLngLat([coordinates[0], coordinates[1]])
          .setHTML(this.generatePopupContent(properties))
          .addTo(this.map);
        
        // Llamar al callback personalizado si se proporciona
        if (options?.onClick) {
          options.onClick(properties);
        }
      };
      
      this.map.on('click', clusterLayerId, clickClusterHandler);
      this.map.on('mouseenter', clusterLayerId, mouseEnterHandler);
      this.map.on('mouseleave', clusterLayerId, mouseLeaveHandler);
      this.map.on('click', unclusteredPointLayerId, clickPointHandler);
      
      (this.map as any).clusterHandlers = {
        ...(this.map as any).clusterHandlers,
        [clusterId]: {
          clickCluster: { layer: clusterLayerId, handler: clickClusterHandler },
          mouseEnter: { layer: clusterLayerId, handler: mouseEnterHandler },
          mouseLeave: { layer: clusterLayerId, handler: mouseLeaveHandler },
          clickPoint: { layer: unclusteredPointLayerId, handler: clickPointHandler }
        }
      };
    }
    
    return clusterId;
  }
  
  /**
   * Actualiza los datos de un cluster existente
   * @param clusterId ID del cluster a actualizar
   * @param points Nuevos puntos para el cluster
   */
  updateMarkerCluster(
    clusterId: string,
    points: Array<{
      lat: number,
      lng: number,
      properties?: any,
      icon?: IconConfig,
      eventType?: EventType
    }>
  ): void {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }
    
    const sourceId = `${clusterId}-source`;
    
    if (!this.clusterSources[sourceId]) {
      console.error(`El cluster con ID ${clusterId} no existe`);
      return;
    }
    
    // Convertir puntos al formato GeoJSON
    const features = points.map(point => {
      // Determinar propiedades adicionales basadas en el tipo de evento
      let properties = point.properties || {};
      
      if (point.eventType) {
        properties = {
          ...properties,
          eventType: point.eventType,
          iconUrl: point.icon?.url || this.defaultIcons[point.eventType].url
        };
      }
      
      return {
        type: 'Feature' as const,
        properties,
        geometry: {
          type: 'Point' as const,
          coordinates: [point.lng, point.lat]
        }
      };
    });
    
    // Actualizar los datos de la fuente
    const source = this.map.getSource(sourceId) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features
      });
    }
  }
  
  /**
   * Elimina un cluster y todas sus capas asociadas
   * @param clusterId ID del cluster a eliminar
   */
  removeMarkerCluster(clusterId: string): void {
    if (!this.map) return;
    
    const sourceId = `${clusterId}-source`;
    const clusterLayerId = `${clusterId}-clusters`;
    const clusterCountLayerId = `${clusterId}-cluster-count`;
    const unclusteredPointLayerId = `${clusterId}-unclustered-point`;
    
    // Eliminar listeners de eventos
    if ((this.map as any).clusterHandlers && (this.map as any).clusterHandlers[clusterId]) {
      const handlers = (this.map as any).clusterHandlers[clusterId];
      
      if (handlers.clickCluster) {
        this.map.off('click', handlers.clickCluster.layer, handlers.clickCluster.handler);
      }
      
      if (handlers.mouseEnter) {
        this.map.off('mouseenter', handlers.mouseEnter.layer, handlers.mouseEnter.handler);
      }
      
      if (handlers.mouseLeave) {
        this.map.off('mouseleave', handlers.mouseLeave.layer, handlers.mouseLeave.handler);
      }
      
      if (handlers.clickPoint) {
        this.map.off('click', handlers.clickPoint.layer, handlers.clickPoint.handler);
      }
      
      delete (this.map as any).clusterHandlers[clusterId];
    }
    
    // Eliminar capas
    [clusterLayerId, clusterCountLayerId, unclusteredPointLayerId].forEach(layerId => {
      if (this.map?.getLayer(layerId)) {
        this.map.removeLayer(layerId);
        this.currentLayers.delete(layerId);
      }
    });
    
    // Eliminar fuente
    if (this.map.getSource(sourceId)) {
      this.map.removeSource(sourceId);
      this.currentSources.delete(sourceId);
      delete this.clusterSources[sourceId];
    }
  }
  
  /**
   * Genera el contenido HTML para el popup de un marcador
   * @param properties Propiedades del marcador
   * @returns Contenido HTML para el popup
   */
  private generatePopupContent(properties: any): string {
    if (!properties) return '<div>Sin información</div>';
    
    let content = '<div class="marker-popup">';
    
    // Título basado en el tipo de evento si está disponible
    if (properties.eventType) {
      let title = 'Punto';
      switch (properties.eventType) {
        case EventType.ENTRY:
          title = 'Punto de entrada';
          break;
        case EventType.EXIT:
          title = 'Punto de salida';
          break;
        case EventType.TRANSIT:
          title = 'Punto de tránsito';
          break;
      }
      content += `<h3>${title}</h3>`;
    } else if (properties.title) {
      content += `<h3>${properties.title}</h3>`;
    }
    
    // Descripción
    if (properties.description) {
      content += `<p>${properties.description}</p>`;
    }
    
    // Información adicional
    const excludedProps = ['eventType', 'iconUrl', 'title', 'description'];
    const additionalProps = Object.entries(properties)
      .filter(([key]) => !excludedProps.includes(key))
      .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`);
    
    if (additionalProps.length > 0) {
      content += '<table class="marker-details">';
      content += additionalProps.join('');
      content += '</table>';
    }
    
    content += '</div>';
    return content;
  }
}
