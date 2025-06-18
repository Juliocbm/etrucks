import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ApiFacturasService } from '../../Services/data-access';
import { TraficoGuia } from '../../Models/TraficoGuia';
import { BsCustomDates } from 'ngx-bootstrap/datepicker/themes/bs/bs-custom-dates-view.component';
/* import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker'; */
import { Cliente } from '../../Models/Cliente';
import { Observable, map, startWith } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DescargaRegistro } from '../../Interfaces/DescargaRegistro';
import { AuthService } from 'src/app/security/services/auth.service';
import { AlertService } from 'src/app/Services/alerts.service';

@Component({
  selector: 'app-descarga-documentos-fiscales',
  templateUrl: './descarga-documentos-fiscales.component.html',
  styleUrls: ['./descarga-documentos-fiscales.component.css']
})
export class DescargaDocumentosFiscalesComponent {

  /* Descarga de evidencias POD */
  displayedColumnsDescargasPod: string[] = ['id', 'nombreCliente', 'fechaInicio', 'fechaFin', 'progreso', 'urlDescarga'];
  descargasPod: DescargaRegistro[] = [];

  displayedColumnsPod: string[] = ['numGuia', 'estatusGuia', 'estatusPod'];
  datosPod: TraficoGuia[] = [];
  listGuias: string[] = [];

  isLoadingPod: boolean = false;

  get isDataEmptyPod(): boolean {
    return this.datosPod && this.datosPod.length === 0 && !this.isLoadingPod;
  }

  progressPod = 0;
  workerPod!: Worker;
  guiasPodCtrl = new FormControl();

  /* Descarga masiva de facturas */
  displayedColumnsDescargas: string[] = ['id', 'nombreCliente', 'fechaInicio', 'fechaFin', 'progreso', 'urlDescarga'];
  descargas: DescargaRegistro[] = [];

  displayedColumns: string[] = ['numGuia', 'uuid', 'fechaIngreso'];
  datos: TraficoGuia[] = [];

  isLoading: boolean = false;
  rangoFechas: FormGroup;
  fechaInicioSeleccionada: Date | null = null;
  fechaFinSeleccionada: Date | null = null;

  get isDataEmpty(): boolean {
    return this.datos && this.datos.length === 0 && !this.isLoading;
  }

  clienteCtrl = new FormControl();
  clientes: Cliente[] = []; // Asume que tienes una lista de clientes aquí
  clientesFiltrados: Observable<Cliente[]>;
  /*   bsConfigGeneral: Partial<BsDatepickerConfig>; */
  /*   maxDate: Date = new Date(); // Fecha máxima hoy
    minDate: Date = new Date(); // Fecha mínima 30 días atrás
   */

