
//Define la interfaz para Plaza
  export interface IPlaza {
    idPlaza: number;
    nombre: string;
    idPais: number;
    idEstado: number;
    idMunicipio: number;
    estado: string;
    municipio: string;
    pais: string;
    activo: boolean;
    creadoPor: string;
    usuarioCreadoPor:string;
    usuarioModificadoPor:string;
    clave:number;
  }

  export class Plaza implements IPlaza {
    
    idPlaza: number;
    nombre: string;
    idPais:number;
    pais: string;
    idEstado:number;
    estado: string;
    idMunicipio:number;
    municipio: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    activo: boolean;
    creadoPor: string;
    modificadoPor: string;
    usuarioCreadoPor:string;
    usuarioModificadoPor:string;
    clave:number;
    constructor(activo?: boolean, fechaCreacion?: Date,) {
      this.idPlaza = 0;
      this.nombre = '';
      this.idPais = 0;
      this.pais = '';
      this.idEstado = 0;
      this.estado = '';
      this.idMunicipio = 0;
      this.municipio = '';
      this.activo = activo || true;
      this.fechaCreacion = fechaCreacion || new Date();
      this.fechaModificacion = fechaCreacion || new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.clave = 0;
    }   
  }

  export class Pais {
    
    idPais: number;
    nombre: string;
    estados: Estado[];

    constructor() {
      this.nombre = '';
      this.idPais = 0;
      this.estados = [];
    }
    
  }

  export class Estado {

    idEstado: number;
    nombre: string;

    constructor() {
      this.nombre = '';
      this.idEstado = 0;  
    }
    
  }

  export class Municipio {
    
    idMunicipio: number;
    nombre: string;

    constructor() {
      this.nombre = '';
      this.idMunicipio = 0;  
    }
    
  }