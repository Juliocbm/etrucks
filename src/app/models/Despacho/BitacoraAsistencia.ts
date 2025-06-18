

export interface IBitacoraAsistencia {
    idBitacoraAsistencia: number;
    idOperador: number;
    idPeriodo: number;
    fechaDia:Date;
    fechaDiaFormat: string;
    idEstatusAsistencia: number;
    obsAsistencia:string;
    idTiempoExtra: number;
    obsTiempoExtra: string;
    idOtroMovimiento: number;
    obsMovimiento: string;
    idEstatusBitacora:string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    idTemp:number;
    temporal:boolean;
    nomAsistencia:string;
    nomTiempoExtra:string;
    nomOtrosMovs:string;
  }

  export class BitacoraAsistencia implements IBitacoraAsistencia {
    
    idBitacoraAsistencia: number;
    idOperador: number;
    idPeriodo: number;
    fechaDia:Date;
    fechaDiaFormat: string;
    idEstatusAsistencia: number;
    obsAsistencia:string;
    idTiempoExtra: number;
    obsTiempoExtra: string;
    idOtroMovimiento: number;
    obsMovimiento: string;
    idEstatusBitacora:string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    idTemp:number;
    temporal:boolean;
    nomAsistencia:string;
    nomTiempoExtra:string;
    nomOtrosMovs:string;

    constructor(imprimible?: boolean, activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
      this.idBitacoraAsistencia = 0;
      this.idOperador = 0;
      this.idPeriodo = 0
      this.fechaDia = new Date;
      this.fechaDiaFormat = '';
      this.idEstatusAsistencia = 0;
      this.obsAsistencia = '';
      this.idTiempoExtra = 0;    
      this.obsTiempoExtra = '';
      this.idOtroMovimiento = 0;
      this.obsMovimiento = '';
      this.idEstatusBitacora = '';
      this.activo = activo || true;
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
      this.idTemp = 0;
      this.temporal = false;
      this.nomAsistencia = "";
      this.nomTiempoExtra = "";
      this.nomOtrosMovs = "";
    }   
  } 