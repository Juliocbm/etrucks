export class Visita {
  id: number;
  esEmpleado: boolean;
  idPersonal: string | null;
  nombreVisitante: string;
  documentoIdentidad: string;
  fechaVisita: Date;
  sucursalId: number;
  sucursalNombre: string | null;
  motivoVisita: string | null;
  referencia: string | null;
  accesoPermitido: boolean;
  horaEntrada: Date | null;
  horaSalida: Date | null;
  observaciones: string | null;
  creado: Date;
  creadoPor: string;
  modificado: Date;
  modificadoPor: string;
  idCompania: number;
  activo: boolean;
  tipoVisita: string | null;
  idProveedor: number | null;
  tipoDocumentoID: number | null;
  estatusSolicitudId: number | null;
  correoDestinatario: string | null;

  constructor(
    id: number = 0,
    esEmpleado: boolean = false,
    idPersonal: string | null = null,
    nombreVisitante: string = '',
    documentoIdentidad: string = '',
    fechaVisita: Date = new Date(),
    sucursalId: number = 0,
    sucursalNombre: string | null = null,
    motivoVisita: string | null = null,
    referencia: string | null = null,
    accesoPermitido: boolean = false,
    horaEntrada: Date | null = null,
    horaSalida: Date | null = null,
    observaciones: string | null = null,
    creado: Date = new Date(),
    creadoPor: string = '',
    modificado: Date = new Date(),
    modificadoPor: string = '',
    idCompania: number = 0,
    activo: boolean = true,
    tipoVisita: string | null = null,
    idProveedor: number | null = null,
    tipoDocumentoID: number | null = null,
    estatusSolicitudId: number | null = null,
    correoDestinatario: string | null = null
  ) {
    this.id = id;
    this.esEmpleado = esEmpleado;
    this.idPersonal = idPersonal;
    this.nombreVisitante = nombreVisitante;
    this.documentoIdentidad = documentoIdentidad;
    this.fechaVisita = fechaVisita;
    this.sucursalId = sucursalId;
    this.sucursalNombre = sucursalNombre;
    this.motivoVisita = motivoVisita;
    this.referencia = referencia;
    this.accesoPermitido = accesoPermitido;
    this.horaEntrada = horaEntrada;
    this.horaSalida = horaSalida;
    this.observaciones = observaciones;
    this.creado = creado;
    this.creadoPor = creadoPor;
    this.modificado = modificado;
    this.modificadoPor = modificadoPor;
    this.idCompania = idCompania;
    this.activo = activo;
    this.tipoVisita = tipoVisita;
    this.idProveedor = idProveedor;
    this.tipoDocumentoID = tipoDocumentoID;
    this.estatusSolicitudId = estatusSolicitudId;
    this.correoDestinatario = correoDestinatario;
  }
}


export class VisitaDTO {
  idVisita: number;
  esEmpleado: boolean;
  idPersonal: string | null = null; // GUID de la tabla Personal 00000000-0000-0000-0000-000000000000
  nombreVisitante: string | null;
  documentoIdentidad: string | null;
  fechaVisita: Date;
  sucursalID: number;
  nombre: string | null;
  motivoVisita: string | null;
  referencia: string | null;
  accesoPermitido: boolean;
  horaEntrada: Date | null;
  horaSalida: Date | null;
  observaciones: string | null;
  idCompania: number;
  tipoVisita: string | null;
  idProveedor: number | null;
  proveedor: string | null;
  tipoDocumentoID: number | null;
  tipoDocumento: string | null;
  estatusSolicitudId: number | null;
  estatusSolicitud: string | null;
  fechaCambioEstatus: Date | null; // Nuevo
  correoDestinatario: string | null; // Nuevo

  activo: boolean;
  creado: Date| null;
  creadoPor: string; // GUID
  usuarioCreado: string | null; // Nuevo
  modificado: Date | null;
  modificadoPor: string | null; // GUID
  usuarioModificado: string | null; // Nuevo

  constructor(
    idVisita: number = 0,
    esEmpleado: boolean = false,
    idPersonal: string | null = null,
    nombreVisitante: string | null = '',
    documentoIdentidad: string | null = '',
    fechaVisita: Date = new Date(),
    sucursalID: number = 0,
    nombre: string | null = null,
    motivoVisita: string | null = null,
    referencia: string | null = null,
    accesoPermitido: boolean = false,
    horaEntrada: Date | null = null,
    horaSalida: Date | null = null,
    observaciones: string | null = null,
    creado:  Date | null = null,
    creadoPor: string = '',
    usuarioCreado: string | null = null,
    modificado: Date | null = null,
    modificadoPor: string | null = null,
    usuarioModificado: string | null = null,
    idCompania: number = 0,
    activo: boolean = true,
    tipoVisita: string | null = null,
    idProveedor: number | null = null,
    proveedor: string | null = null,
    tipoDocumentoID: number | null = null,
    tipoDocumento: string | null = null,
    estatusSolicitudId: number | null = null,
    estatusSolicitud: string | null = null,
    fechaCambioEstatus: Date | null = null,
    correoDestinatario: string | null = null
  ) {
    this.idVisita = idVisita || 0;
    this.esEmpleado = esEmpleado || false;
    this.idPersonal = idPersonal;
    this.nombreVisitante = nombreVisitante;
    this.documentoIdentidad = documentoIdentidad;
    this.fechaVisita = fechaVisita;
    this.sucursalID = sucursalID;
    this.nombre = nombre;
    this.motivoVisita = motivoVisita;
    this.referencia = referencia;
    this.accesoPermitido = accesoPermitido;
    this.horaEntrada = horaEntrada;
    this.horaSalida = horaSalida;
    this.observaciones = observaciones;
    this.creado = creado;
    this.creadoPor = creadoPor;
    this.usuarioCreado = usuarioCreado;
    this.modificado = modificado;
    this.modificadoPor = modificadoPor;
    this.usuarioModificado = usuarioModificado;
    this.idCompania = idCompania;
    this.activo = activo;
    this.tipoVisita = tipoVisita;
    this.idProveedor = idProveedor;
    this.proveedor = proveedor;
    this.tipoDocumentoID = tipoDocumentoID;
    this.tipoDocumento = tipoDocumento;
    this.estatusSolicitudId = estatusSolicitudId;
    this.estatusSolicitud = estatusSolicitud;
    this.fechaCambioEstatus = fechaCambioEstatus;
    this.correoDestinatario = correoDestinatario;
  }
}
