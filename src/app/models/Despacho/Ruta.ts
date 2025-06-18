
export class Ruta {
    
  idRuta:number;
  nombre: string;
  idTipoRuta:string;
  tipoRuta:string|null;
  idPlazaOrigen: number;
  plazaOrigen:string| null;
  idPlazaDestino: number;
  plazaDestino:string| null;
  totalKm: number;
  totalTiempoRec: number;
  fechaCreacion:Date;
  fechaModificacion:Date;
  rutaCompania:RutaCompania[];
  rutaTramo:RutaTramo[];
  creadoPor: string;
  validaExisteRuta:string;
  activo:boolean;
  modificadoPor: string;
  usuarioModificadoPor: string;
  estadoOrigen:string;
  estadoDestino:string;
  idEstadoOrigen:number;
  idEstadoDestino:number;
  usuarioCreadoPor: string;
  companiasSelect:any[];
  clave:number;
  idClasificacionRuta: string;
  clasificacionRuta: string;

  constructor(creadoPor?: string, modificadoPor?: string, fechaCreacion?: Date, fechaModificacion?: Date) {
    this.idRuta = 0;
    this.nombre = '';
    this.idPlazaOrigen = 0;
    this.plazaOrigen = "";
    this.idPlazaDestino = 0;
    this.plazaDestino = "";
    this.idTipoRuta = '';
    this.tipoRuta = "";
    this.totalKm = 0;
    this.totalTiempoRec = 0;
    this.rutaCompania = [];
    this.rutaTramo = [];
    this.creadoPor = '';
    this.validaExisteRuta = "";
    this.fechaCreacion = fechaCreacion || new Date();
    this.fechaModificacion = fechaModificacion || new Date();
    this.activo = true;
    this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
    this.usuarioModificadoPor = "";
    this.usuarioCreadoPor = "";
    this.estadoOrigen = "";
    this.estadoDestino = "";
    this.idEstadoOrigen = 0;
    this.idEstadoDestino = 0;
    this.companiasSelect = [];
    this.clave = 0;
    this.idClasificacionRuta = '';
    this.clasificacionRuta = '';
  }
  
}

export class RutaCompania {

  idRuta: number;
  idCompania: number;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(){
    this.idRuta = 0;
    this.idCompania = 0;
    this.activo = true;
    this.fechaCreacion = new Date();
    this.creadoPor = '';
    this.fechaModificacion = new Date();
    this.modificadoPor= '';
  }
}

export class RutaTramo {

  idRuta: number;
  idTramo: number;
  secuencia: number;
  idTipoDirec: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(){
    this.idRuta = 0;
    this.idTramo = 0;
    this.secuencia = 0;
    this.idTipoDirec = '';
    this.activo = true;
    this.fechaCreacion = new Date();
    this.creadoPor = '';
    this.fechaModificacion = new Date();
    this.modificadoPor= '';
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

export class TramoGrid {
  asignar:boolean;
  idTramo: number;
  secuencia:number;
  idTipoDirec: string;
  nombre: string;
  idPlazaOrigen: number;
  plazaOrigen:string;
  idPlazaDest: number;
  plazaDest:string;
  distanciaKm: number;
  tiempoRec: number;
 
  constructor(){
    this.asignar = false;
    this.idTramo = 0;
    this.secuencia = 0;
    this.idTipoDirec = '';
    this.nombre = '';
    this.idPlazaOrigen = 0;
    this.plazaOrigen = '';
    this.idPlazaDest = 0;
    this.plazaDest = '';
    this.distanciaKm = 0;
    this.tiempoRec = 0;
  }
}



