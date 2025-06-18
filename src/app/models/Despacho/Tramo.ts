// Define la interfaz
 export interface ITramo {
    idTramo: number;
    nombre: string;
    idPlazaOrigen: number;
    plazaOrigen: string;
    idPlazaOrigenEstado: number;
    plazaOrigenEstado: string;
    idPlazaOrigenMunicipio: number;
    plazaOrigenMunicipio: string;
    idPlazaDest: number;
    plazaDest: string;
    idPlazaDestEstado: number;
    plazaDestEstado: string;
    idPlazaDestMunicipio: number;
    plazaDestMunicipio: string;
    distanciaKm: number;
    tiempoRec: number;
    idTipoCarretera: string;
    tipoCarretera: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    tramoCasetaPeajes:TramoCasetaPeaje[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    idTipoDirec:string;
  } 
  
  // Implementa la interfaz en la clase
  export class Tramo implements ITramo  {
    idTramo: number;
    nombre: string;
    idPlazaOrigen: number;
    plazaOrigen: string;
    idPlazaOrigenEstado: number;
    plazaOrigenEstado: string;
    idPlazaOrigenMunicipio: number;
    plazaOrigenMunicipio: string;
    idPlazaDest: number;
    plazaDest: string;
    idPlazaDestEstado: number;
    plazaDestEstado: string;
    idPlazaDestMunicipio: number;
    plazaDestMunicipio: string;
    distanciaKm: number;
    tiempoRec: number;
    idTipoCarretera: string;
    tipoCarretera: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    tramoCasetaPeajes:TramoCasetaPeaje[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    idTipoDirec:string;
    // Constructor para inicializar las propiedades
    constructor(
      idTramo?: number,
      nombre?: string,
      idPlazaOrigen?: number,
      plazaOrigen?: string,
      idPlazaOrigenEstado?: number,
      plazaOrigenEstado?: string,
      idPlazaOrigenMunicipio?: number,
      plazaOrigenMunicipio?: string,
      idPlazaDest?: number,
      plazaDest?: string,
      idPlazaDestEstado?: number,
      plazaDestEstado?: string,
      idPlazaDestMunicipio?: number,
      plazaDestMunicipio?: string,
      distanciaKm?: number,
      tiempoRec?: number,
      idTipoCarretera?: string,
      tipoCarretera?: string,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      tramoCasetaPeajes?:TramoCasetaPeaje[],
      usuarioCreadoPor?: string,
      usuarioModificadoPor?: string
    ) {
      this.idTramo = idTramo || 0;
      this.nombre = nombre || '';
      this.idPlazaOrigen = idPlazaOrigen || 0;
      this.plazaOrigen = plazaOrigen || '';
      this.idPlazaOrigenEstado = idPlazaOrigenEstado || 0;
      this.plazaOrigenEstado = plazaOrigenEstado || '';
      this.idPlazaOrigenMunicipio = idPlazaOrigenMunicipio || 0;
      this.plazaOrigenMunicipio = plazaOrigenMunicipio || '';
      this.idPlazaDest = idPlazaDest || 0;
      this.plazaDest = plazaDest || '';
      this.idPlazaDestEstado = idPlazaDestEstado || 0;
      this.plazaDestEstado = plazaDestEstado || '';
      this.idPlazaDestMunicipio = idPlazaDestMunicipio || 0;
      this.plazaDestMunicipio = plazaDestMunicipio || '';
      this.distanciaKm = distanciaKm || 0;
      this.tiempoRec = tiempoRec || 0;
      this.idTipoCarretera = '00000000-0000-0000-0000-000000000000';
      this.tipoCarretera = tipoCarretera || '';
      this.activo = activo || false;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.tramoCasetaPeajes = [];
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.idTipoDirec = '';
    }
  }
  

  export interface ITramoCasetaPeaje {
    idTramoCasetaPeaje: number;
    idTramo: number;
    idCasetaPeaje: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
  } 
  
  // Implementa la interfaz en la clase
  export class TramoCasetaPeaje implements ITramoCasetaPeaje {
    idTramoCasetaPeaje: number;
    idTramo: number;
    idCasetaPeaje: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
  
    // Constructor para inicializar las propiedades
    constructor(
      idTramoCasetaPeaje?: number,
      idTramo?: number,
      idCasetaPeaje?: number,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string
    ) {
      this.idTramoCasetaPeaje = idTramoCasetaPeaje || 0;
      this.idTramo = idTramo || 0;
      this.idCasetaPeaje = idCasetaPeaje || 0;
      this.activo = activo || false;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
  }


  export class CasetaPeaje {
    idCasetaPeaje: number;
    nombre: string;
   
    constructor(){
        this.idCasetaPeaje = 0;
        this.nombre = ''

    }
  } 
  
  