  @ViewChildren('filterInput') filterInputs!: QueryList<ElementRef>;
  progress = 0;
  worker!: Worker;
  constructor(private fb: FormBuilder, private apiFacturas: ApiFacturasService, public authService: AuthService, private alertService: AlertService) {

    /* Descarga de evidencias POD */
    if (typeof Worker !== 'undefined') {
      this.workerPod = new Worker('/assets/compress.worker.js');

      this.workerPod.onmessage = ({ data }) => {
        if (data.type === 'progress') {
          // Actualiza la barra de progreso
          const registro = this.descargasPod.find(d => d.id === data.id);
          console.log('registro', registro);
          if (registro) {
            registro.progreso = data.progress;
          }
        } else if (data.type === 'completed') {
          const url = window.URL.createObjectURL(data.content);

          const registro = this.descargasPod.find(d => d.id === data.id);
          if (registro) {
            registro.urlDescarga = url;
            // Formatear el nombre del archivo
            const fechaActual = registro.fechaInicio;
            const nombre = registro.nombreCliente.replace(/\s/g, '_');

            const nombreArchivo = `${nombre}_${this.formatDate(fechaActual)}.zip`;
            registro.nombreArchivo = nombreArchivo; // Asegúrate de tener la propiedad nombreArchivo en tu interfaz

            const link = document.createElement("a");
            link.href = url;
            link.download = registro.nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.isLoadingPod = false;
          }
        } else if (data.type === 'error') {
          // Maneja errores
          console.error('Error desde el worker:', data.error);
          this.isLoadingPod = false;
        } else if (data.type === 'log') {
          // Mensajes de log
          console.log(data.message);
        }
      };

    } else {
      console.error('Web Workers no están soportados en este navegador.');
    }

    /* Descarga masiva de facturas */
    // Inicializa el worker si los Web Workers son soportados
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('/assets/compress.worker.js');

      // En tu componente Angular
      this.worker.onmessage = ({ data }) => {
        if (data.type === 'error') {
          console.error('Error desde el worker:', data.error);
        }
        if (data.type === 'log') {
          console.log(data.message);
        }
        if (data.progress) {
          this.progress = data.progress; // Actualiza la barra de progreso
        }
        if (data.content) {
          // Crea una URL para el blob
          const url = window.URL.createObjectURL(data.content);

          // Crea un elemento <a> temporal
          const a = document.createElement('a');
          a.href = url;
          a.download = this.clienteCtrl.value.nombre + '.zip'; // El nombre que quieres que tenga el archivo descargado

          // Agrega el elemento <a> al DOM y haz clic en él
          document.body.appendChild(a);
          a.click();

          // Limpia y elimina el elemento <a> del DOM
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }; 
      this.worker.onmessage = ({ data }) => {
        if (data.type === 'progress') {
          // Actualiza la barra de progreso
          const registro = this.descargas.find(d => d.id === data.id);
          console.log('registro', registro);
          if (registro) {
            registro.progreso = data.progress;
          }
        } else if (data.type === 'completed') {
          const url = window.URL.createObjectURL(data.content);

          const registro = this.descargas.find(d => d.id === data.id);
          if (registro) {
            registro.urlDescarga = url;
            // Formatear el nombre del archivo
            const fechaInicio = registro.fechaInicio;
            const fechaFin = registro.fechaFin;
            const nombreCliente = registro.nombreCliente.replace(/\s/g, '_');

            const nombreArchivo = `${nombreCliente}_${this.formatDate(fechaInicio)}_al_${this.formatDate(fechaFin)}.zip`;
            registro.nombreArchivo = nombreArchivo; // Asegúrate de tener la propiedad nombreArchivo en tu interfaz

          }
        } else if (data.type === 'error') {
          // Maneja errores
          console.error('Error desde el worker:', data.error);
        } else if (data.type === 'log') {
          // Mensajes de log
          console.log(data.message);
        }
      };

    } else {
      console.error('Web Workers no están soportados en este navegador.');
    }

    this.rangoFechas = this.fb.group({
      start: [null],
      end: [null],
    });
    this.clientesFiltrados = this.clienteCtrl.valueChanges.pipe(
      map(cliente => cliente ? this._filtrarClientes(cliente) : this.clientes.slice())
    );
  }

