import { Component, OnInit } from '@angular/core';
import { ApiOperadoresApiService } from 'src/app/DataAccess/OperadorApp/api-operadores-api.service';
import { Bitacora } from 'src/app/models/Serv. Cliente/Bitacora';
import { ElementoDetalle } from 'src/app/models/SistemaGeneral/ElementoDetalle';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableAction } from 'src/app/shared-module/Interfaces/TableAction';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { CatalogoGeneralService } from 'src/app/sistema-general/services/catalogo-general.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarBitacoraComponent } from '../editar-bitacora/editar-bitacora.component';
import { CrearBitacoraComponent } from '../crear-bitacora/crear-bitacora.component';
import { VerBitacoraComponent } from '../ver-bitacora/ver-bitacora.component';
import { StorageService } from 'src/app/Services/StorageService';
import { Routes } from 'src/app/app-routes.constants';
import * as XLSX from 'xlsx';
import { Flotas } from 'src/app/models/Serv. Cliente/Flotas';


@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit {
  nombre: string = localStorage.getItem('nombre') || '';
  public idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '0');
  createRoute: string = Routes.bitacora.create();

  columnConfigs: { [key: string]: ColumnConfig } = {
    idPeriodo: { displayName: 'Periodo', type: 'default', showFilter: true, visible: true },
    nombreOperador: { displayName: 'Operador', type: 'default', showFilter: true, visible: true },
    // idFlota: { displayName: 'Flota', type: 'default', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
    idUnidad: { displayName: 'Unidad', type: 'default', showFilter: true, visible: true },
    estatus: { displayName: 'Estatus', type: 'default', showFilter: true, visible: true },
    turno: { displayName: 'Turno', type: 'default', showFilter: true, visible: true },
    idCliente: { displayName: 'Cliente', type: 'default', showFilter: true, visible: true },
    activo: { displayName: 'Activo', type: 'boolean', trueValue: 'Activo', falseValue: 'Inactivo', showFilter: true, visible: true },
    fechaModificacion: { displayName: 'Fecha Modificado', type: 'date', format: 'dd/MM/yyyy hh:mm', showFilter: true, startDate: null, endDate: null, visible: true },
    usuarioModificadoPor: { displayName: 'Modificado Por', type: 'default', showFilter: true, visible: true }
  };
  tableActions: TableAction[] = [
    {
      name: 'ver',
      title: 'Ver',
      icon: 'visibility',
      tooltip: 'Ver detalle',
      callback: (item) => this.onDetailClick(item)
    }
  ];
  tableConfigs: TableConfig =
    {
      pageSizeOptions: [5, 15, 30],
      headerColumFontSize: 5,
      createCallback: (item) => this.onCreateClick()
    };

  datos: Bitacora[] = [];
  showAlert = false;
  alertMessage = '';
  alertType = '';
  datosFiltrados: Bitacora[] = [];
  registrosPadre: Bitacora[] = [];
  todosLosRegistros: Bitacora[] = [];
  idCatPadre: string = '';
  isLoading: boolean = false;

  private flotaSeleccionada: number = 0;
  public flotaNombre: string = '';
  private flota: Flotas = new Flotas();

  periodo: any;
  cliente: any[] = [];

  constructor(
    private apiService: ApiOperadoresApiService,
    private catGeneralService: CatalogoGeneralService,
    private storageService: StorageService<Bitacora>,
    public dialog: MatDialog
  ) {
    this.catGeneralService.regGeneralSourceActual.subscribe((registro) => {
      this.idCatPadre = registro.idCatGeneral;
    });

    this.idCompania = parseInt(localStorage.getItem('CompaniaSelect') || '0');
    // console.log('idCompania', this.idCompania);
  }

  ngOnInit(): void {
    this.storageService.init('bitacoraActual');

    // Verifica si hay un valor guardado en localStorage con la clave 'flotaSeleccionada'
    const flotaSeleccionada = localStorage.getItem('flotaSeleccionada');
    console.log('flotaSeleccionada oninit => ', flotaSeleccionada);
    this.flotaNombre = 'Flota Seleccionada';
    // console.log('local storage flota',flotaSeleccionada)
    if (flotaSeleccionada) {
      const flotaObj = JSON.parse(flotaSeleccionada);
      this.flotaSeleccionada = flotaObj.idFlota;
      // Si existe un valor en localStorage, llama a la función para recuperar los datos
      this.flotaSeleccionada = flotaObj.idFlota;
      this.retriveData(flotaObj);
    } else {
      // Si no hay valor en localStorage, abre el diálogo para que el usuario seleccione una flota
      this.openDialog();
    }

    // También puedes llamar a otras funciones aquí si es necesario
    this.GetDatosCliente();
    this.getDatosPeriodo();
  }

  openDialog() {
    console.log('flota seleccionadaaaaaaaaaaaaaa', this.flotaSeleccionada);
    const dialogRef = this.dialog.open(EditarBitacoraComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el usuario selecciona una flota en el diálogo, guarda el valor en localStorage
        this.flotaSeleccionada = result.idFlota;
        this.retriveData(result);
       // localStorage.setItem('flotaSeleccionada', JSON.stringify(result));
        console.log('Flota seleccionada - open dialog', JSON.stringify(result));

        this.flota = result as Flotas;
      }
    });
  }

  GetDatosCliente() {
    this.apiService.obtenerCatalogosGeneralCliente(this.idCompania).subscribe((data) => {
      this.cliente = data;
    });
  }

  retriveData(flota: any) {
    this.isLoading = true;

    this.apiService.obtenerDatos().subscribe(
      (data) => {
      this.datos = data.filter((x: Bitacora) => x.idFlota === flota.idFlota && x.idCompania === this.idCompania);
      this.datosFiltrados = [...this.datos]; // Create a copy of the filtered data

      if (this.datos.length === 0) {
        this.triggerAlert('No hay registros para mostrar', 'info');
      } else {
        // Renombrar el campo de la flota
        this.datos.forEach((element) => {
          element.idFlota = flota.nombre;
        });
        this.datosFiltrados.forEach((element) => {
          element.idFlota = flota.nombre;
        });

        // Renombrar el nombre del Cliente
        this.datos.forEach((element) => {
          const cliente = this.cliente.find((x: any) => x.idCliente === element.idCliente);
          element.idCliente = cliente?.nombre;
        });

        this.flotaNombre = flota.nombre;
      }

      this.isLoading = false;
    },
    ((error) => {
      this.triggerAlert('No hay registros para mostrar', 'info');
      this.isLoading = false;
      console.log('Error al obtener flotas', error);
    })
    );
  }

  onCreateClick() {
    // Validad que el periodo este activo dentro del rango de fechas de FechaIni y FechaFin
    const fechaActual = new Date();
    const fechaIni = new Date(this.periodo.fechaIni);
    const fechaFin = new Date(this.periodo.fechaFin);
    fechaFin.setHours(23, 59, 59); // Set the time to the end of the day (23:59:59)

    console.log (fechaActual, fechaIni, fechaFin)

    if (fechaActual < fechaIni || fechaActual > fechaFin) {
      const formattedFechaIni = fechaIni.toLocaleDateString();
      const formattedFechaFin = fechaFin.toLocaleDateString();
      const periodo = this.periodo.idConsecutivo.toString();
      const message = `No existe periodo para la fecha actual.\nUltimo Periodo: ${periodo} => ${formattedFechaIni} - ${formattedFechaFin}`;
      this.MostrarAlerta(message, 'error');
      return;
    }

    const dataForModal = {
      DATA: this.flota,
      TITULO_MODAL: 'Crear Bitacora',  // titulo para el modal
      TIPO_MODAL: 'CREATE'
    };

    const dialogRef = this.dialog.open(CrearBitacoraComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto específico para creación
    });

    dialogRef.afterClosed().subscribe(result => {
      this.openDialog();
    });
  }

  onDetailClick(rowData: any) {
    this.storageService.changeItem(rowData);
    console.log('rowData', rowData);

    const dataForModal = {
      ...rowData, //item seleccionado en la tabla
      TITULO_MODAL: 'Roles',  // titulo para el modal
      TIPO_MODAL: 'DETAIL'
    };

    const dialogRef = this.dialog.open(VerBitacoraComponent, {
      width: '1000px',
      data: dataForModal // Pasa el objeto extendido
    });

    dialogRef.afterClosed().subscribe(result => {
      this.openDialog();
    });
  }

  exportarExcel(): void {
    // Estatus de bitácoras
    const estatus = 'DFF6AE99-5EF9-4ECD-BAD1-4D9DFCD69D8C'; // Estatus de bitácoras

    console.log('datosFiltrados', this.datosFiltrados.length);

    // Agrupar datos por idUnidad
    const groupedData = this.groupBy(this.datosFiltrados, 'idUnidad');

    // Realiza distinct en los datos agrupados sobre bitacoraMovs
    const uniqueData = this.getUniqueData(groupedData);

    console.log('datos agrupados por idUnidad', groupedData);
    console.log('datos unicos', uniqueData);

    // Validar si no hay registros en groupedData
    if (Object.keys(groupedData).length === 0) {
      this.MostrarAlerta('No hay registros para exportar', 'error');
      return;
    }

    // Crear un libro de Excel
    const wb = XLSX.utils.book_new();

    // Por cada idUnidad, crear una hoja de Excel
    for (const idUnidad in groupedData) {
      if (groupedData.hasOwnProperty(idUnidad)) {
        const flattenedData = this.flattenData(groupedData[idUnidad]);

        // Validar si no hay registros en flaatenedData
        if (flattenedData.length === 0) {
          continue;
        }

        const ws = XLSX.utils.json_to_sheet(flattenedData);
        XLSX.utils.book_append_sheet(wb, ws, idUnidad);
      }
    }

    // Formato de nombre del archivo de Excel (BitMov_ddmm_ddmmFinal_idPeriodo_año_idUnidad.xlsx )
    const ddMm = this.periodo.fechaIni.toString().substring(5, 10).replace('-', '');
    const ddmmFinal = this.periodo.fechaFin.toString().substring(5, 10).replace('-', '');
    const periodo = this.periodo.idConsecutivo.toString();
    const yy = new Date().getFullYear().toString().substring(2, 4);

    // Formato de nombre del archivo de Excel (Bitacora_flotaNombre.xlsx)
    const fileName = `BitMov_${ddMm}_${ddmmFinal}_${periodo}_${yy}_${this.datosFiltrados[0].idUnidad}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }

  // Función para exportar los datos de la tabla a un archivo de Excel
  getUniqueData(groupedData: any) {
    const uniqueData = new Map();
    for (const idUnidad in groupedData) {
      if (groupedData.hasOwnProperty(idUnidad)) {
        const flattenedData = this.flattenData(groupedData[idUnidad]);
        uniqueData.set(idUnidad, flattenedData);
      }
    }
    return uniqueData;
  }

  // Función para exportar los datos de la tabla a un archivo de Excel
  private flattenData(data: any[]): any[] {
    const flattenedData: any[] = [];

    data.forEach(bit => {
      const bitacoraMovs = bit.bitacoraMovs;
      if (bitacoraMovs && bitacoraMovs.length > 0) {
        // Para cada movimiento en la bitácora, crear una sola fila
        bitacoraMovs.forEach((bitacoraMov: any) => {
          // Contar checkLists completados para información adicional
          const checkListsCompletados = bitacoraMov.bitacoraMovCheckLists ? 
            bitacoraMov.bitacoraMovCheckLists.filter((check: any) => check.realizado).length : 0;
          const totalCheckLists = bitacoraMov.bitacoraMovCheckLists ? 
            bitacoraMov.bitacoraMovCheckLists.length : 0;
          
          // Crear un solo objeto para este movimiento
          const flattenedItem = {
            Bitacora: bit.idBitacora,
            Periodo: bit.idPeriodo,
            Inicio_Sem: this.periodo.fechaIni,
            Fin_Sem: this.periodo.fechaFin,
            Unidad: bit.idUnidad,
            NoMovimiento: bitacoraMov.idBitacoraMov,
            // Operador: bit.nombreOperador,
            Turno: bit.turno,
            Cliente: bit.idCliente,
            KmIniciales: bit.kmIniciales,
            KmFinales: bit.kmFinales,
            HoraIniciales: bit.horaIniciales,
            HoraFinales: bit.horaFinales,
            FechaCreacion: bit.fechaCreacion,
            EstatusMov: bitacoraMov.estatus,
            Solicitante: bitacoraMov.solicitante,
            NoCaja: bitacoraMov.noCaja,
            RampaOrigen: bitacoraMov.rampaOrigen,
            RampaDestino: bitacoraMov.rampaDestino,
            CajaDescripcion: bitacoraMov.cajaDescripcion,
            HoraInicialMov: bitacoraMov.horaInicial,
            HoraFinalMov: bitacoraMov.horaFinal,
            Observacion: bitacoraMov.observacion,
            CheckListsCompletados: `${checkListsCompletados}/${totalCheckLists}`
          };
          
          flattenedData.push(flattenedItem);
        });
      }
    });

    return flattenedData;
  }

  private groupBy(array: any[], key: string): any {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }

  // Periodo seleccionado
  getDatosPeriodo() {
    this.apiService.obtenerCatalogosGeneralPeriodo(this.idCompania).subscribe((data) => {
      this.periodo = data;
      // console.log('periodo', this.periodo);
    });
  }


  cambiarEstado(elemento: ElementoDetalle) {

  }

  // Esta función se llama para mostrar la alerta
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  MostrarAlerta(message: string, type: string): void {
    alert(message);
  }

}
