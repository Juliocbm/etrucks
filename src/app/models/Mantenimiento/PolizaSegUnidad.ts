export interface IPolizaSegUnidad {
    idPolizaSegUnidad: string;
    idPolizaSeg: string;
    idUnidad: number;
    idAseguradora: string;
    aseguradora: string;
    idTipoPoliza: string;
    tipoPoliza: string;
    noPoliza: string;
    inciso: string;
    fechaVencimiento: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaModificacion: Date;
    activo: boolean;
}

export class PolizaSegUnidad implements IPolizaSegUnidad {
    idPolizaSegUnidad: string;
    idPolizaSeg: string;
    idUnidad: number;
    idAseguradora: string;
    aseguradora: string;
    idTipoPoliza: string;
    tipoPoliza: string;
    noPoliza: string;
    inciso: string;
    fechaVencimiento: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaModificacion: Date;
    activo: boolean;
    constructor(fechaCreacion?: Date, fechaModificacion?: Date) {
        this.idPolizaSegUnidad = '';
        this.idPolizaSeg = '';
        this.idUnidad = 0;
        this.idAseguradora = '';
        this.aseguradora = '';
        this.idTipoPoliza = '';
        this.tipoPoliza = '';
        this.noPoliza = '';
        this.inciso = '';
        this.fechaVencimiento = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaCreacion = fechaCreacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';
        this.fechaModificacion = fechaModificacion || new Date();
        this.activo = true;
    }
}