import { ConfiguracionTipoUnidad } from "./ConfiguracionTipoUnidad";
import { PolizaSegUnidad } from "./PolizaSegUnidad";

export class Unidad {
  idUnidad: number;
  idCompania: number;
  compania?: string;
  clave: string;
  descripcion: string;
  noSerie: string;
  modelo: number;
  placas: string;
  idMarca: string;
  marca: string;
  idTipoUnidad: string;
  tipoUnidad: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  usuarioCreadoPor?: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioModificadoPor?: string;
  companiasUnidades: CompaniaUnidad[];
  companiasSelect: Companias[];
  unidadRefCruzada: unidadRefCruzada;
  unidadBloqueos?: UnidadBloqueo[];
  esPermisionario: boolean;
  idPermisionario: number;
  nombrePermisionario: string;
  asignacionActiva: number;

  idDepartamento: number;
  departamento: string;
  idTipoCombustible: string;
  tipoCombustible: string;
  capacidadMaxima: number;
  referencia: string;
  kmsDia: number;
  kmsAcum: number;
  rendimiento: number;
  tarjetaCirculacion: string;
  pesoVehicular: number;
  noPermiso: number;
  fechaVencimientoPermiso: Date;
  noSerieMotor: string;
  idTipoMotor: string;
  tipoMotor: string;
  polizaSegUnidades: PolizaSegUnidad[];
  configuracionTipoUnidades: ConfiguracionTipoUnidad;

  // UNIDAD OPERADOR
  idUnidadOperador: number;
  idOperador: number;
  operador: string;
  unidadOpUsuarioCreadoPor: string;
  unidadOpUsuarioModificadoPor: string;
  unidadOpCreadoPor: string;
  unidadOpModificadoPor: string;
  unidadOpFechaCreacion: Date;
  unidadOpFechaModificacion: Date;
  unidadOpActivo: boolean;
  idTipoOperador: string;
  tipoOperador: string;

