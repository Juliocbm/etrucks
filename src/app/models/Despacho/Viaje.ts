import { AsignacionViaje } from "./AsignacionViaje";

export class Viaje {
  idViaje: number;
  idPedido: number;
  idCompania: number; // byte en C# se puede representar como number en TypeScript
  compania?: string;
  folioCompania: number;
  idViajeEstatus: number;
  viajeEstatus: string;
  idTipoViaje: string; // Guid en C# se puede representar como string en TypeScript
  tipoViaje: string;
  idTipoSeguimiento: number; // short en C# se puede representar como number en TypeScript
  tipoSeguimiento: string;
  idEjecutivo: number;
  ejecutivo?: string;
  idSucursal: number;
  sucursal?: string;
  idSucursalDespacho: number;
  sucursalDespacho?: string;
  idTipoOperacion: string;
  tipoOperacion?: string;
  idRuta: number;
  ruta: string;
  idPlazaOrigen: number;
  plazaOrigen?: string;
  idPlazaDestino: number;
  plazaDestino?: string;
  idClienteOrigen: string;
  clienteOrigen?: string;
  idClienteDestino: string;
  clienteDestino?: string;
  kmsRuta: number;
  idUnidad: number;
  unidad: string;
  idRemolque?: number;
  remolque?: string;
  esMultiOperador: boolean;
  contacto?: string;
  observaciones?: string;
  activo: boolean;
  fechaCompromiso: Date;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioCreadoPor: string;
  usuarioModificadoPor: string;
  asignacionViaje: AsignacionViaje;

  constructor(
    idViaje?: number,
    idPedido?: number,
    idCompania?: number,
    compania?: string,
    folioCompania?: number,
    idViajeEstatus?: number,
    viajeEstatus?: string,
    idTipoViaje?: string,
    tipoViaje?: string,
    idTipoSeguimiento?: number,
    tipoSeguimiento?: string,
    idEjecutivo?: number,
    ejecutivo?: string,
    idSucursal?: number,
    sucursal?: string,
    idSucursalDespacho?: number,
    sucursalDespacho?: string,
    idTipoOperacion?: string,
    tipoOperacion?: string,
    idRuta?: number,
    ruta?: string,
    idPlazaOrigen?: number,
    plazaOrigen?: string,
    idPlazaDestino?: number,
    plazaDestino?: string,
    idClienteOrigen?: string,
    clienteOrigen?: string,
    idClienteDestino?: string,
    clienteDestino?: string,
    kmsRuta?: number,
    idUnidad?: number,
    unidad?: string,
    idRemolque?: number,
    remolque?: string,
    esMultiOperador?: boolean,
    contacto?: string,
    observaciones?: string,
    activo?: boolean,
    fechaCompromiso?: Date,
    fechaCreacion?: Date,
    creadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string,
    usuarioCreadoPor?: string,
    usuarioModificadoPor?: string,
    asignacionViaje?: AsignacionViaje,

  ) {
    this.idViaje = idViaje || 0;
    this.idPedido = idPedido || 0;
    this.idCompania = idCompania || 0;
    this.compania = compania || '';
    this.folioCompania = folioCompania || 0;
    this.idViajeEstatus = idViajeEstatus || 0;
    this.viajeEstatus = viajeEstatus || '';
    this.idTipoViaje = idTipoViaje || '00000000-0000-0000-0000-000000000000';
    this.tipoViaje = tipoViaje || '';
    this.idTipoSeguimiento = idTipoSeguimiento || 0;
    this.tipoSeguimiento = tipoSeguimiento || '';
    this.idEjecutivo = idEjecutivo || 0;
    this.ejecutivo = ejecutivo || '';
    this.idSucursal = idSucursal || 0;
    this.sucursal = sucursal || '';
    this.idSucursalDespacho = idSucursalDespacho || 0;
    this.sucursalDespacho = sucursalDespacho || '';
    this.idTipoOperacion = idTipoOperacion || '00000000-0000-0000-0000-000000000000';
    this.tipoOperacion = tipoOperacion || '';
    this.idRuta = idRuta || 0;
    this.ruta = ruta || '';
    this.idPlazaOrigen = idPlazaOrigen || 0;
    this.plazaOrigen = plazaOrigen || '';
    this.idPlazaDestino = idPlazaDestino || 0;
    this.plazaDestino = plazaDestino || '';
    this.idClienteOrigen = idClienteOrigen || '00000000-0000-0000-0000-000000000000';
    this.clienteOrigen = clienteOrigen || '';
    this.idClienteDestino = idClienteDestino || '00000000-0000-0000-0000-000000000000';
    this.clienteDestino = clienteDestino || '';
    this.kmsRuta = kmsRuta || 0;
    this.idUnidad = idUnidad || 0;
    this.unidad = unidad || '';
    this.idRemolque = idRemolque || 0; // assuming nullable
    this.remolque = remolque || '';
    this.esMultiOperador = esMultiOperador || false;
    this.contacto = contacto || '';
    this.observaciones = observaciones || '';
    this.activo = activo || false;
    this.fechaCompromiso = fechaCompromiso || new Date();
    this.fechaCreacion = fechaCreacion || new Date();
    this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = fechaModificacion || new Date();
    this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
    this.usuarioCreadoPor = usuarioCreadoPor || '';
    this.usuarioModificadoPor = usuarioModificadoPor || '';
    this.asignacionViaje = asignacionViaje || new AsignacionViaje();
  }
}


export class AnticipoViaje {
  id?: number;
  idViaje?: number;
  idConceptoContable?: number;
  consecutivo?: number;
  nombre?: string;
  monto?: number;
  idEstatusAnticipo?: string;
  creadoPor?: string;
  modificadoPor?: string;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  activo?: boolean;
  constructor(
    id?: number,
    idViaje?: number,
    idConceptoContable?: number,
    consecutivo?: number,
    nombre?: string,
    monto?: number,
    idEstatusAnticipo?: string,
    creadoPor?: string,
    modificadoPor?: string,
    fechaCreacion?: Date,
    fechaModificacion?: Date,
    activo?: boolean
  ) {
    this.id = id || 0;
    this.idViaje = idViaje || 0;
    this.idConceptoContable = idConceptoContable || 0;
    this.consecutivo = consecutivo || 0;
    this.nombre = nombre || "";
    this.monto = monto || 0;
    this.idEstatusAnticipo = idEstatusAnticipo || "";
    this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
    this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = fechaModificacion || new Date();
    this.fechaCreacion = fechaCreacion || new Date();
    this.activo = activo || false;
  }

}

export class CancelaViaje {

  idCancelaViaje: number;
  idCompania: number;
  idViaje: number;
  idPedido: number;
  comentario: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  constructor() {
    this.idCancelaViaje = 0;
    this.idCompania = 0;
    this.idViaje = 0;
    this.idPedido = 0;
    this.comentario = '';
    this.activo = true;
    this.fechaCreacion = new Date();
    this.creadoPor = '';
    this.fechaModificacion = new Date();
    this.modificadoPor = '';
  }
}