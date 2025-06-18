
export interface IEstatusAsistencia {
    idEstatus: number;
    nombre: string;
    clave: string;
    descripcion: string;
    monto: number, 
    pagar: boolean;
    activo: boolean;
    idTipoEstatusAsistencia: string,
    tipoEstatusAsistencia: string,
    fechaCreacion: Date ;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    companiaEstatusAsistencia: CompaniaEstatusAsistencia[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
}

export class EstatusAsistencia implements IEstatusAsistencia {
    idEstatus: number;
    nombre: string;
    clave: string;
    descripcion: string;
    monto: number;
    pagar:boolean;
    activo: boolean;
    idTipoEstatusAsistencia: string;
    tipoEstatusAsistencia: string;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    companiaEstatusAsistencia: CompaniaEstatusAsistencia[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    constructor(activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
        this.idEstatus = 0;
        this.nombre = '';
        this.clave = '';
        this.descripcion = '';
        this.monto = 0;
        this.pagar = true;
        this.activo = activo || true;
        this.idTipoEstatusAsistencia = '';
        this.tipoEstatusAsistencia = '';
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaCreacion = fechaCreacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = fechaModificacion || new Date();
        this.companiaEstatusAsistencia = [];
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
    }
}

export class CompaniaEstatusAsistencia {
    id: number;
    idEstatus: number;
    idCompania: number;
    nombreCorto: string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    constructor(activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
        this.id = 0;
        this.idEstatus = 0;
        this.idCompania = 0;
        this.activo = activo || false;
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaCreacion = fechaCreacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = fechaModificacion || new Date();
        this.nombreCorto = '';
    }
}  