import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiEdiToolsService } from 'src/app/DataAccess/Edi/api-edi-tools.service';
import { EdiKpiData, ClienteEdi, EdiKpiDataDetalle } from 'src/app/models/Edi/ediKpiModel';
import { ParametrosGenerales } from 'src/app/models/SistemaGeneral/ParametrosGenerales';

// Importaciones para ApexCharts
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexYAxis,
  ApexAnnotations,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { StorageService } from 'src/app/Services/StorageService';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/Services/alerts.service';
import { AuthService } from 'src/app/security/services/auth.service';
import { ModalSemiCrudKpiComponent } from '../modal-semi-crud-kpi/modal-semi-crud-kpi.component';

// Tipo para las opciones del gráfico
export type ChartOptions = {
  title: ApexTitleSubtitle;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  fill: ApexFill;
  annotations: ApexAnnotations;
  plotOptions: any; // Opciones del plot (tipo de gráfico, estilo, etc.)
  responsive: any[]; // Configuración responsive para diferentes breakpoints
  grid: any; // Configuración del grid
  states: any; // Estados de los elementos del gráfico
};

@Component({
  selector: 'app-dashboard-edi-kpi',
  templateUrl: './dashboard-edi-kpi.component.html',
  styleUrls: ['./dashboard-edi-kpi.component.css']
})
export class DashboardEdiKpiComponent implements OnInit, AfterViewInit {  
  // ResizeObserver para actualizar el gráfico dinámicamente
  private resizeObserver: ResizeObserver | null = null;
  // Propiedades para el gráfico ApexCharts
  public chartOptions: Partial<ChartOptions> = {};
  public chartSeries: ApexAxisChartSeries = [];
  public chartLabels: string[] = [];
  // Datos para la tabla y gráfico
  kpiData: EdiKpiData[] = [];
  filteredData: EdiKpiData[] = [];

  // Propiedades para la tabla Material
  dataSource = new MatTableDataSource<EdiKpiData>([]);
  displayedColumns: string[] = ['periodo', 'totalPedidos',  'loadTender', 'acciones'];

  // Referencia al componente ApexCharts para acceder a su API
  @ViewChild('chart') chart: any;

  // Estadísticas actualizadas al mover el cursor sobre el gráfico
  hoveredStats: {
    week?: string,
    edi?: number,
    nonEdi?: number,
    total?: number,
    compliance?: number
  } = {};

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Lista de clientes disponibles
  clientesList: ClienteEdi[] = [];
  filteredClientesList: ClienteEdi[] = [];
  clientesLoading: boolean = false;
  showClienteSelector: boolean = false;
  clienteSearchText: string = '';

  // Control de estado
  loading: boolean = false;
  error: string = '';

  // Información del cliente seleccionado
  clienteSeleccionado: string = '';
  idClienteSeleccionado: number = 0;

  // Filtros activos
  activeFilters: any = {
    idCliente: 0,
    clienteNombre: '',
    anio: new Date().getFullYear(),
    semanaInicio: 1,
    semanaFin: 52
  };

