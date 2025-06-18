import { BitacoraMovCheckList } from './../../../models/Serv. Cliente/Bitacoras/BitacoraMovCheckList';
import { Component, Inject, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiSistemaGeneralService } from 'src/app/DataAccess/api-sistema-general.service';
import { ServCliService } from '../../serv-cli.service';
import { ApiOperadoresApiService } from 'src/app/DataAccess/OperadorApp/api-operadores-api.service';
import { Bitacora } from '../../../models/Serv. Cliente/Bitacoras/Bitacora';
import { Clientes } from 'src/app/models/Serv. Cliente/Clientes';
import { Flotas } from 'src/app/models/Serv. Cliente/Flotas';
import { bitacoraPeriodo } from 'src/app/models/Serv. Cliente/PeriodoBitacora';
import { VwCatGenerals } from 'src/app/models/Serv. Cliente/VwCatGeneral';
import { Usuarios } from 'src/app/models/Serv. Cliente/Usuarios';
import { Unidades } from 'src/app/models/Serv. Cliente/Unidades';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-bitacora',
  templateUrl: './crear-bitacora.component.html',
  styleUrls: ['./crear-bitacora.component.css']
})
export class CrearBitacoraComponent implements OnInit {
  // Variables
  alertType: string = '';
  alertMessage: string = '';
  public idCompania: number = parseInt(localStorage.getItem('CompaniaSelect') || '2');


  // Formulario
  bitacoraForm: FormGroup;
  bitacoraFormSubmit: FormGroup;

  bitacora: Bitacora | undefined;

  // Catalogos
  bitacoraRegistro: Bitacora[] = []; // Insercion de registros en la tabla
  clientes: Clientes[] = [];
  flotas: Flotas[] = [];
  periodos: bitacoraPeriodo = new bitacoraPeriodo();
  unidades: Unidades[] = [];
  operadores: Usuarios[] = [];
  estatus: VwCatGenerals[] = []; // Catalogos Generales
  turnos: VwCatGenerals[] = [];
  flotaObj: any;
  idOperador: any;
  //: any;

  // Catalogos Seleccionados
  clienteSeleccionado: number | undefined;
  flotaSeleccionada: number | undefined;
  periodoSeleccionado: number | undefined;
  unidadSeleccionada: string | undefined;
  operadorSeleccionado: string | undefined;
  estatusSeleccionado: string | undefined;
  turnoSeleccionado: number | undefined;

  // Filtros
  unidadesFiltradas: any[] = [];


  // Constructor
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiOperadoresApiService,
    private servCliService: ServCliService,
    private apiOperadoresApiService: ApiOperadoresApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Obtener Catalogos

    this.bitacora = new Bitacora();
    this.idCompania = parseInt(localStorage.getItem('CompaniaSelect') || '0');
    const flotaSeleccionadaLocalStorage = localStorage.getItem('flotaSeleccionada');

    const { TITULO_MODAL, TIPO_MODAL, DATA } = this.data;
    this.flotaObj = DATA as Flotas;
    console.log('this.flotaObj', this.flotaObj );

    this.obtenerCatalogos();

    // Formulario
    this.bitacoraForm = this.formBuilder.group({
      idBitacora: [0],
      idPeriodo: [this.periodoSeleccionado, Validators.required],
      idCompania: [this.idCompania, Validators.required],
      idEstatus: [this.estatusSeleccionado, Validators.required],
      idTurno: [this.bitacora.idTurno, Validators.required],
      idFlota: [this.bitacora.idFlota, Validators.required],
      flota: [this.flotaObj.nombre],
      idCliente: [this.bitacora.idCliente, Validators.required],
      cliente: [this.flotaObj.nombreCliente],
      idUnidad: [this.bitacora.idUnidad, Validators.required],
      idOperador: [this.bitacora.idOperador, Validators.required],
      activo: [true, Validators.required] // Bit activo
    });

