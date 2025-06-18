export class Remolque {
  idRemolque: number;
  nombre: string;
  clave: string;
  noSerie?: string;
  placas?: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  usuarioCreadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioModificadoPor: string;
  idLinea: number;
  linea?: string;
  idCompania: number;
  compania?: string;
  idMarca: string;
  marca?: string;
  idFlota: number;
  flota?: string;
  idTipoRemolque: string;
  tipoRemolque?: string;
  idRemolqueEstatus: number;
  estatusCaja?: string;
  esPropia:boolean;
  esRentada:boolean;
  remolqueRefCruzada: remolqueRefCruzada;
  modelo: number;
  idAntena: string;
  idAsignCliente: string;
  esLeasing: boolean;

  constructor(
    idRemolque?: number,
    clave?:string,
    noSerie?: string,
    placas?: string,
    activo?: boolean,
    fechaCreacion?: Date,
    creadoPor?: string,
    usuarioCreadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string,
    usuarioModificadoPor?: string,
    idLinea?: number,
    linea?: string,
    idCompania?: number,
    compania?: string,
    // idMarca?: string,
    marca?: string,
    idFlota?: number,
    flota?: string,
    // idTipoRemolque?: string,
    tipoRemolque?: string,
    idRemolqueEstatus?: number,
    estatusCaja?: string,
  ) {
    this.idRemolque = idRemolque ?? 0;
    this.clave = clave ?? '';
    this.noSerie = noSerie ?? '';
    this.placas = placas ?? '';
    this.activo = activo ?? true;
    this.fechaCreacion = fechaCreacion ?? new Date();
    this.creadoPor = creadoPor ?? '00000000-0000-0000-0000-000000000000';
    this.usuarioCreadoPor = usuarioCreadoPor ?? '';
    this.fechaModificacion = fechaModificacion ?? new Date();
    this.modificadoPor = modificadoPor ?? '00000000-0000-0000-0000-000000000000';
    this.usuarioModificadoPor = usuarioModificadoPor ?? '';
    this.idLinea = idLinea ?? 0;
    this.linea = linea ?? '';
    this.idCompania = idCompania ?? 0;
    this.compania = compania ?? '';
    this.idMarca = '';
    this.marca = marca ?? '';
    this.idFlota = idFlota ?? 0;
    this.flota = flota ?? '';
    this.idTipoRemolque = '';
    this.tipoRemolque = tipoRemolque ?? '';
    this.idRemolqueEstatus = idRemolqueEstatus ?? 0;
    this.estatusCaja = estatusCaja ?? '';
    this.usuarioCreadoPor = '';
    this.usuarioModificadoPor = '';
    this.remolqueRefCruzada = new remolqueRefCruzada(0, 0, 0, 0);
    this.nombre = '';
    this.esPropia = true;
    this.esRentada = false;
    this.modelo = 0;
    this.idAntena = '';
    this.idAsignCliente = '';
    this.esLeasing = false;
  }
}


export class remolqueRefCruzada {
  idRemolque: number;
  idRefHG?: number;
  idRefCH: number;
  idRefRL: number;
  idRefLinda: number;
  constructor(
    idRemolque: number,
    idRefHG?: number,
    idRefCH?: number,
    idRefRL?: number,
    idRefLinda?: number
  )
  {
  this.idRemolque = 0;
  this.idRefHG = 0;
  this.idRefCH = 0;
  this.idRefRL = 0;
  this.idRefLinda = 0;
  }
}