  // FormGroup para el rango de fechas
  rangoFechas: FormGroup;
  fechaInicioSeleccionada: Date | null = null;
  fechaFinSeleccionada: Date | null = null;
  idCompania: number = Number(localStorage.getItem('CompaniaSelect')) ?? 0;

  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClick(item)
    }
  ];

  constructor(
    private fb: FormBuilder,
    private apiEdiTools: ApiEdiToolsService,
    private storageService: StorageService<EdiKpiDataDetalle>,
    private dialog: MatDialog,
    private alertService: AlertService,
    private authService: AuthService,
  ) {
    // Inicializamos el formulario de rango de fechas
    this.rangoFechas = this.fb.group({
      start: [null],
      end: [null]
    });

    // Configuramos los filtros activos iniciales
    this.activeFilters = {
      anio: new Date().getFullYear(),
      semanaInicio: 1,
      semanaFin: 52
    };

    // Configurar filtro de clientes
    this.filteredClientesList = this.clientesList;

    // Inicializar opciones del gráfico
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    // Imprimimos diciendo que se cargan los datos
    console.log('Cargando datos...');

    // Inicializamos el rango de fechas con el último mes
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 3);

    // Establecemos los valores iniciales en el FormGroup
    this.rangoFechas.patchValue({
      start: lastMonth,
      end: today
    });

    // Nos suscribimos a los cambios en el rango de fechas
    this.rangoFechas.valueChanges.subscribe(fechas => {
      this.fechaInicioSeleccionada = fechas.start;
      this.fechaFinSeleccionada = fechas.end;

      // Si ambas fechas están definidas, recargamos los datos
      if (fechas.start && fechas.end) {
        this.loadKpiData();
      }
    });

    // Cargar la lista de clientes
    this.loadClientesList();

    // Cargar datos iniciales
    this.loadKpiData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar el ordenamiento predeterminado por semana en orden descendente (más reciente primero)
    this.sort.sort({
      id: 'periodo',
      start: 'desc',  // 'desc' para descendente (más reciente primero)
      disableClear: false
    });
    
    // Implementar ResizeObserver para detectar cambios en el tamaño del contenedor
    this.setupChartResizeObserver();

    // Personalizar la función de comparación para ordenar correctamente por periodo (año/semana)
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        case 'periodo':
          // Ordenar por año y luego por semana
          return (item.anio * 100) + item.semana; // Multiplicamos el año por 100 para que sea siempre mayor que la semana
        default:
          return item[property];
      }
    };
  }

  /**
   * Carga la lista de clientes disponibles
   */
  loadClientesList(): void {
    this.clientesLoading = true;

    // Obtenemos la compañía del localStorage
    const idCompania = Number(localStorage.getItem('CompaniaSelect')) || 1;

    this.apiEdiTools.getClientes(idCompania).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.clientesList = response.items;
          this.filteredClientesList = [...this.clientesList];
          this.clientesLoading = false;

          // Seleccionar automáticamente el primer cliente si existe y no hay ninguno seleccionado
          if (this.clientesList.length > 0 && !this.idClienteSeleccionado) {
            const primerCliente = this.clientesList[0];
            this.selectCliente(primerCliente);
            console.log('Cliente seleccionado automáticamente:', primerCliente.descripcion);
          }
        } else {
          console.error('Error cargando clientes:', response?.errorList);
          this.clientesLoading = false;
        }
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);
        this.clientesLoading = false;
      }
    });
  }

  /**
   * Filtra la lista de clientes según el texto de búsqueda
   */
  filterClientes(searchText: string): void {
    this.clienteSearchText = searchText;

    if (!searchText) {
      this.filteredClientesList = [...this.clientesList];
      return;
    }

    const searchLower = searchText.toLowerCase();
    this.filteredClientesList = this.clientesList.filter(cliente =>
      cliente.descripcion.toLowerCase().includes(searchLower) ||
      cliente.scac.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Maneja el evento de clic en el chip para mostrar/ocultar el selector de clientes
   */
  toggleClienteSelector(): void {
    this.showClienteSelector = !this.showClienteSelector;

    // Si se está abriendo el selector, resetear el filtro
    if (this.showClienteSelector) {
      this.clienteSearchText = '';
      this.filteredClientesList = [...this.clientesList];

      // Dar tiempo para que el DOM se actualice y luego enfocar el campo de búsqueda
      setTimeout(() => {
        const searchInput = document.querySelector('.cliente-search-field input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  /**
   * Maneja eventos de teclado para el selector de clientes
   */
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Cerrar el selector con la tecla Escape
    if (event.key === 'Escape' && this.showClienteSelector) {
      this.showClienteSelector = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Maneja la selección de un cliente desde el selector
   * @param cliente El cliente seleccionado
   */
  selectCliente(cliente: ClienteEdi): void {
    // Guarda la información del cliente en propiedades del componente
    this.idClienteSeleccionado = cliente.idCliente;
    this.clienteSeleccionado = cliente.descripcion;

    // Actualiza los filtros activos
    this.activeFilters.idCliente = cliente.idCliente;
    this.activeFilters.clienteNombre = cliente.descripcion;

    // Oculta el selector de clientes
    this.showClienteSelector = false;

    // Registra la selección para depuración
    console.log('Cliente seleccionado:', cliente);
    console.log('ID del cliente:', this.idClienteSeleccionado);

    // Recarga los datos KPI con el nuevo filtro de cliente
    this.loadKpiData();
  }

  /**
   * Limpia el filtro de cliente y recarga los datos
   */
  clearClienteFilter(): void {
    // Resetear todas las propiedades relacionadas con la selección de cliente
    this.idClienteSeleccionado = 0;
    this.clienteSeleccionado = 'Todos los clientes';
    this.activeFilters.idCliente = 0;
    this.activeFilters.clienteNombre = '';

    // Ocultar el selector si estuviera abierto
    this.showClienteSelector = false;

    // Registro para depuración
    console.log('Filtro de cliente limpiado, ID cliente:', this.idClienteSeleccionado);

    // Recargar los datos KPI sin filtro de cliente
    this.loadKpiData();
  }

  /**
   * Maneja el evento de cambio de filtros desde el componente filter-panel
   */
  onFilterChange(filtros: any): void {
    // Adaptamos los filtros recibidos al formato que usa nuestro componente
    if (filtros) {
      // Guardamos la información del cliente seleccionado
      this.activeFilters = {
        idCliente: filtros.idCliente ? filtros.idCliente : 0,
        clienteNombre: filtros.clienteNombre || '',
        anio: filtros.fechaInicio ? new Date(filtros.fechaInicio).getFullYear() : new Date().getFullYear(),
        semanaInicio: filtros.semanaInicio || 1,
        semanaFin: filtros.semanaFin || 52,
        fechaInicio: filtros.fechaInicio || null,
        fechaFin: filtros.fechaFin || null
      };

      // Si hay fechas especificadas, ajustar semanas
      if (filtros.fechaInicio && filtros.fechaFin) {
        const fechaInicio = new Date(filtros.fechaInicio);
        const fechaFin = new Date(filtros.fechaFin);

        // Calcular número de semana
        const getWeekNumber = (date: Date): number => {
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
          return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        };

        this.activeFilters.semanaInicio = getWeekNumber(fechaInicio);
        this.activeFilters.semanaFin = getWeekNumber(fechaFin);
      }

      // Actualizamos el cliente seleccionado y su nombre para mostrarlo en la interfaz
      if (filtros.idCliente && filtros.clienteNombre) {
        this.idClienteSeleccionado = filtros.idCliente;
        this.clienteSeleccionado = filtros.clienteNombre;
      } else {
        this.idClienteSeleccionado = 0;
        this.clienteSeleccionado = 'Todos los clientes';
      }

      console.log('ID del cliente actualizado:', this.idClienteSeleccionado);

      // Cargamos los datos con los nuevos filtros
      this.loadKpiData();
    }
  }

  /**
   * Datos de ejemplo para desarrollo
   */
  getMockData(): EdiKpiData[] {
    const currentYear = new Date().getFullYear();
    const mockData: EdiKpiData[] = [];

    const clientes = [
      { nombre: 'CLIENTE A', id: 1 },
      { nombre: 'CLIENTE B', id: 2 },
      { nombre: 'CLIENTE C', id: 3 },
      { nombre: 'CLIENTE D', id: 4 }
    ];

    // Generar datos de las últimas 12 semanas
    for (let clienteObj of clientes) {
      for (let semana = 1; semana <= 12; semana++) {
        const totalPedidos = Math.floor(Math.random() * 100) + 50; // 50-150 pedidos
        const metaCliente = Math.random() * 0.2 + 0.7; // 70-90% meta
        const metaInt = Math.random() * 0.1 + 0.8; // 80-90% meta interna

        // Porcentaje aleatorio pero cercano a la meta
        const factorCumplimiento = Math.random() * 0.4 + 0.8; // 80-120% de cumplimiento
        const ediShipments = Math.floor(totalPedidos * metaCliente * factorCumplimiento);
        const nonEDIShipments = totalPedidos - ediShipments;
        const loadTender = Math.floor(ediShipments * 0.7); // 70% de EDI son Load Tender

        mockData.push({
          anio: currentYear,
          semana,
          cliente: clienteObj.nombre,
          idCliente: clienteObj.id,
          totalPedidos,
          ediShipments,
          nonEDIShipments,
          loadTender,
          metaCliente,
          metaInt
        });
      }
    }

    return mockData;
  }


  getTotalPedidos(): number {
    return this.dataSource.data.reduce((total, item) => total + item.totalPedidos, 0);
  }

  getTotalEdiShipments(): number {
    return this.dataSource.data.reduce((total, item) => total + item.ediShipments, 0);
  }

  getTotalNonEdiShipments(): number {
    return this.dataSource.data.reduce((total, item) => total + item.nonEDIShipments, 0);
  }

  getPromedioLoadTender(): number {
    const data = this.dataSource.data;
    if (data.length === 0) return 0;

    const sum = data.reduce((total, item) => total + item.loadTender, 0);
    return sum / data.length;
  }

  /**
   * Formatea una fecha a string en formato YYYY-MM-DD
   */
  private formatDate(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
    // return `${year}-${day}-${month}`;
  }

  /**
   * Carga los datos KPI desde el servicio
   */
  loadKpiData(): void {
    this.loading = true;
    this.error = '';

    // Obtenemos la compañía del localStorage
    const idCompania = Number(localStorage.getItem('CompaniaSelect')) || 1;

    // Creamos un objeto con el formato que espera la API utilizando la clase correcta
    const parametros = new ParametrosGenerales();
    parametros.idCompania = idCompania;

    // Obtenemos las fechas del FormGroup
    const fechaInicio = this.fechaInicioSeleccionada;
    const fechaFin = this.fechaFinSeleccionada;

    // Añadimos el rango de fechas si está disponible
    if (fechaInicio && fechaFin) {
      // Formato requerido por la API: rangoFechas=fecha/fecha
      parametros.rangoFechas = `${this.formatDate(fechaInicio)}/${this.formatDate(fechaFin)}`;
    } else {
      // Si no hay rango de fechas, establecemos un rango por defecto (últimos 3 meses)
      const today = new Date();
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);

      // Formato requerido por la API: rangoFechas=fecha/fecha
      parametros.rangoFechas = `${this.formatDate(threeMonthsAgo)}/${this.formatDate(today)}`;

      // Actualizamos el FormGroup con estas fechas
      this.rangoFechas.patchValue({
        start: threeMonthsAgo,
        end: today
      }, { emitEvent: false }); // Evitamos un bucle infinito

      // Actualizamos las variables
      this.fechaInicioSeleccionada = threeMonthsAgo;
      this.fechaFinSeleccionada = today;
    }

    // Actualizamos la interfaz para mostrar el cliente seleccionado
    if (this.activeFilters.idCliente && this.activeFilters.clienteNombre) {
      this.clienteSeleccionado = this.activeFilters.clienteNombre;
    } else {
      this.clienteSeleccionado = 'Todos los clientes';
    }

    // Preparamos el ID del cliente para la API
    const idCliente = this.idClienteSeleccionado;

    // Registro para depuración
    console.log('Llamando API con:', {
      compania: parametros.idCompania,
      cliente: idCliente,
      rangoFechas: parametros.rangoFechas
    });

    this.apiEdiTools.getKpiData(parametros, idCliente).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response && response.success) {
          // Transformar los datos: convertir 'año' a 'anio' para coincidir con nuestro modelo
          this.kpiData = response.items.map((item: any) => {
            // Si el item tiene la propiedad 'año', la copiamos a 'anio'
            if (item.año !== undefined) {
              return {
                ...item,
                anio: item.año // Copiar el valor de 'año' a 'anio'
              };
            }
            return item;
          });

          console.log('Datos transformados:', this.kpiData);
          this.applyFilters();

          // Si hay datos y no hay cliente seleccionado, intentamos obtener el nombre desde los datos
          if (!this.clienteSeleccionado && this.kpiData.length > 0 && this.kpiData[0].cliente) {
            this.clienteSeleccionado = this.kpiData[0].cliente;
          }
        } else {
          this.error = response.message || 'Error obteniendo datos KPI.';
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        this.error = 'Error cargando datos: ' + error.message;
        this.loading = false;
      }
    });

  }

  /**
   * Aplica los filtros seleccionados a los datos
   */
  applyFilters(): void {
    if (!this.kpiData || this.kpiData.length === 0) {
      this.filteredData = [];
      this.dataSource.data = [];
      return;
    }

    this.filteredData = this.kpiData.filter(item => {
      // Filtrar por cliente si está seleccionado
      if (this.idClienteSeleccionado && item.idCliente !== this.idClienteSeleccionado) {
        return false;
      }

      // Filtrar por año
      if (this.activeFilters.anio && item.anio !== this.activeFilters.anio) {
        return false;
      }

      // Filtrar por rango de semanas
      if (item.semana < this.activeFilters.semanaInicio ||
        item.semana > this.activeFilters.semanaFin) {
        return false;
      }

      return true;
    });

    // Ordenar los datos por semana más reciente (año descendente y semana descendente)
    this.filteredData.sort((a, b) => {
      // Primero comparar por año (descendente)
      if (a.anio !== b.anio) {
        return b.anio - a.anio;
      }
      // Si el año es igual, comparar por semana (descendente)
      return b.semana - a.semana;
    });

    // Actualizar el dataSource de la tabla con los datos filtrados y ordenados
    this.dataSource.data = this.filteredData;
    console.log('Datos filtrados y ordenados actualizados en tabla:', this.filteredData);

    // Actualizar los datos del gráfico
    this.updateChart();
  }

  /**
   * Configura un observador para detectar cambios en el tamaño del contenedor y actualizar el gráfico
   */
  private setupChartResizeObserver(): void {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
      const chartContainer = document.querySelector('.chart-container');
      if (!chartContainer) {
        console.error('No se encontró el contenedor del gráfico');
        return;
      }

      // Forzar la actualización completa del gráfico incluyendo el toolbar una vez al inicio
      if (this.chart && this.chart.chart) {
        console.log('Forzando actualización inicial completa del gráfico');
        // Actualizar completamente el chart y forzar la recreación del toolbar
        this.chart.chart.destroy();
        setTimeout(() => {
          this.chart.chart.render();
        }, 100);
      }

      // Crear un ResizeObserver para detectar cambios en el tamaño del contenedor
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(entries => {
          // Solo nos interesa el primer elemento observado (el contenedor)
          const entry = entries[0];
          if (!entry) return;

          // Esperar un poco para que la animación termine antes de actualizar el gráfico
          setTimeout(() => {
            // Si el chart está definido y tiene un método de actualización, lo llamamos
            if (this.chart && this.chart.chart) {
              console.log('Actualizando tamaño del gráfico');
              this.chart.chart.render();
              
              // Asegurarnos de que el toolbar sea visible verificando su elemento DOM
              const toolbar = document.querySelector('.apexcharts-toolbar');
              if (toolbar) {
                (toolbar as HTMLElement).style.opacity = '1';
                (toolbar as HTMLElement).style.visibility = 'visible';
                (toolbar as HTMLElement).style.display = 'flex';
              }
            }
          }, 100);
        });

        // Comenzar a observar el contenedor
        this.resizeObserver.observe(chartContainer);
        console.log('Observer iniciado para el contenedor del gráfico');
      } else {
        console.warn('ResizeObserver no está disponible en este navegador');
      }
    }, 500); // Dar tiempo para que el DOM esté completamente cargado
  }

  /**
   * Limpia los observadores al destruir el componente
   */
  ngOnDestroy(): void {
    // Detener el observador si está activo
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  updateChart(): void {
    // Ordenar los datos por año y semana (ascendente para el gráfico)
    const sortedData = [...this.filteredData].sort((a, b) => {
      // Primero comparar por año
      if (a.anio !== b.anio) {
        return a.anio - b.anio;
      }
      // Si el año es igual, comparar por semana
      return a.semana - b.semana;
    });

    // Crear datos para el gráfico
    const categories: string[] = [];
    const loadTenderValues: number[] = [];
    const metaClienteValues: number[] = [];
    const metaIntValues: number[] = [];

    sortedData.forEach((item: EdiKpiData) => {
      categories.push(`${item.semana}`); // Solo mostrar número de semana para más claridad
      loadTenderValues.push(parseFloat(item.loadTender.toFixed(2)));
      metaClienteValues.push(parseFloat(item.metaCliente.toFixed(2)));
      metaIntValues.push(parseFloat(item.metaInt.toFixed(2)));
    });

    // Configurar series del gráfico combinado (barras y líneas)
    this.chartSeries = [
      {
        name: 'Load Tender',
        type: 'column',
        data: loadTenderValues,
        color: '#2196F3' // Azul para Load Tender
      },
      {
        name: 'Meta Cliente',
        type: 'line',
        data: metaClienteValues,
        color: '#FF9800' // Naranja para Meta Cliente
      },
      {
        name: 'Meta Interna',
        type: 'line',
        data: metaIntValues,
        color: '#4CAF50' // Verde para Meta Interna
      }
    ];

    // Actualizar categorías del eje X
    if (this.chartOptions.xaxis) {
      this.chartOptions.xaxis.categories = categories;
      this.chartOptions.xaxis.title = {
        text: 'Semana'
      };
    }

    // Configurar múltiples ejes Y
    this.chartOptions.yaxis = [
      {
        title: {
          text: 'Load Tender (%)'
        },
        min: 0,
        max: 100,
        decimalsInFloat: 0,
        labels: {
          formatter: function(val) {
            return val.toFixed(0) + '%';
          }
        }
      },
      // {
      //   opposite: true,
      //   title: {
      //     text: 'Meta (%)'
      //   },
      //   min: 0,
      //   max: 100,
      //   decimalsInFloat: 0,
      //   labels: {
      //     formatter: function(val) {
      //       return val.toFixed(0) + '%';
      //     }
      //   }
      // }
    ];

    // Configurar tooltip para mostrar información detallada
    if (this.chartOptions.tooltip) {
      this.chartOptions.tooltip.y = {
        formatter: function(val: number, opts: any) {
          return typeof val === 'number' ? val.toFixed(2) + '%' : val + '%';
        }
      };
      this.chartOptions.tooltip.shared = true;
      this.chartOptions.tooltip.intersect = false;
    }

    // Configurar etiquetas de datos para mostrar porcentajes en las barras
    if (this.chartOptions.dataLabels) {
      this.chartOptions.dataLabels = {
        enabled: true,
        enabledOnSeries: [0], // Solo mostrar valores en la serie de barras (Load Tender)
        formatter: function(val: number | string, opts: any) {
          return typeof val === 'number' ? val.toFixed(0) + '%' : val + '%';
        },
        style: {
          fontSize: '12px',
          colors: ['#333']
        },
        offsetY: -10
      };
    }

    // Eliminar anotaciones previas ya que ahora las metas son series
    if (this.chartOptions.annotations) {
      this.chartOptions.annotations = {
        yaxis: []
      };
    }

    // Actualizar las opciones del gráfico con configuración responsive
    this.chartOptions = {
      ...this.chartOptions,
      series: this.chartSeries,
      title: {
        text: "KPI PEDIDOS EDI",
        align: "left",
        offsetX: 110
      },
      // Configuración para que el gráfico se ajuste automáticamente al contenedor
      chart: {
        type: 'bar', // Especificar explícitamente el tipo de gráfico para evitar errores de tipado
        height: '100%',
        width: '100%',
        toolbar: {
          show: true, // Habilitar la barra de herramientas
          tools: {
            download: false, // Desactivar descarga
            selection: true, // Habilitar selección
            zoom: true, // Habilitar zoom
            zoomin: true, // Habilitar acercar
            zoomout: true, // Habilitar alejar
            pan: true, // Habilitar arrastrar/pan
            reset: true // Habilitar botón de reset/home
          },
          autoSelected: 'zoom' // Preseleccionar la herramienta de zoom
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        fontFamily: 'inherit',
        background: 'transparent',
        // Ajuste al tamaño del contenedor de forma dinámica
        redrawOnWindowResize: true,
        redrawOnParentResize: true
      },
      // Configuración responsive para diferentes tamaños de pantalla
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetY: 10
            },
            dataLabels: {
              enabled: false // Desactivar etiquetas en pantallas muy pequeñas
            }
          }
        }
      ],
      grid: {
        padding: {
          right: 10,
          left: 10
        },
        borderColor: '#e0e0e0',
        strokeDashArray: 4,
      }
    };
  }

  /**
   * Configura la interactividad del gráfico con eventos para actualizar las estadísticas
   */
  // configureChartInteractivity(): void {
  //   if (!this.chart || !this.chart.object) {
  //     return;
  //   }

  //   // Necesitamos agregar estos eventos manualmente ya que ApexCharts no los expone directamente
  //   const chart = this.chart.object;

  //   // Evento para seguimiento del cursor
  //   chart.addEventListener('mousemove', (event: any, chartContext: any, config: any) => {
  //     if (config && config.dataPointIndex >= 0 && config.seriesIndex >= 0) {
  //       // Obtener datos de la posición actual
  //       const dataPointIndex = config.dataPointIndex;
  //       const categories = this.chartOptions.xaxis?.categories;

  //       if (categories && categories.length > dataPointIndex) {
  //         // Actualizar estadísticas según la posición del cursor
  //         const week = categories[dataPointIndex];

  //         // Obtener valores con tipado seguro
  //         let ediValue = 0;
  //         let nonEdiValue = 0;

  //         // Acceder a los datos de las series de forma segura
  //         if (this.chartOptions.series &&
  //           this.chartOptions.series.length > 0 &&
  //           this.chartOptions.series[0] &&
  //           Array.isArray(this.chartOptions.series[0].data)) {
  //           const ediData = this.chartOptions.series[0].data[dataPointIndex];
  //           ediValue = typeof ediData === 'number' ? ediData : 0;
  //         }

  //         if (this.chartOptions.series &&
  //           this.chartOptions.series.length > 1 &&
  //           this.chartOptions.series[1] &&
  //           Array.isArray(this.chartOptions.series[1].data)) {
  //           const nonEdiData = this.chartOptions.series[1].data[dataPointIndex];
  //           nonEdiValue = typeof nonEdiData === 'number' ? nonEdiData : 0;
  //         }

  //         const total = ediValue + nonEdiValue;
  //         const compliance = total > 0 ? ((ediValue / total) * 100).toFixed(2) : '0.00';

  //         this.hoveredStats = {
  //           week,
  //           edi: ediValue,
  //           nonEdi: nonEdiValue,
  //           total,
  //           compliance: parseFloat(compliance)
  //         };
  //       }
  //     }
  //   });

  //   // Evento de zoom completado
  //   chart.addEventListener('zoomed', (chartContext: any, { xaxis, yaxis }: any) => {
  //     console.log('Área ampliada:', xaxis);
  //     // Aquí podrías actualizar algún otro componente o filtro basado en el zoom aplicado
  //   });

  //   // Evento de selección completada
  //   chart.addEventListener('selection', (chartContext: any, { xaxis, yaxis }: any) => {
  //     console.log('Área seleccionada:', xaxis);
  //     // Aquí podrías implementar alguna lógica para filtrar datos según la selección
  //   });
  // }

  /**
   * Inicializa las opciones del gráfico ApexCharts
   */
  initializeChartOptions(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true // Añadido botón de reset
          },
          autoSelected: 'zoom' // Zoom preseleccionado por defecto
        },
        animations: {
          enabled: true
        },
        events: {
          mouseMove: function(event, chartContext, config) {
            // Este evento se dispara cuando el mouse se mueve sobre el gráfico
          },
          click: function(event, chartContext, config) {
            // Se dispara cuando se hace clic en el gráfico
            console.log('Click en gráfico:', config);
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
          dataLabels: {
            position: 'top',
            maxItems: 100,
            hideOverflowingLabels: true
          }
        }
      },
      stroke: {
        width: [0, 3, 3], // Ancho 0 para barras, 3 para líneas
        curve: 'straight'
      },
      // Estados al pasar el mouse
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.15
          }
        }
      },
      // Configuración para legendas
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      },
      // Configuración para tooltip
      tooltip: {
        shared: true,
        intersect: false
      },
      // Configuración para etiquetas de datos
      dataLabels: {
        enabled: true
      },
      // Configuración para anotaciones
      annotations: {
        yaxis: []
      },
      // Configuración para múltiples ejes Y
      yaxis: [{
        title: {
          text: "Porcentaje (%)"
        },
        min: 0,
        max: 100
      }],
      // Configuración para eje X
      xaxis: {
        categories: [],
        title: {
          text: "Semana"
        }
      }
    };
  }

  /**
   * Ver detalle de un registro específico
   * @param anio Año del registro
   * @param semana Semana del registro
   * @param idCliente ID del cliente
   */
  verDetalle(anio: number, semana: number, idCliente: number): void {
    console.log('Ver detalle para:', { anio, semana, idCliente });
    // Aquí se implementará la lógica para mostrar el detalle
    // Puede ser navegar a otra ruta o abrir un diálogo con más información

    // Creamos un objeto con el formato que espera la API utilizando la clase correcta
    const parametros = new ParametrosGenerales();
    parametros.idCompania = this.idCompania;

    this.apiEdiTools.getKpiDataByIdCliente(parametros, idCliente, anio, semana).subscribe((response) => {
      console.log(response);

      // this.storageService.changeItem(response);

      const dataForModal = {
        ...response, //item seleccionado en la tabla
        TITULO_MODAL: 'Roles',  // titulo para el modal
        TIPO_MODAL: 'DETAIL'
      };

      const dialogRef = this.dialog.open(ModalSemiCrudKpiComponent, {
        width: '1000px',
        data: dataForModal // Pasa el objeto extendido
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadKpiData();
      });

    });

  }


  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'KPI DETALLE',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(ModalSemiCrudKpiComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadKpiData();
    });
  }

}