  private formatDate(date: Date): string {
    if (!date) {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() es 0-index
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  private _filtrarClientes(value: string | Cliente): Cliente[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nombre.toLowerCase();

    return this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(filterValue) ||
      (cliente.idCliente !== undefined && cliente.idCliente.toString().includes(filterValue))
    );
  }

  displayFn(cliente: Cliente): string {
    return cliente && cliente.idCliente ? `${cliente.idCliente} - ${cliente.nombre}` : '';
  }

  ngOnInit(): void {

    //this.authService.validaPermiso(1039);

    this.isLoading = true;

    const currentDay = new Date();
    const minDay = new Date();
    minDay.setDate(minDay.getDate() - 30);

    this.rangoFechas.valueChanges.subscribe(fechas => {
      this.fechaInicioSeleccionada = fechas.start;
      this.fechaFinSeleccionada = fechas.end;
    });

    this.apiFacturas.obtenerClientes().subscribe(
      response => {
        this.clientes = response.map((cliente: { idCliente: number; nombre: string; rfc: string; }) => new Cliente(cliente.idCliente, cliente.nombre, cliente.rfc));

        this.isLoading = false;
      },
      error => {
        console.error('Ha ocurrido un error al obtener los datos', error);
        this.isLoading = false;
      }
    );
  }

  /* descargar() {
    console.log('Descargando datos...');
    if (this.worker) {
      console.log('envia a worker', this.datos);
      this.worker.postMessage(this.datos); // Envía las facturas al worker para procesar
    } else {
      console.error('No se pudo iniciar el worker.');
    }
  } */

  descargar(tipoDescarga: string): void {
    // ... código existente para iniciar la descarga...

    // Genera un ID único para esta descarga
    const descargaId = this.generarIdUnico();

    if ( tipoDescarga == 'desFacturas' && this.fechaInicioSeleccionada && this.fechaFinSeleccionada) {
      
        const nuevoRegistro: DescargaRegistro = {
          id: descargaId,
          nombreArchivo: '',
          nombreCliente: this.clienteCtrl.value.nombre,
          fechaInicio: this.fechaInicioSeleccionada,
          fechaFin: this.fechaFinSeleccionada,
          progreso: 0,
          urlDescarga: undefined
        };

        this.descargas = [...this.descargas, nuevoRegistro];

        console.log('array descargas', this.descargas);

        this.worker.postMessage({
          id: descargaId,
          tipoDescarga: 'desFacturas',
          facturas: this.datos,
          fechaInicio: this.fechaInicioSeleccionada,
          fechaFin: this.fechaFinSeleccionada
        });
    }
    else if (tipoDescarga == 'desEvidencias' && this.datosPod.length > 0) {
      const nuevoRegistro: DescargaRegistro = {
        id: descargaId,
        nombreArchivo: '',
        nombreCliente: 'FACTURAS_EVIDENCIAS',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        progreso: 0,
        urlDescarga: undefined
      };

      this.descargasPod = [...this.descargasPod, nuevoRegistro];

      console.log('array descargas', this.descargasPod);
      console.log('DATOS POD', this.datosPod);

      this.workerPod.postMessage({
        id: descargaId,
        tipoDescarga: 'desEvidencias',
        facturas: this.datosPod,
        fechaInicio: this.fechaInicioSeleccionada,
        fechaFin: this.fechaFinSeleccionada
      });
    }

    console.log('array descargas', this.descargas);
  }

  descargarPods() : void {
    // Validar aqui que se haya ingresado por lo menos una guia, despues de aplicar el formato para convertirlo en arreglo
    if (!this.isLoadingPod) {

      this.listGuias = this.guiasPodCtrl.value.split('\n');
      this.listGuias = this.listGuias.filter(v => v !== ""); 
      
      // La funcion descargar() se ejecutara despues de que la peticion se haya hecho de forma correcta
      console.log(this.guiasPodCtrl.value);
      this.getFacturasByNumGuias(this.listGuias);
    }
  }

  limpiar(tipoDescarga: string) : void {

    if (tipoDescarga == 'desEvidencias') {
      this.guiasPodCtrl = new FormControl();
      this.listGuias = [];
      this.datosPod = [];
      this.descargasPod = [];
    }
  }

  private generarIdUnico(): string {
    return Date.now().toString(); // Ejemplo simple, considera algo más robusto si es necesario
  }


  submit() {
    /* console.log('clienteSelected', this.clienteCtrl.value);
    console.log('fechaIni', this.fechaInicioSeleccionada);
    console.log('fechaFin', this.fechaFinSeleccionada); */

    if (this.fechaInicioSeleccionada && this.fechaFinSeleccionada) {
      const fechas: (Date | undefined)[] = [this.fechaInicioSeleccionada, this.fechaFinSeleccionada];
      this.getFacturasByDate(this.clienteCtrl.value.idCliente, fechas);
    }
  }

  getFacturasByDate(idCliente: number, fechas?: (Date | undefined)[]): void {
    this.isLoading = true;
    if (fechas && fechas[0] && fechas[1]) {
      this.apiFacturas.obtenerFacturas(idCliente, fechas[0], fechas[1]).subscribe(
        facturas => {
          this.datos = facturas;
          /*   console.log(this.datos); */
          this.isLoading = false;
        },
        error => {
          console.error('Ha ocurrido un error al obtener los datos', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('Las fechas de inicio y fin son necesarias');
      this.isLoading = false;
    }
  }

  getFacturasByNumGuias(numGuias: string[]): void {
    this.isLoadingPod = true;
    if (numGuias.length > 0) {
      this.apiFacturas.obtenerFacturasByNumGuias(numGuias).subscribe(
        facturas => {
          this.datosPod = facturas;
          
          if (this.datosPod.length == 0) {
            this.alertService.info('No se encontraron facturas por descargar');
            return;
          }
          this.alertService.info('Descargando facturas...');
          this.descargar('desEvidencias');
        },
        error => {
          console.error('Ha ocurrido un error al obtener los datos', error);
          this.alertService.error('Ocurrio un error al descargar las facturas');
          this.isLoadingPod = false;
        }
      );
    } else {
      console.error('No se ingresaron guias por descargar');
      this.isLoadingPod = false;
    }
  }
}

