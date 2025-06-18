//Define la interfaz para SueldoTipoOperador
export interface ISueldoOperador {
    idSueldo: number;
    idCompania: number;
    compania:string;
    idTipoOperador: string;
    tipoOperador:string;
    idTipoSueldo: string;
    tipoSueldo:string;
    idTipoMovimiento: string;
    tipoMovimiento: string;
    valorKm: number;
    sueldoBase: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    sueldoPagoMovientos:SueldoPagoMoviento[];
  }

  export class SueldoOperador implements ISueldoOperador {   
    idSueldo: number;
    idCompania:  number;
    compania:string;
    idTipoOperador: string;
    tipoOperador:string;
    idTipoSueldo: string;
    tipoSueldo:string;
    idTipoMovimiento: string;
    tipoMovimiento: string;
    valorKm: number;
    sueldoBase: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    sueldoPagoMovientos:SueldoPagoMoviento[];

    constructor( activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
    
     this.idSueldo = 0;
     this.idCompania = 0;
     this.compania = '';
     this.idTipoOperador = '';
     this.tipoOperador = '';
     this.idTipoSueldo = '';
     this.tipoSueldo = '';
     this.idTipoMovimiento = '';
     this.tipoMovimiento = '';
     this.valorKm = 0;
     this.sueldoBase = 0;
      this.activo = activo || true;
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.sueldoPagoMovientos = [];

    }   
  } 


  export interface ISueldoPagoMoviento {
    idSueldoMovimiento: number;
    idSueldo: number;
    orden:number;
    minKm:number;
    maxKm:number;
    pago:number;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
  }

  export class SueldoPagoMoviento implements ISueldoPagoMoviento {   
    idSueldoMovimiento: number;
    idSueldo: number;
    orden:number;
    minKm:number;
    maxKm:number;
    pago:number;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;

    constructor( activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
    
      this.idSueldoMovimiento = 0;
      this.idSueldo= 0;
      this.orden = 0;
      this.minKm = 0;
      this.maxKm = 0;
      this.pago = 0;
      this.activo = activo || true;
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
    }   
  } 