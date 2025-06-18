export class RelClienteOperadorVetado {
  id: number;
  idCliente: number;
  idPersonal: number;
  activo: boolean | null;
  creadoPor: string | null;
  modificadoPor: string | null;
  creado: Date | null;
  modificado: Date | null;

  // Constructor con valores predeterminados
  constructor(
    id: number = 0,
    idCliente: number = 0,
    idPersonal: number = 0,
    activo: boolean | null = true,
    creadoPor: string | null = null,
    modificadoPor: string | null = null,
    creado: Date | null = new Date(),
    modificado: Date | null = new Date()
  ) {
    this.id = id;
    this.idCliente = idCliente;
    this.idPersonal = idPersonal;
    this.activo = activo;
    this.creadoPor = creadoPor;
    this.modificadoPor = modificadoPor;
    this.creado = creado;
    this.modificado = modificado;
  }
}

///////////////////
/////// DTO ///////
///////////////////

// Catalogo de Operadores(Personal)
export class RelClienteOperadorVetadoDTO {
  id: number;
  cantidad: number;
  idCliente: number;
  cliente: string;
  idPersonal: number;
  personales: string;
  activo: boolean | null;
  fechaCreacion: Date | null;
  creadoPor: string | null;
  usuarioCreadoPor: string;
  fechaModificacion: Date | null;
  modificadoPor: string | null;
  usuarioModificadoPor: string;
  personal: PersonalDTO[];

  constructor(
    id: number = 0,
    cantidad: number = 0,
    idCliente: number = 0,
    cliente: string = '',
    idPersonal: number = 0,
    personales: string = '',
    activo: boolean | null = null,
    fechaCreacion: Date | null = null,
    creadoPor: string | null = null,
    usuarioCreadoPor: string = '',
    fechaModificacion: Date | null = null,
    modificadoPor: string | null = null,
    usuarioModificadoPor: string = '',
    personal: PersonalDTO[] = []
  ) {
    this.id = id;
    this.cantidad = cantidad;
    this.idCliente = idCliente;
    this.cliente = cliente;
    this.idPersonal = idPersonal;
    this.personales = personales;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.creadoPor = creadoPor;
    this.usuarioCreadoPor = usuarioCreadoPor;
    this.fechaModificacion = fechaModificacion;
    this.modificadoPor = modificadoPor;
    this.usuarioModificadoPor = usuarioModificadoPor;
    this.personal = personal;
  }
}

export class PersonalDTO {
  idPersonal: number;
  nombreCompleto: string;
  rfc: string;
  compania: string | null;
  activo: boolean | null;
  fechaCreacion: Date | null;
  fechaModificacion: Date | null;

  constructor(
    idPersonal: number = 0,
    nombreCompleto: string = '',
    rfc: string = '',
    compania: string | null = null,
    activo: boolean | null = null,
    fechaCreacion: Date | null = null,
    fechaModificacion: Date | null = null
  ) {
    this.idPersonal = idPersonal;
    this.nombreCompleto = nombreCompleto;
    this.rfc = rfc;
    this.compania = compania;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.fechaModificacion = fechaModificacion;
  }
}
