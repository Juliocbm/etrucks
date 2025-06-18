
//Define la interfaz para Categoria
export interface ICategoria {
    idCategoria: number;
    nombre: string;
    idTipoCategoria: string;
    nomTipoCategoria: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date ;
    modificadoPor: string;
    companiaCategoria: CompaniaCategoria[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    companiasSelect:any[];
  }

  export class Categoria implements ICategoria {   
    idCategoria: number;
    nombre: string;
    idTipoCategoria: string;
    nomTipoCategoria: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    companiaCategoria:CompaniaCategoria[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    companiasSelect:any[];

    constructor( activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
      this.idCategoria = 0;
      this.nombre = '';
      this.idTipoCategoria = '';  
      this.nomTipoCategoria = '';  
      this.activo = activo || true;
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.companiaCategoria = [];
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.companiasSelect = [];
    }   
  } 

    export class CompaniaCategoria  {   
        id:number;
        idCategoria: number;
        idCompania: number;
        nombreCorto?: string;
        activo: boolean;
        fechaCreacion: Date | null;
        creadoPor: string;
        fechaModificacion: Date | null;
        modificadoPor: string;
        constructor(activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date){
            this.id = 0;
            this.idCategoria = 0;
            this.idCompania = 0;    
            this.activo = activo || false;
            this.creadoPor = '00000000-0000-0000-0000-000000000000';
            this.fechaCreacion = fechaCreacion || new Date();
            this.modificadoPor = '00000000-0000-0000-0000-000000000000';
            this.fechaModificacion = fechaModificacion || new Date();
            this.nombreCorto = '';        
        }
    }   