import { Estado } from "./Plaza";

export class Companias  {   
  item_id: number;
  item_text: string;
  constructor(){
      this.item_id = 0;
      this.item_text = '';      
  }
}
  
  export class TipoSeguimientoViaje {
    idTipoSeguimientoViaje: number;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    companiaSeguimientoViajes: CompaniaSeguimientoViajeItem[];
    companiasSelect: any[];
    seguimientoViajeConfigs: seguimientoViajeConfigs[];
    idCompania:number;
    constructor(
      idTipoSeguimientoViaje?: number ,
      nombre?: string ,
      activo?: boolean ,
      fechaCreacion?:  Date,
      creadoPor?: string ,
      fechaModificacion?:  Date,
      modificadoPor?: string,
      usuarioCreadoPor?: string,
      usuarioModificadoPor?: string,
      companiaSeguimientoViajes: CompaniaSeguimientoViajeItem[] = [],
      companiasSelect?: [],
      seguimientoViajeConfigs: seguimientoViajeConfigs[] = [],
      idCompania?:number
      
    ) {
      this.idTipoSeguimientoViaje = 0;
      this.nombre = '';
      this.activo = activo || false;
      this.fechaCreacion = new Date();
      this.creadoPor = 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
      this.fechaModificacion = new Date();;
      this.modificadoPor = 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.companiaSeguimientoViajes = companiaSeguimientoViajes;
      this.companiasSelect = [];
      this.seguimientoViajeConfigs = [];
      this.idCompania = idCompania || 0;
    }
  }

 
  
  export class CompaniaSeguimientoViajeItem {
    id: number;
    idTipoSeguimientoViaje: number;
    idCompania: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
  
    constructor(
      id?: number ,
      idTipoSeguimientoViaje?: number ,
      idCompania?: number ,
      activo: boolean = false,
      fechaCreacion?: Date ,
      creadoPor?: string ,
      fechaModificacion?: Date ,
      modificadoPor?: string 
    ) {
      this.id = 0;
      this.idTipoSeguimientoViaje = 0;
      this.idCompania = 0;
      this.activo = activo || false;
      this.fechaCreacion = new Date();
      this.creadoPor = 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
      this.fechaModificacion = new Date();
      this.modificadoPor = 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
    }
  }
export class RemolqueEstatus
{
  idRemolqueEstatus: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  constructor(
  idRemolqueEstatus: number,
  nombre: string,
  activo: boolean,
  fechaCreacion: Date,
  creadoPor: string,
  fechaModificacion: Date,
  modificadoPor: string,
  )
  {
    this.idRemolqueEstatus = 0;
    this.nombre = '';
    this.activo = false;
    this.fechaCreacion = new Date();
    this.creadoPor = '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = new Date();
    this.modificadoPor = ''
  }
}
export class UnidadEstatus {
  idUnidadEstatus: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(
    idUnidadEstatus: number,
    nombre: string,
    activo: boolean,
    fechaCreacion: Date,
    creadoPor: string,
    fechaModificacion: Date,
    modificadoPor: string
  ) {
    this.idUnidadEstatus = 0;
    this.nombre = '';
    this.activo = false;
    this.fechaCreacion = new Date();
    this.creadoPor = '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = new Date();
    this.modificadoPor = '00000000-0000-0000-0000-000000000000';
  }
}

export class TipoServicio {
  idTipoServicio: number;
  clave: string;
  nombre: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(
    idTipoServicio: number,
    clave: string,
    nombre: string,
    activo: boolean,
    fechaCreacion: Date,
    creadoPor: string,
    fechaModificacion: Date,
    modificadoPor: string
  ) {
    this.idTipoServicio = 0;
    this.clave = '';
    this.nombre = '';
    this.activo = false;
    this.fechaCreacion = new Date();
    this.creadoPor = '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = new Date();
    this.modificadoPor = '00000000-0000-0000-0000-000000000000';
  }
}

