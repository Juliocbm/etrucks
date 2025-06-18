import { FormBuilder } from '@angular/forms';
import { ArchivoMoper } from './../../../models/RH/Moper';
import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiRhService } from 'src/app/DataAccess/api-rh.service';
import { ColumnConfig } from 'src/app/shared-module/Interfaces/ColumnConfig';
import { TableConfig } from 'src/app/shared-module/Interfaces/TableConfig';
import { environment } from 'src/app/environments/environment';
import { ApiServiceHandler } from 'src/app/DataAccess/apiServiceHandler';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from 'src/app/shared-module/components/confirmation-modal/confirmation-modal.component';
import { ExportTableCsvService } from 'src/app/shared-module/services/export-table-csv.service';

@Component({
  selector: 'app-rep-moper',
  templateUrl: './rep-moper.component.html',
  styleUrls: ['./rep-moper.component.css']
})
export class RepMoperComponent implements OnInit {

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: [''],
  });
  FileNameConfirmacion: string = '';
  FileNameMopper: string = '';

  // Alertas
  showAlert = false;
  alertMessage = '';
  alertType = '';

  // Datos de la tabla del reporte Moper
  public datosMoper: any[] = [];
  isLoading: boolean = false;
  idCompania: number = Number(localStorage.getItem('CompaniaSelect'))??0;

  // Carga de archivos
  // UrlFile: string = environment.API_URL_COBRANZA + 'upload';
  UrlFile: string = 'https://localhost:44310/api/Odessa/' + 'CargaDescuentos' + '?idCompania=' + this.idCompania;
  fileReturned: File | null = null;
  datosMoperSinCuentaB: any[] = [];
  datosMoperNoCuentaConCuentaB: any[] = [];
  datosResponse: any[] = [];

  datosPorConfirmar: any[] = [];

  // Index Stepper
  indexStepper: number = 0;

  // Columnas de la tabla de datos por confirmar
  // columngConfigPendientes: { [key: string]: ColumnConfig } = {
  //   _2: { displayName: '2', type: 'number', showFilter: false, visible: true },
  //   idx: { displayName: 'Orden', type: 'number', showFilter: false, visible: true },
  //   id_personal: { displayName: 'ID', type: 'number', showFilter: true, visible: true },
  //   _0: { displayName: '0', type: 'number', showFilter: false, visible: true },
  //   ca_empresa: { displayName: 'Empresa', type: 'number', showFilter: true, visible: true },
  //   fecha: { displayName: 'Fecha', type: 'default', format: 'dd/MM/yyyy', showFilter: true, visible: true },
  //   clave: { displayName: 'Clave', type: 'default', showFilter: true, visible: true },
  //   montoReal: { displayName: 'Monto Real', type: 'default', showFilter: true, visible: false },
  //   monto: { displayName: 'Monto', type: 'default', showFilter: true, visible: true },
  //   _00: { displayName: '00', type: 'number', showFilter: false, visible: true },
  //   _1: { displayName: '1', type: 'number', showFilter: false, visible: true },
  //   periodo: { displayName: 'Periodo', type: 'default', showFilter: true, visible: true }
  // };

  // Columnas de la tabla de datos por confirmar - RH
  columngConfigPendientes: { [key: string]: ColumnConfig } = {
    x: { displayName: '2', type: 'number', showFilter: false, visible: true },
    id: { displayName: 'Orden', type: 'number', showFilter: false, visible: true },
    idPersonal: { displayName: 'ID', type: 'number', showFilter: true, visible: true },
    nullReference: { displayName: '0', type: 'number', showFilter: false, visible: true },
    empresa: { displayName: 'Empresa', type: 'number', showFilter: true, visible: true },
    fecha: { displayName: 'Fecha', type: 'default', format: 'dd/MM/yyyy', showFilter: true, visible: true },
    clave: { displayName: 'Clave', type: 'default', showFilter: true, visible: true },
    monto: { displayName: 'Monto Real', type: 'default', showFilter: true, visible: false },
    // monto: { displayName: 'Monto', type: 'default', showFilter: true, visible: true },
    nullCampo: { displayName: '00', type: 'number', showFilter: false, visible: true },
    noReference: { displayName: '1', type: 'number', showFilter: false, visible: true },
    periodo: { displayName: 'Periodo', type: 'default', showFilter: true, visible: true },
    idCompania: { displayName: 'Compania', type: 'number', showFilter: true, visible: false }
  };

  columnConfig: { [key: string]: ColumnConfig } = {
    _01: { displayName: '1', type: 'number', showFilter: false, visible: true },
    registro: { displayName: 'REGISTRO', type: 'number', showFilter: false, visible: true },
    socio: { displayName: 'SOCIO', type: 'number', showFilter: true, visible: true },
    campO4: { displayName: 'CAMPO4', type: 'number', showFilter: true, visible: true },
    empresa: { displayName: 'EMPRESA', type: 'number', showFilter: true, visible: true },
    planta: { displayName: 'PLANTA', type: 'number', showFilter: true, visible: true },
    c_DEPTO: { displayName: 'C_DEPTO', type: 'number', showFilter: true, visible: true },
    nombre: { displayName: 'NOMBRE', type: 'default', showFilter: true, visible: true },
    paterno: { displayName: 'PATERNO', type: 'default', showFilter: true, visible: true },
    materno: { displayName: 'MATERNO', type: 'default', showFilter: true, visible: true },
    f_NACIM: { displayName: 'F_NACIM', type: 'default', showFilter: true, visible: true },
    sexo: { displayName: 'SEXO', type: 'default', showFilter: true, visible: true },
    e_CIVIL: { displayName: 'E_CIVIL', type: 'default', showFilter: true, visible: true },
    i_GRUPO: { displayName: 'I_GRUPO', type: 'default', showFilter: true, visible: true },
    i_EMPRESA: { displayName: 'I_EMPRESA', type: 'default', showFilter: true, visible: true },
    f_PAGO: { displayName: 'F_PAGO', type: 'default', showFilter: true, visible: true },
    t_TRAB: { displayName: 'T_TRAB', type: 'default', showFilter: true, visible: true },
    r_PAGO: { displayName: 'R_PAGO', type: 'default', showFilter: true, visible: true },
    banco: { displayName: 'BANCO', type: 'default', showFilter: true, visible: true },
    cuentA_B: { displayName: 'CUENTA_B', type: 'default', showFilter: true, visible: true },
    ctA_CLABE: { displayName: 'CTA_CLABE', type: 'default', showFilter: true, visible: true },
    s_MENSUAL: { displayName: 'S_MENSUAL', type: 'default', showFilter: true, visible: true },
    s_NETO: { displayName: 'S_NETO', type: 'default', showFilter: true, visible: true },
    aguinaldo: { displayName: 'AGUINALDO', type: 'default', showFilter: true, visible: true },
    primA_V: { displayName: 'PRIMA_V', type: 'default', showFilter: true, visible: true },
    ptu: { displayName: 'PTU', type: 'default', showFilter: true, visible: true },
    fondO_AH: { displayName: 'FONDO_AH', type: 'default', showFilter: true, visible: true },
    prestA_FA: { displayName: 'PRESTA_FA', type: 'default', showFilter: true, visible: true },
    imss: { displayName: 'IMSS', type: 'default', showFilter: true, visible: true },
    rfc: { displayName: 'RFC', type: 'default', showFilter: true, visible: true },
    curp: { displayName: 'CURP', type: 'default', showFilter: true, visible: true },
    email: { displayName: 'EMAIL', type: 'default', showFilter: true, visible: true },
    c_SUC: { displayName: 'C_SUC', type: 'default', showFilter: true, visible: true },
    n_SUC: { displayName: 'N_SUC', type: 'default', showFilter: true, visible: true },
    n_DEPTO: { displayName: 'N_DEPTO', type: 'default', showFilter: true, visible: true },
    jefE_I: { displayName: 'JEFE_I', type: 'default', showFilter: true, visible: true },
    d_CALLE: { displayName: 'D_CALLE', type: 'default', showFilter: true, visible: true },
    d_NUME: { displayName: 'D_NUME', type: 'default', showFilter: true, visible: true },
    d_NUMI: { displayName: 'D_NUMI', type: 'default', showFilter: true, visible: true },
    d_COL: { displayName: 'D_COL', type: 'default', showFilter: true, visible: true },
    d_MUN: { displayName: 'D_MUN', type: 'default', showFilter: true, visible: true },
    d_EDO: { displayName: 'D_EDO', type: 'default', showFilter: true, visible: true },
    d_PAIS: { displayName: 'D_PAIS', type: 'default', showFilter: true, visible: true },
    d_CP: { displayName: 'D_CP', type: 'number', showFilter: true, visible: true },
    parcialidad: { displayName: 'PARCIALIDAD', type: 'default', showFilter: true, visible: true },
    aniversario: { displayName: 'ANIVERSARIO', type: 'default', showFilter: true, visible: true },
    p_PANIV: { displayName: 'P_PANIV', type: 'default', showFilter: true, visible: true },
  }

  columnConfigResponse: { [key: string]: ColumnConfig } = {
    id_personal: { displayName: '#', type: 'default', showFilter: true, visible: true },
    nombre: { displayName: 'Personal', type: 'default', showFilter: true, visible: true },
    // id_caja: { displayName: 'Id', type: 'number', showFilter: false, visible: true },
    id_tipo_caja: { displayName: 'Tipo Caja', type: 'number', showFilter: false, visible: true },
    num_caja: { displayName: 'Num Caja', type: 'default', showFilter: true, visible: true },
    descripcion: { displayName: 'Descripcion', type: 'default', showFilter: true, visible: true },
    fecha_caja: { displayName: 'Fecha Caja', type: 'date', format:'dd/MM/yyyy hh:mm' , showFilter: true, visible: true },
    status_caja: { displayName: 'Status', type: 'default', showFilter: true, visible: true },
    monto_caja: { displayName: 'Monto Caja', type: 'default', showFilter: true, visible: true },
    monto_caja_origen: { displayName: 'Monto Caja Origen', type: 'number', showFilter: true, visible: true },
    id_area: { displayName: 'Area', type: 'number', showFilter: true, visible: true },
    id_ingreso: { displayName: 'Ingreso', type: 'number', showFilter: true, visible: true },
    fecha_ingreso: { displayName: 'Fecha Ingreso', type: 'date', format:'dd/MM/yyyy hh:mm', showFilter: true, visible: true },
    periodo: { displayName: 'Periodo', type: 'default', showFilter: true, visible: true }
  }



  tableConfigs: TableConfig =
  {
    pageSizeOptions: [7, 10, 25],
    headerColumFontSize: 8
  };

  modalRef?: BsModalRef;
  constructor(
    private apiRhService: ApiRhService,
    private apiHandler: ApiServiceHandler,

    private csvService: ExportTableCsvService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.obtenerDatosMoperYConfirmacion();
  }


  // Obtener Datos de Confirmacion y Moper
  async obtenerDatosMoperYConfirmacion() {
    this.isLoading = true;
    // this.apiRhService.obtenerDatosPendientesDeConfirmar().subscribe((data) => {
    //   console.log('confirmacion', data);
    // })

    // this.apiRhService.obtenerDatosMoper().subscribe((data) => {
    //   console.log('moper', data);
    // })

    // this.isLoading = false;

    forkJoin([
      this.apiHandler.getDatosAsync(() => this.apiRhService.obtenerDatosPendientesDeConfirmar(), 'confirmacion'),
      this.apiHandler.getDatosAsync(() => this.apiRhService.obtenerDatosMoper(), 'moper'),
    ]).subscribe(([confirmacion,  moper]) => {
      this.isLoading = false;
      this.datosPorConfirmar = confirmacion;
      this.datosMoper = moper;

      // Nombre de archivo
      // this.FileNameConfirmacion = this.generarNombreArchivo(1, this.datosPorConfirmar[0].ca_empresa); // Confirmacion
      // this.FileNameMopper = this.generarNombreArchivo(0, this.datosMoper[0].empresa); // Moper

      this.FileNameConfirmacion = this.generarNombreArchivo(1, this.datosPorConfirmar[0].empresa);
      this.FileNameMopper = this.generarNombreArchivo(0, this.datosMoper[0].empresa);

      // Imprimir datos del nombre de los archivos
      console.log('confirmacion', this.FileNameConfirmacion);
      console.log('moper', this.FileNameMopper);

      // Moper
      this.datosMoperSinCuentaB = this.datosMoper.filter((item) => !item.cuentA_B) ; // Filtrar datos sin cuenta bancaria Moper

      if (this.datosMoperSinCuentaB.length > 0) {
        alert('Hay registros de personal sin cuenta bancaria: ' + this.datosMoperSinCuentaB.length);
      }
    });
  }

  openConfirmationModal(): void {

    // Validamos si hay datos por confirmar
    if (this.datosPorConfirmar.length === 0) {
      this.showAlertMessage('No hay datos por confirmar', 'warning');

      // Configurar mensaje del modal
      const initialState = {
        title: 'Confirmación',
        message: 'No hay datos por confirmar',
        confirmText: 'Aceptar',
        declineText: 'Cancelar',
        buttons: false
      };

      // Abrir el modal
      this.modalRef = this.modalService.show(ConfirmationModalComponent, {
        initialState,
        class: 'modal-dialog-centered',
      });

    }
    else {
      // Configurar mensaje del modal
      const initialState = {
        title: 'Confirmación',
        message: `Estás a punto de confirmar ${this.datosPorConfirmar.length} descuentos. ¿Deseas continuar?`,
        confirmText: 'Sí',
        declineText: 'No',
        buttons: true,
        onConfirm: () => this.confirmarDatosPendientes(),
        onDecline: () => this.showAlertMessage('Operación de confirmación cancelada', 'danger'),
      };

      // Abrir el modal
      this.modalRef = this.modalService.show(ConfirmationModalComponent, {
        initialState,
        class: 'modal-dialog-centered',
      });
    }
  }

  // Confirmar datos pendientes (idCompania: number, archivoConfirmacion: string)
  async confirmarDatosPendientes() {
    this.isLoading = true;
    this.apiRhService.confirmarAdeudos(this.idCompania, this.FileNameConfirmacion + '.csv').subscribe((response) => {
      console.log('Response from server:', response);
      this.showAlertMessage('Datos confirmados correctamente', 'success');
      this.isLoading = false;

      // Exportar datos a CSV
      this.exportTableCSV();

      // Actualizar datos
      this.obtenerDatosMoperYConfirmacion();
    },
    (error: any) => {
      // console.log('Error al confirmar los datos:', error);
      this.showAlertMessage('Error al confirmar los datos:' + error, 'danger');
      this.isLoading = false;
    });
  }

  onFileUploaded(files: File[]) {
    this.fileReturned = files[0];  // Si necesitas solo el primer archivo
    // console.log("Files received from child component:", files);
  }

  onResponseFile(response: any) {
    console.log('Response from server:', response);
    this.datosResponse = response;
  }

  // Función para mostrar alertas
  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  // Generar nombre de archivo
  generarNombreArchivo(proceso: number, companyNumber: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const comodin1 = "MP"; // Moper
    const comodin2 = "CN"; // Confirmar adeudos
    const comodinFinal = "CA"; // Final

    // Calcular la semana del año
    const startOfYear = new Date(year, 0, 1);
    const week = `S${Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)}`;

    const extension = "csv";

    // Generar nombre de archivo según el proceso
    switch (proceso) { // Proceso 0: Moper, Proceso 1: Confirmar adeudos
      case 0:
        return `${year}${month}${day}${comodin1}${companyNumber}${week}${comodinFinal}`;

      case 1:
        // Aquí puedes cambiar el formato según el requerimiento para el proceso 1
        return `${year}${month}${day}${comodin2}${companyNumber}${week}${comodinFinal}`;

      default:
        return "Error: Proceso no válido";
    }
  }

  exportTableCSV() {
    this.csvService.exportToCsv(this.datosPorConfirmar, this.FileNameConfirmacion, false);
  }

}
