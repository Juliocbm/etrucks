import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from 'src/app/Services/StorageService';
import { NotificacionService } from 'src/app/shared-module/services/notificacion.service';
import { environment } from 'src/app/environments/environment.prod';
import * as mapboxgl from 'mapbox-gl';
import { GeocercaPatio } from 'src/app/models/Mantenimiento/patio';
@Component({
    selector: 'app-sucursal-geocerca-map',
    templateUrl: './sucursal-geocerca-map.component.html',
    styleUrls: ['./sucursal-geocerca-map.component.css']
  })
  export class SucursalGeocercaMapComponent implements OnInit {
    
    map: mapboxgl.Map | undefined;
    token = environment.mapboxToken;
    storageGeocercaPoints:string = '';
    geocercaPatio: GeocercaPatio = new GeocercaPatio();

  // Coordenadas aproximadas del centro de tu mapa (puedes personalizarlas)
  lat = 19.432608;
  lng = -99.133209;
    constructor(
         private storageServiceMapGeocerca: StorageService<GeocercaPatio>,
         private notificacionService: NotificacionService,
    )
    {
    }
    async getItemLocalStorage() {
        this.storageServiceMapGeocerca.init('geocercaActual');
        this.storageServiceMapGeocerca.itemActual.subscribe(sucursalGeocerca => {
          if (sucursalGeocerca) {
            this.geocercaPatio = sucursalGeocerca;
            console.log('GET ITEM STORAGE sucursalGeocerca datos', this.geocercaPatio);
          } else {
            console.log("No hay un elemento guardado en session");
          }
        });
      }

   async ngOnInit(): Promise<void> {
      await  this.getItemLocalStorage();
        // Inicializar el mapa
        (mapboxgl as any).accessToken = this.token;
    
        this.map = new mapboxgl.Map({
          container: 'map', // El ID del contenedor en el HTML
          style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
          center: [this.lng, this.lat], // Centro del mapa
          zoom: 12, // Nivel de zoom inicial
        });
    
        // Añadir controles de zoom y rotación
        this.map.addControl(new mapboxgl.NavigationControl());
    
        // this.formulario = this.fb.group({
        //   idPatio: [[Validators.required]],
        //   nombre: [[Validators.required]],
        //   idSitio: [[Validators.required]],
        // });
        this.drawGeocerca(this.geocercaPatio);
    }
    parseCoordenadas(coordenadasStr: string): any {
      console.log('coordenadasStr ======> MAP', coordenadasStr);
        const coordenadas = coordenadasStr.split(',').map((coord) => {
          const [lat, lng] = coord.trim().split(' ').map(Number);
    
          if (isNaN(lat) || isNaN(lng)) {
            return null;
          }
    
          return [lng, lat];
        });
    
        const esValido = coordenadas.every(
          (coord) =>
            Array.isArray(coord) &&
            coord.length === 2 &&
            typeof coord[0] === 'number' &&
            typeof coord[1] === 'number'
        );
    
        if (!esValido) {
          return null;
        }
    
        return coordenadas;
      }

      drawGeocerca(sitio: GeocercaPatio): void {
        if (!this.map) return;
        //sitio.polygonPoints = '25.703039244811837 -100.31490981808558,25.6906248896982 -100.29594944956571,25.670538041175924 -100.30319166590108,25.670538041175924 -100.32662797027008,25.6906248896982 -100.33387018660545,25.703039244811837 -100.31490981808558';
        //valida si la variable sitio.polygonPoints tiene datos
        //console.log('local storage drawGeocerca ', localStorage.getItem('geocercaPoints'));
        if (!sitio.polygonPoints) {
          this.storageGeocercaPoints = localStorage.getItem('geocercaPoints') ?? '';
          //console.log('sin datos entro al if', this.storageGeocercaPoints);
        }else
        {
          this.storageGeocercaPoints = sitio.polygonPoints;
          //console.log('entro al else', this.storageGeocercaPoints);
        }
        var formatedCoordinates = this.parseCoordenadas(this.storageGeocercaPoints);
        //console.log('formatedCoordinates ==>', formatedCoordinates);
        if (formatedCoordinates == null) {
          this.notificacionService.showNotification('No existen coordenadas o estan mal formateadas', 'warning');
         
          console.log('msj', 'No existen coordenadas o estan mal formateadas');
          return;
        }
    
        const coordinates = formatedCoordinates;
    
        const polygonCoordinates = [coordinates];
    
        if (this.map?.isStyleLoaded()) {
          this.addGeocercaLayer(polygonCoordinates);
        } else {
          this.map?.on('load', () => {
            this.addGeocercaLayer(polygonCoordinates);
          });
        }
      }

      addGeocercaLayer(polygonCoordinates: number[][][]): void {
        // Eliminar cualquier capa existente antes de agregar una nueva
        if (this.map?.getLayer('geocerca-layer')) {
          this.map?.removeLayer('geocerca-layer');
          this.map?.removeSource('geocerca');
        }
    
        //eliminar en produccion
             polygonCoordinates = [[
              [-100.31490981808558, 25.703039244811837],
              [-100.29594944956571, 25.6906248896982],
              [-100.30319166590108, 25.670538041175924],
              [-100.32662797027008, 25.670538041175924],
              [-100.33387018660545, 25.6906248896982],
              [-100.31490981808558, 25.703039244811837]
            ]]; 
        console.log('polygonCoordinates', polygonCoordinates);
        this.map?.addSource('geocerca', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: polygonCoordinates,
            },
            properties: {},
          },
        });
    
        this.map?.addLayer({
          id: 'geocerca-layer',
          type: 'fill',
          source: 'geocerca',
          layout: {},
          paint: {
            'fill-color': '#088',
            'fill-opacity': 0.4,
          },
        });
    
        const bounds = new mapboxgl.LngLatBounds();
    
        polygonCoordinates[0].forEach((coord) => {
          bounds.extend(coord as [number, number]); // Las coordenadas deben estar en formato [lng, lat]
        });
    
        this.map?.fitBounds(bounds, {
          padding: 20, // Añade un pequeño padding alrededor del polígono
          animate: true, // Animar el movimiento
        });
      }
}