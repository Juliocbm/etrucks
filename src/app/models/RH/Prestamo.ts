
//Define la interfaz para Categoria
export interface IPrestamo {
    idPrestamo: number;
    idOperador: number;
    operador: string;
    idTipoDescuento:string;
    tipoDescuento:string;
    idPeriodo: string;
    idTipoPrestamo: string;
    prestamo: string;
    periodo:string;
    total: number; 
    descuento: number; 
    saldo: number; 
    observaciones: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    tipoPrestamo: string;
  }

  export class Prestamo implements IPrestamo {   
    idPrestamo: number;
    idOperador: number;
    operador: string;
    idTipoDescuento:string;
    tipoDescuento:string;
    idPeriodo: string;
    periodo:string;
    idTipoPrestamo: string;
    prestamo: string;
    total: number; 
    descuento: number; 
    saldo: number; 
    observaciones: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    tipoPrestamo:string;

    constructor( activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
      this.idPrestamo = 0;
      this.idOperador = 0;
      this.operador = '';
      this.idTipoDescuento = '' ;
      this.tipoDescuento = '';
      this.idPeriodo = '';
      this.periodo = '';
      this.idTipoPrestamo = '';
      this.prestamo = '';
      this.total = 0;
      this.descuento = 0;
      this.saldo = 0;
      this.observaciones = '';
      this.activo = activo || true;
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.creadoPor = '';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.tipoPrestamo = '';
    }   
  } 