    this.bitacoraFormSubmit = this.formBuilder.group({
      idBitacora: [0],
      idCompania: [this.idCompania, Validators.required],
      idPeriodo: [this.periodoSeleccionado, Validators.required],
      idFlota: [this.bitacora.idFlota, Validators.required],
      flota: [this.flotaObj.nombre],
      idUnidad: [this.bitacora.idUnidad, Validators.required],
      idUsuario: [this.bitacora.idOperador, Validators.required],
      idEstatus: [this.estatusSeleccionado, Validators.required],
      idTurno: [this.bitacora.idTurno, Validators.required],
      idCliente: [this.bitacora.idCliente, Validators.required],
      cliente: [this.flotaObj.nombreCliente],
      kmIniciales: [this.bitacora.kmIniciales],
      kmFinales: [this.bitacora.kmFinales],
      horaIniciales: [this.bitacora.horaIniciales],
      horaFinales: [this.bitacora.horaFinales],
      activo: [true, Validators.required], // Bit activo
      fechaCreacion: [new Date().toISOString()],
      creadoPor: [this.bitacora.creadoPor], //[ localStorage.getItem('idUsuario')?.toString() ],
      fechaModificacion: [new Date().toISOString()],
      modificadoPor: [this.bitacora.modificadoPor], //[ localStorage.getItem('idUsuario')?.toString() ],
      bitacoraMovs: [[]]
    });
  }

  // Catalogos
  obtenerCatalogos(): void {
    let compania = this.idCompania;
    console.log('idCompania: ', compania);

    this.apiService.obtenerCatalogosGeneralCliente(compania).subscribe(
      (data) => {
        this.clientes = data;

      },
      (error) => {
        this.showAlert('Error al obtener los clientes', 'error');
        console.log('Error al obtener clientes', error);
      }
    );

    this.apiService.obtenerCatalogosGeneralFlotas(compania).subscribe(
      (data) => {
        this.flotas = data;
      },
      (error) => {
        this.showAlert('Error al obtener las flotas', 'error');
        console.log('Error al obtener los flotas', error);
      }
    );

    this.apiService.obtenerCatalogosGeneralPeriodo(compania).subscribe(
      (data) => {
        this.periodos = data;
        this.periodoSeleccionado = data.idConsecutivo;
      },
      (error) => {
        this.showAlert('Error al obtener los periodos', 'error');
        console.log('Error al obtener los periodos', error);
      }
    );

    this.apiService.obtenerCatalogosGeneralUnidades(compania).subscribe(
      (data) => {
        this.unidades = data;
        this.unidadesFiltradas = data;
        //console.log('unidades usuario',this.unidadesFiltradas)
      },
      (error) => {
        this.showAlert('Error al obtener las unidades', 'error');
        console.log('Error al obtener los unidades', 'error');
      }
    );

    this.apiService.obtenerCatalogosGeneralOperadores().subscribe(
      (data) => {
        this.operadores = data;
      },
      (error) => {
        this.showAlert('Error al obtener los operadores', 'error');
        console.log('Error al obtener los operadores', 'error');
      }
    );

    this.apiService.obtenerCatalogosGeneralViewCatGeneralBitEstatus().subscribe(
      (data) => {
        this.estatus = data;
        this.estatusSeleccionado = 'bcc6afde-60c6-4359-932b-ebc6dc30f327'; // nuevo
      },
      (error) => {
        this.showAlert('Error al obtener los estatus', 'error');
        console.log('Error al obtener los estatus', 'error');
      }
    );

    this.apiService.obtenerCatalogosGeneralViewCatGeneralBitTurno().subscribe(
      (data) => {
        const dataOrdenidElemento = data.sort((a: any, b: any) => a.idElemento - b.idElemento);
        // console.log('turnos',dataOrdenidElemento);

        // console.log('turnos',data);
        this.turnos = dataOrdenidElemento;
      },
      (error) => {
        this.showAlert('Error al obtener los turnos', 'error');
        console.log('Error al obtener los turnos', 'error');
      }
    );

  }

  ngOnInit(): void {
  }

  // Unidades filtradas por flota
  unidadesPorFlota(idFlota: number): void {
    //this.unidadesFiltradas = this.unidades.filter((element) => element.idFlota === idFlota.valueOf());
    const iUnidadControl = this.bitacoraForm.get('idUnidad');

    if (iUnidadControl) {
      iUnidadControl.reset();
    }
  }

  // Agregar registro a la tabla de bitacoraRegistro sin eliminar la cabecera (idCompania, idPeriodo, idFlota, idCliente, Turno, activo)
  agregarRegistro(): void {
    const bitacoraData = this.bitacoraForm.getRawValue(); // Obtener valores del formulario
    const operadorFiltrado = this.unidadesFiltradas.filter((element) => element.idUnidad == bitacoraData.idUnidad);
    this.idOperador = operadorFiltrado[0].idUsuario;

    bitacoraData.idPeriodo = this.periodoSeleccionado; // Agregar periodoSeleccionado a bitacoraData
    bitacoraData.idCompania = this.idCompania; // Agregar idCompania a bitacoraData
    bitacoraData.idEstatus = this.estatusSeleccionado; // Agregar idEstatus a bitacoraData
    bitacoraData.idOperador = this.idOperador;
    //this.bitacoraRegistro.filter((element) => element !== registro);
    // Validar si los campos son requeridos
    if (!bitacoraData.idOperador || !bitacoraData.idUnidad) {
      this.showAlert('Todos los campos son requeridos', 'error');
      return;
    }

    console.log('bitacoraData: ', bitacoraData);
    console.log('bitacoraRegistro ', this.bitacoraRegistro);

    // Validacion donde si bitacoraRegistro es mayor a 0 se valida si el registro ya existe en la tabla
    if (this.bitacoraRegistro.length > 0) {
      this.validarRegistroExistente(bitacoraData);
    } else {
      this.bitacoraFormSubmit.patchValue({
        idBitacora: 0,
        idPeriodo: bitacoraData.idPeriodo,
        idCompania: bitacoraData.idCompania,
        idEstatus: bitacoraData.idEstatus,
        idTurno: bitacoraData.idTurno,
        idFlota: this.flotaObj.idFlota,//bitacoraData.idFlota,
        idCliente: this.flotaObj.idCliente,//bitacoraData.idCliente,
        idUnidad: bitacoraData.idUnidad,
        idUsuario: bitacoraData.idOperador,
        activo: bitacoraData.activo,
        kmIniciales: 0,
        kmFinales: 0,
        horaIniciales: 0,
        horaFinales: 0,
      });

      this.bitacoraRegistro.push(this.bitacoraFormSubmit.getRawValue());
      // console.log(this.bitacoraRegistro);

      this.showAlert('Registro agregado correctamente', 'success');

      // this.bitacoraRegistro.push(bitacoraData);
      // this.showAlert('Registro agregado correctamente', 'success');
    }

    // Validar si el registro ya existe en la lista bitacoraRegistro (idOperador, idUnidad)
    // const registroExistente = this.bitacoraRegistro.find(
    //   (element: any) =>
    //     element.idUsuario === bitacoraData.idOperador &&
    //     element.idUnidad === bitacoraData.idUnidad &&
    //     element.idPeriodo === bitacoraData.idPeriodo &&
    //     element.idCompania === bitacoraData.idCompania &&
    //     element.idEstatus === bitacoraData.idEstatus &&
    //     element.idTurno === bitacoraData.idTurno
    // );

    // console.log('registroExistente: ', registroExistente);

    // if (registroExistente) {
    //   this.showAlert('El registro ya existe en la tabla', 'error');
    //   return;
    // }

    // this.bitacoraRegistro.push(bitacoraData);

    // // Registrar datos de la bitacora
    // this.bitacoraFormSubmit.patchValue({
    //   idBitacora: 0,
    //   idPeriodo: bitacoraData.idPeriodo,
    //   idCompania: bitacoraData.idCompania,
    //   idEstatus: bitacoraData.idEstatus,
    //   idTurno: bitacoraData.idTurno,
    //   idFlota: this.flotaObj.idFlota,//bitacoraData.idFlota,
    //   idCliente: this.flotaObj.idCliente,//bitacoraData.idCliente,
    //   idUnidad: bitacoraData.idUnidad,
    //   idUsuario: bitacoraData.idOperador,
    //   activo: bitacoraData.activo,
    //   kmIniciales: 0,
    //   kmFinales: 0,
    //   horaIniciales: 0,
    //   horaFinales: 0,
    // });

    // this.bitacoraRegistro.push(this.bitacoraFormSubmit.getRawValue());
    // // console.log(this.bitacoraRegistro);

    // this.showAlert('Registro agregado correctamente', 'success');
  }

  // Validar si el registro ya existe en la tabla bitacoraRegistro
  validarRegistroExistente(bitacoraData: any): void {
    const registroExistente = this.bitacoraRegistro.find(
      (element: any) =>
        element.idUsuario === bitacoraData.idOperador &&
        element.idUnidad === bitacoraData.idUnidad &&
        element.idPeriodo === bitacoraData.idPeriodo &&
        element.idCompania === bitacoraData.idCompania &&
        element.idEstatus === bitacoraData.idEstatus &&
        element.idTurno === bitacoraData.idTurno &&
        element.idCliente === bitacoraData.idCliente &&
        element.idFlota === bitacoraData.idFlota &&
        element.activo === bitacoraData.activo &&
        element.creado === bitacoraData.creado
    );

    if (registroExistente) {
      this.showAlert('El registro ya existe en la tabla', 'error');
      return;
    }
    else {
      this.bitacoraFormSubmit.patchValue({
        idBitacora: 0,
        idPeriodo: bitacoraData.idPeriodo,
        idCompania: bitacoraData.idCompania,
        idEstatus: bitacoraData.idEstatus,
        idTurno: bitacoraData.idTurno,
        idFlota: this.flotaObj.idFlota,//bitacoraData.idFlota,
        idCliente: this.flotaObj.idCliente,//bitacoraData.idCliente,
        idUnidad: bitacoraData.idUnidad,
        idUsuario: bitacoraData.idOperador,
        activo: bitacoraData.activo,
        kmIniciales: 0,
        kmFinales: 0,
        horaIniciales: 0,
        horaFinales: 0,
      });

      this.bitacoraRegistro.push(this.bitacoraFormSubmit.getRawValue());
      // console.log(this.bitacoraRegistro);

      this.showAlert('Registro agregado correctamente', 'success');
    }
  }

  // Cambiar el idOperador por el nombre del operador en la tabla
  obtenerNombreOperador(idOperador: string): string {
    // console.log(idOperador);
    const operador = this.operadores.find((element) => element.id === idOperador);

    return operador ? operador.nombres + ' ' + operador.apellidoPat + ' ' + operador.apellidoMat : '';
  }

  // Obtener nombre Estatus por VwCatGenerals
  obtenerNombreEstatus(idEstatus: string): string {
    // console.log(idEstatus);
    const estatus = this.estatus.find((element) => element.idCatGenDetalle === idEstatus);
    return estatus ? estatus.nombreDet : '';
  }

  // Obtener nombre Turno por VwCatGenerals
  obtenerNombreTurno(idTurno: string): string {
    // console.log(idTurno);
    const turno = this.turnos.find((element) => element.idCatGenDetalle === idTurno);
    return turno ? turno.nombreDet : '';
  }

  // Crear bitacora por cada registro de la tabla bitacoraRegistro se insertara el registro en la base de datos de la api
  crearBitacora(): void {
    // Validar si la tabla esta vacia
    if (this.bitacoraRegistro.length === 0) {
      this.showAlert('No hay registros para crear la bitacora', 'error');
      return;
    }
    //this.bitacoraRegistro.idCliente = 4
    // Crear bitacora por cada registro de la tabla bitacoraRegistro
    this.bitacoraRegistro.forEach((element) => {
      console.log('datos element - proceso guardar', element);
      this.apiOperadoresApiService.crearBitacora(element).subscribe(
        (data) => {
          // Eliminar registro de la tabla bitacoraRegistro al insertar el registro en la base de datos
          this.eliminarRegistro(element);
          this.showAlert('Bitacora creada correctamente', 'success');
        },
        (error) => {
          this.showAlert('Error al crear la bitacora, Hay registros que ya existe.', 'error');
          console.log(error.error);
        }
      );
    });

    // Mostrar alerta si la tabla esta vacia y mostrar cantidad de registros subidos a la base de datos en ella
    if (this.bitacoraRegistro.length === 0) {
      this.showAlert('No hay registros para crear la bitacora', 'error');
    } else {
      // this.bitacoraRegistro = [];
      this.showAlert('Se esta procesando la bitacora..., Cantidad a subir: ' + this.bitacoraRegistro.length, 'success');
    }
  }

  eliminarRegistro(registro: Bitacora): void {
    this.bitacoraRegistro = this.bitacoraRegistro.filter((element) => element !== registro);
  }

  // Alertas
  showAlert(message: string, type: string): void {
    alert(message);
  }
}