  constructor(
    idUnidad?: number,
    idCompania?: number,
    compania?: string,
    clave?: string,
    descripcion?: string,
    noSerie?: string,
    modelo?: number,
    placas?: string,
    marca?: string,
    tipoUnidad?: string,
    activo?: boolean,
    fechaCreacion?: Date,
    creadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string,
    usuarioCreadoPor?: string,
    usuarioModificadoPor?: string,
    companiaUnidad: CompaniaUnidad[] = [],
    companiasSelect?: [],    
    unidadBloqueos?: UnidadBloqueo[],
    asignacionActiva?: number,
    esPermisionario?: boolean,
    idPermisionario?: number,
    nombrePermisionario?: string,

    idDepartamento?: number,
    departamento?: string,
    idTipoCombustible?: string,
    tipoCombustible?: string,
    capacidadMaxima?: number,
    referencia?: string,
    kmsDia?: number,
    kmsAcum?: number,
    rendimiento?: number,
    tarjetaCirculacion?: string,
    pesoVehicular?: number,
    noPermiso?: number,
    fechaVencimientoPermiso?: Date,
    noSerieMotor?: string,
    idTipoMotor?: string,
    tipoMotor?: string,
    polizaSegUnidades?: PolizaSegUnidad[],
    configuracionTipoUnidades?: ConfiguracionTipoUnidad,

    // UNIDAD OPERADOR
    idUnidadOperador?: number,
    idOperador?: number,
    operador?: string,
    unidadOpUsuarioCreadoPor?: string,
    unidadOpUsuarioModificadoPor?: string,
    unidadOpCreadoPor?: string,
    unidadOpModificadoPor?: string,
    unidadOpFechaCreacion?: Date,
    unidadOpFechaModificacion?: Date,
    UnidadOpActivo?: boolean,
    idTipoOperador?: string,
    tipoOperador?: string,
  ) {
    this.idUnidad = idUnidad || 0;
    this.idCompania = idCompania || 3;
    this.compania = '';
    this.clave = clave || '';
    this.descripcion = descripcion || '';
    this.noSerie = noSerie || '';
    this.modelo = modelo || 0;
    this.placas = placas || '';
    this.idMarca = '';
    this.marca = marca || '';
    this.idTipoUnidad = '';
    this.tipoUnidad = tipoUnidad || '';
    this.activo = activo || false;
    this.fechaCreacion = fechaCreacion || new Date();
    this.creadoPor = creadoPor || 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
    this.fechaModificacion = fechaModificacion || new Date();
    this.modificadoPor = modificadoPor || 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
    this.usuarioCreadoPor = '';
    this.usuarioModificadoPor = '';
    this.companiasUnidades = companiaUnidad;
    this.companiasSelect = [];
      this.usuarioModificadoPor = '';
      this.usuarioCreadoPor = '';
      this.unidadRefCruzada = new unidadRefCruzada('', '', '', '');
      this.unidadBloqueos = [];
      this.asignacionActiva = asignacionActiva || 0;
    this.esPermisionario = esPermisionario || false;
    this.idPermisionario = idPermisionario || 0;
    this.nombrePermisionario = nombrePermisionario || '';

    this.idDepartamento = idDepartamento || 0,
    this.departamento = departamento || '',
    this.idTipoCombustible = idTipoCombustible || '',
    this.tipoCombustible = tipoCombustible || '',
    this.capacidadMaxima = capacidadMaxima || 0,
    this.referencia = referencia || '',
    this.kmsDia = kmsDia || 0,
    this.kmsAcum = kmsAcum || 0,
    this.rendimiento = rendimiento || 0,
    this. tarjetaCirculacion = tarjetaCirculacion || '',
    this.pesoVehicular = pesoVehicular || 0,
    this.noPermiso = noPermiso || 0,
    this.fechaVencimientoPermiso = fechaVencimientoPermiso || new Date(),
    this.noSerieMotor = noSerieMotor || '',
    this.idTipoMotor = idTipoMotor || '',
    this.tipoMotor = tipoMotor || '',
    this.polizaSegUnidades = [],
    this.configuracionTipoUnidades = new ConfiguracionTipoUnidad(),

    // UNIDAD OPERADOR
    this.idUnidadOperador = idUnidadOperador || 0;
    this.idOperador = idOperador || 0;
    this.operador = operador || '';
    this.unidadOpUsuarioCreadoPor = unidadOpUsuarioCreadoPor || '';
    this.unidadOpUsuarioModificadoPor = unidadOpUsuarioModificadoPor || '';
    this.unidadOpCreadoPor = unidadOpCreadoPor || '';
    this.unidadOpModificadoPor = unidadOpModificadoPor || '';
    this.unidadOpFechaCreacion = unidadOpFechaCreacion || new Date();
    this.unidadOpFechaModificacion = unidadOpFechaModificacion || new Date();
    this.unidadOpActivo = UnidadOpActivo || false;
    this.idTipoOperador = idTipoOperador || '';
    this.tipoOperador = tipoOperador || '';
  }
}

export class CompaniaUnidad {
  id: number;
  idCompania: number;
  idUnidad: number;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(
    id?: number,
    idCompania?: number,
    idUnidad?: number,
    activo: boolean = false,
    fechaCreacion?: Date,
    creadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string,
    
  ) {
    this.id = id || 0;
    this.idCompania = idCompania || 0;
    this.idUnidad = idUnidad || 0;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion || new Date();
    this.creadoPor = creadoPor || 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
    this.fechaModificacion = fechaModificacion || new Date();
    this.modificadoPor = modificadoPor || 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
    
  }
}
export class Companias  {   
  item_id: number;
  item_text: string;
  constructor(){
      this.item_id = 0;
      this.item_text = '';      
  }
}

export class unidadRefCruzada {
  idUnidad: number;
  idRefHG?: string;
  idRefCH: string;
  idRefRL: string;
  idRefLinda: string;
  constructor(
    idUnidad: string,
    idRefHG?: string,
    idRefCH?: string,
    idRefRL?: string,
    idRefLinda?: string
  )
  {
  this.idUnidad = 0;
  this.idRefHG = '';
  this.idRefCH = '';
  this.idRefRL = '';
  this.idRefLinda = '';
  }
}


export class UnidadBloqueo {
  idUnidadBloqueo: number;
  idUnidad: number;
  bloqueo: boolean;
  idCausa: number;
  fechaVencimiento: Date;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(
    idUnidadBloqueo?: number,
    idUnidad?: number,
    bloqueo?: boolean,
    idCausa?: number,
    fechaVencimiento?: Date,
    activo?: boolean,
    fechaCreacion?: Date,
    creadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string
  ) {
    this.idUnidadBloqueo = idUnidadBloqueo || 0;
    this.idUnidad = idUnidad || 0;
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

