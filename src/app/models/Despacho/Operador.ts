import { Personal } from '../RH/personal';
import { UnidadOperador } from './UnidadOperador';
export class Operador {
  idOperador: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  idSucursal: number;
  idCompania: number;
  idTipoOperador: string;
  tipoOperador: string;
  activo: boolean;
  numContacto: string;
  numEmergencia: string;
  noImss: string;
  numLicencia: string;
  idTipoLicencia: string;
  tipoLicencia: string;
  direccion: string;
  visa: boolean;
  vencimientoLicencia: Date;
  rfc: string;
  codigoPostal: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  creadoPor: string;
  modificadoPor: string;
  usuarioModificadoPor: string;
  usuarioCreadoPor: string;
  personal: Personal;
  operadorRefCruzada: operadorRefCruzada;
  idTipoNomina: number;
  idPersonal:number;

  operadorBloqueos?: OperadorBloqueo[];
  vencimientoAptoMedico: Date;
  // UNIDAD OPERADOR
  unidadOperador?: UnidadOperador;
  constructor(
      idOperador?: number,
      nombre?: string,
      apellidoPaterno?: string,
      apellidoMaterno?: string,
      idSucursal?: number,
      idCompania?: number,
      idTipoOperador?: string,
      tipoOperador?: string,
      activo?: boolean,
      numContacto?: string,
      numEmergencia?: string,
      noImss?: string,
      numLicencia?: string,
      idTipoLicencia?: string,
      direccion?: string,
      visa?: boolean,
      vencimientoLicencia?: Date,
      rfc?: string,
      codigoPostal?:number,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      usuarioModificadoPor?: string,
      usuarioCreadoPor?: string,
      tipoLicencia?: string,
      idTipoNomina?:number,
      idPersonal?:number,
      operadorBloqueos?: OperadorBloqueo[],
      vencimientoAptoMedico?: Date,

      unidadOperador?: UnidadOperador,
  ) {
      this.idOperador = idOperador || 0;
      this.nombre = nombre || '';
      this.apellidoPaterno = apellidoPaterno || '';
      this.apellidoMaterno = apellidoMaterno || '';
      this.idSucursal = idSucursal || 0;
      this.idCompania = idCompania || 0;
      this.idTipoOperador = idTipoOperador || '';
      this.tipoOperador = tipoOperador || '';
      this.activo = activo || false;
      this.numContacto = numContacto || '';
      this.numEmergencia = numEmergencia || '';
      this.noImss = noImss || '';
      this.numLicencia = numLicencia || '';
      this.idTipoLicencia = idTipoLicencia || '00000000-0000-0000-0000-000000000000';
      this.direccion = direccion || '';
      this.visa = visa || false;
      this.vencimientoLicencia = vencimientoLicencia || new Date();
      this.rfc = rfc || '';
      this.codigoPostal = codigoPostal || 0;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.usuarioModificadoPor = '';
      this.usuarioCreadoPor = '';
      this.tipoLicencia = '';
      this.personal = new Personal();
      this.operadorRefCruzada = new operadorRefCruzada(0, 0, 0, 0);
      this.idTipoNomina = idTipoNomina || 0;
      this.idPersonal = idPersonal || 0;
      this.operadorBloqueos = [];
      this.vencimientoAptoMedico = vencimientoAptoMedico || new Date();

      this.unidadOperador = new UnidadOperador();
    }

}

export class OperadorBloqueo {
  idOperadorBloqueo: number;
  idOperador: number;
  bloqueo: boolean;
  idCausa: number;
  fechaVencimiento: Date;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

   constructor(
    idOperadorBloqueo?: number,
    idOperador?: number,
    bloqueo?: boolean,
    idCausa?: number,
    fechaVencimiento?: Date,
    activo?: boolean,
    fechaCreacion?: Date,
    creadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string
  ) {
    this.idOperadorBloqueo = idOperadorBloqueo || 0;
    this.idOperador = idOperador || 0;
    this.bloqueo = bloqueo || false;
    this.idCausa = idCausa || 0;
    this.fechaVencimiento = fechaVencimiento || new Date();
    this.activo = activo || false;
    this.fechaCreacion = fechaCreacion || new Date();
    this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = fechaModificacion || new Date();
    this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
  }
}

export class operadorRefCruzada {
  id: number;
  idOperador: number;
  idRefHg?: number;
  idRefCh: number;
  idRefRl: number;
  idRefLinda: number;
  constructor(
    idOperador: number,
    idRefHG?: number,
    idRefCH?: number,
    idRefRL?: number,
    idRefLinda?: number
  )
  {
  this.id = 0;
  this.idOperador = 0;
  this.idRefHg = 0;
  this.idRefCh = 0;
  this.idRefRl = 0;
  this.idRefLinda = 0;
  }
}



