// Define la interfaz
export interface IElementoDetalle {
    idCatGenDetalle: string;
    idCatGeneral: string;
    idElemento:number;
    clave:string;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    tituloPantalla:string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
  } 
  
  // Implementa la interfaz en la clase
  export class ElementoDetalle implements IElementoDetalle  {
    idCatGenDetalle: string;
    idCatGeneral: string;
    idElemento:number;
    clave:string;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    tituloPantalla:string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    // Constructor para inicializar las propiedades
    constructor(
      idCatGenDetalle?: string,
      idCatGeneral?: string,
      idElemento?:number,
      clave?: string,
      nombre?: string,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      tituloPantalla?:string,
      usuarioCreadoPor?: string,
      usuarioModificadoPor?: string,
    ) {
      this.idCatGenDetalle = idCatGenDetalle || '00000000-0000-0000-0000-000000000000';
      this.idCatGeneral = idCatGeneral || '00000000-0000-0000-0000-000000000000';
      this.idElemento = idElemento || 0;
      this.nombre = nombre || '';
      this.clave = clave || '';
      this.activo = activo || false;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.tituloPantalla = '';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
    }
  }
  