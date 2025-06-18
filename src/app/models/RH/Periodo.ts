
//Define la interfaz para Categoria
export interface IPeriodo {
    idPeriodo: number;
    idCompania: number;
    compania:string;
    anio: number;
    semana: number;
    fechaInicio: Date | null;
    fechaFin: Date | null;
    idEstatus: string;
    estatus:string;
    consecutivo:number;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
  }

  export class Periodo implements IPeriodo {   
    idPeriodo: number;
    idCompania: number;
    compania:string;
    anio: number;
    semana: number;
    fechaInicio: Date 
    fechaFin: Date 
    idEstatus: string;
    consecutivo:number;
    estatus:string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;

    constructor( activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
      this.idPeriodo = 0;
      this.idCompania = 0;
      this.compania = '';
      this.anio = 0;
      this.semana = 0;
      this.fechaInicio = new Date();
      this.fechaFin =  new Date();
      this.idEstatus = '';   
      this.estatus = '';
      this.consecutivo = 0;
      this.activo = activo || true;
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.creadoPor = '';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
    }   
  } 