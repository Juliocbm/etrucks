
export interface IUnidadOperador {
    idUnidadOperador: number;
    idUnidad: number;
    idOperador: number;
    activo: boolean;
    creadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    fechaModificacion: Date;
}

export class UnidadOperador implements IUnidadOperador {
    idUnidadOperador: number;
    idUnidad: number;
    unidad: string;
    idOperador: number;
    operador: string;
    activo: boolean;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaModificacion: Date;
    claveUnidad: string;

    constructor(fechaCreacion?: Date, fechaModificacion?: Date) {
        this.idUnidadOperador = 0;
        this.idUnidad = 0;
        this.unidad = '';
        this.idOperador = 0;
        this.operador = '';
        this.activo = false;
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaCreacion = fechaCreacion || new Date();
        this.modificadoPor =  '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';
        this.fechaModificacion = fechaModificacion || new Date();

        this.claveUnidad = '';
    }
}