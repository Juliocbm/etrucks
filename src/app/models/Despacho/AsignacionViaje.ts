export interface IAsignacionViaje {
    idAsignacionViaje: number;
    idCompania: number;
    idPedido: number | null;
    idViaje: number | null;
    idUnidad: number;
    idOperador: number;
    operador: string;
    activo: boolean;
    imprimir: boolean;

    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
}

export class AsignacionViaje implements IAsignacionViaje {
    idAsignacionViaje: number;
    idCompania: number;
    idPedido: number | null;
    idViaje: number | null;
    idUnidad: number;
    idOperador: number;
    operador: string;
    activo: boolean;
    imprimir: boolean;

    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    constructor( fechaCreacion?: Date, fechaModificacion?: Date ) {
        this.idAsignacionViaje = 0;
        this.idCompania = 0;
        this.idPedido = 0;
        this.idViaje = 0;
        this.idUnidad = 0;
        this.idOperador = 0;
        this.activo = false;
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';

        this.imprimir = false;
        this.operador = '';
    }
}