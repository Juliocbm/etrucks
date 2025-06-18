import { ApiOperacionesService } from 'src/app/DataAccess/api-operaciones.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../dialog/dialog-content.component';
import { PriorityPedidosService } from 'src/app/DataAccess/api-priorityPedidos.service';
import { forkJoin } from 'rxjs';
import { ApiRecursosHumanosService } from 'src/app/DataAccess/api-recursos-humanos.service';

@Component({
  selector: 'app-disp-operador',
  templateUrl: './disp-operador.component.html',
  styleUrls: ['./disp-operador.component.css']
})
export class DispOperadorComponent implements OnInit {
  datosPedidos: any[] = [];
  datosPedidosFiltrados: any[] = [];
  datosOperadores: any[] = [];
  datosOperadoresFiltrados: any[] = [];

  datosPatios: any[] = [];
  datosSucursales: any[] = [];

  operadoresActivos: boolean = false;
  pedidosActivos: boolean = false;
  sucursalSeleccionada: string = localStorage.getItem('sucursalSeleccionada') || '';
  patioSeleccionado: string = localStorage.getItem('patioSeleccionado') || '';

  isLoading: boolean = false;
  idSistema: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');

  contadorOperadorPorPatio: any = {};
  contadorPedidosSucursal: any = {};

  constructor(
    private apiOperacionesService: ApiOperacionesService,
    private apiRhService: ApiRecursosHumanosService,
    private apiPriorityService: PriorityPedidosService,
    public dialog: MatDialog
  ) {
    if (this.sucursalSeleccionada === '' || this.patioSeleccionado === '') {
      this.operadoresActivos = false;
      this.pedidosActivos = false;
    } else {
      this.operadoresActivos = true;
      this.pedidosActivos = true;
    }
  }

  ngOnInit(): void {
    this.validarSeleccion();
  }

  validarSeleccion(): void {
    if (!this.sucursalSeleccionada || !this.patioSeleccionado) {
      this.openDialog();
    } else {
      this.Inicializer();
      this.setupAutoUpdate();
    }
  }

  setupAutoUpdate(): void {
    setInterval(() => this.Inicializer(), 60000); // Actualización cada minuto
  }

  Inicializer(): void {
    this.isLoading = true;

    forkJoin([
      this.apiPriorityService.getPedidos(),
      this.apiPriorityService.getOperadores(),
      this.apiOperacionesService.getUbicaciones(),
      this.apiRhService.obtenerSucursales()
    ]).subscribe(
      ([pedidos, operadores, patios, sucursales]) => {
        this.datosPedidos = pedidos;
        this.datosOperadores = operadores;
        console.log('Datos de Operadores:', this.datosOperadores);
        this.datosPatios = patios as any;
        this.datosSucursales = sucursales.filter((s: any) => s.idCompania === this.idSistema);

        this.actualizarContadores();
        this.aplicarFiltros();

        this.isLoading = false;
      },
      error => {
        console.error('Error en la carga de datos:', error);
        this.isLoading = false;
      }
    );
  }

  actualizarContadores(): void {
    this.contadorOperadorPorPatio = this.contarElementos(this.datosOperadores, 'ubicacion');
    this.contadorPedidosSucursal = this.contarElementos(this.datosPedidos, 'sucursal');

    this.datosPatios.forEach(patio => patio.conteo = this.contadorOperadorPorPatio[patio.descripcion] || 0);
    this.datosSucursales.forEach(sucursal => sucursal.conteo = this.contadorPedidosSucursal[sucursal.nombre] || 0);
  }

  contarElementos(array: any[], key: string): any {
    return array.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});
  }

  aplicarFiltros(): void {
    if (this.sucursalSeleccionada && this.patioSeleccionado) {
      this.datosPedidosFiltrados = this.datosPedidos.filter(p => p.sucursal === this.sucursalSeleccionada);
      this.datosOperadoresFiltrados = this.datosOperadores.filter(o => o.ubicacion === this.patioSeleccionado);
    }
  }

  openDialog(): void {
    this.Inicializer();
    this.mostrarDialogo();
  }

  mostrarDialogo(): void {
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '475px',
      data: {
        name: 'Selecciona una sucursal y un patio',
        datos: this.datosPatios,
        datos2: this.datosSucursales,
        filtro: { Operadores: false, Pedidos: false },
        sucursal: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'CLOSE') {
        this.guardarSeleccion(result);
        this.aplicarFiltros();
        this.setupAutoUpdate();
      }
    });
  }

  guardarSeleccion(result: any): void {
    this.patioSeleccionado = result.sucursal.descripcion;
    this.sucursalSeleccionada = result.valor.nombre;
    this.operadoresActivos = result.filtro.Operadores;
    this.pedidosActivos = result.filtro.Pedidos;

    localStorage.setItem('sucursalSeleccionada', this.sucursalSeleccionada);
    localStorage.setItem('patioSeleccionado', this.patioSeleccionado);
  }
}
