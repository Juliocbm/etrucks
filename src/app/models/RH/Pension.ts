export interface IPension {
    idPension: number;
    idOperador: number;
    idCompania: number;
    operador: string;
    noOficio: string;
    noExpediente: string;
    idTipoDescuento:string;
    tipoDescuento:string;
    valor: number; 
    observaciones: string;
    fechaExpiracion: Date | null;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
  }

  export class Pension implements IPension {   
    idPension: number;
    idCompania: number;
    idOperador: number;
    operador: string;
    noOficio: string;
    noExpediente: string;
    idTipoDescuento:string;
    tipoDescuento:string;
    valor: number; 
    observaciones: string;
    fechaExpiracion: Date | null;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;

    constructor( activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date, fechaExpiracion?: Date, idOperador?: number) {
      this.idPension = 0;
      this.idOperador  = idOperador || 0;;
      this.idCompania = 0;
      this.operador = '';
      this.idTipoDescuento = '' ;
      this.tipoDescuento = '';
      this.noOficio = '';
      this.noExpediente = '';  
      this.valor = 0;
      this.observaciones = '';
      this.fechaExpiracion = fechaExpiracion || new Date();
      this.activo = true;
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.creadoPor = '';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
    }   
  } 

  export class ReportePension  {   
    idPensionCalculo: number;
    fechaCreacion: Date;
    idOperador: number;
    operador: string;
    tipoPension: string;
    cantidad: string;
    monto: number;
    fechaAplica:Date;
    idLiquidacion:number;
    observaciones: string; 
    usuario: string;
    idCompania: number;
   

    constructor( ) {
      this.idPensionCalculo = 0;
      this.fechaCreacion  = new Date();
      this.idOperador = 0;
      this.operador = '';
      this.tipoPension = '' ;
      this.cantidad = '';
      this.monto = 0;
      this.fechaAplica = new Date();  
      this.idLiquidacion = 0;
      this.observaciones = '';
      this.usuario = '';
      this.idCompania = 0;
     
    }   
  } 