export class ViajeEstatus {
  idViajeEstatus: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  constructor(
    idViajeEstatus: number,
  nombre: string,
  activo: boolean,
  fechaCreacion: Date,
  creadoPor: string,
  fechaModificacion: Date,
  modificadoPor: string
  )
  {
    this.idViajeEstatus = idViajeEstatus || 0;
    this.nombre = nombre || '' ;
    this.activo = activo || false;
    this.fechaCreacion = fechaCreacion || new Date();
    this.creadoPor = creadoPor || '';
    this.fechaModificacion = fechaCreacion || '';
    this.modificadoPor = modificadoPor || '';
  }
}
  export class seguimientoViajeConfigs
  {
    idSeguimientoViajeConfig: number;
    idTipoOperacion: string;
    idTipoSeguimientoViaje: number;
    idTipoCicloViaje: string;
    tipoCicloViaje: string;
    noOrden: number;
    idViajeEstatus: string;
    idUnidadEstatus: number | null;
    idRemolqueEstatus: number | null;
    esDefault: boolean;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

     // Nuevas propiedades para almacenar los nombres seleccionados de los combos
  tipoCicloViajeSeleccionado?: string;
  viajeEstatusSeleccionado?: string;
  unidadEstatusSeleccionado?: string;
  remolqueEstatusSeleccionado?: string;
  tipoServicioSeleccionado?: string;

  remolqueEstatus?: RemolqueEstatus;
  unidadEstatus?: UnidadEstatus;
  tipoServicio?: TipoServicio;
  viajeEstatus?: ViajeEstatus;

    constructor(
      idSeguimientoViajeConfig?: number,
      // idTipoServicio?: number,
      idTipoSeguimientoViaje?: number,
      idTipoCicloViaje?: string,
      tipoCicloViaje?: string,
      noOrden?: number,
      idViajeEstatus?: number,
      idUnidadEstatus?: number | null,
      idRemolqueEstatus?: number | null,
      esDefault?: boolean,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      remolqueEstatus?: RemolqueEstatus | undefined,
      unidadEstatus?: UnidadEstatus,
      tipoServicio?: TipoServicio,
      viajeEstatus?: ViajeEstatus | undefined
    )
    {
    this.idSeguimientoViajeConfig = 0;
    this.idTipoOperacion = '';
    this.idTipoSeguimientoViaje = 0;
    this.idTipoCicloViaje = '00000000-0000-0000-0000-000000000000';
    this.tipoCicloViaje = tipoCicloViaje || '';
    this.noOrden = 0;
    this.idViajeEstatus = '';
    this.idUnidadEstatus = 0 ;
    this.idRemolqueEstatus = 0;
    this.esDefault = esDefault || false;
    this.activo= false;
    this.fechaCreacion = new Date();
    this.creadoPor = 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';
    this.fechaModificacion = new Date();
    this.modificadoPor = 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002';

     // Inicializa las nuevas propiedades
     this.tipoCicloViajeSeleccionado = this.tipoCicloViajeSeleccionado || tipoCicloViaje;
     this.viajeEstatusSeleccionado = this.viajeEstatusSeleccionado ;
     this.unidadEstatusSeleccionado = this.unidadEstatusSeleccionado || unidadEstatus?.nombre;
     this.remolqueEstatusSeleccionado = this.remolqueEstatusSeleccionado || remolqueEstatus?.nombre ;
     this.tipoServicioSeleccionado = '';

     this.remolqueEstatus = remolqueEstatus || new RemolqueEstatus(0, '', false, new Date(), '', new Date(), '');
     this.unidadEstatus = unidadEstatus || new UnidadEstatus(0, '', false, new Date(), '', new Date(), '');
     this.tipoServicio = tipoServicio || new TipoServicio(0, '', '', false, new Date(), '', new Date(), '');
     this.viajeEstatus = viajeEstatus || new ViajeEstatus(0, '',  false, new Date(), '', new Date(), '');

    }
  }
  
  