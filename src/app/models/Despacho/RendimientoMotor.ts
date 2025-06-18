export interface IRendimientoMotor {
    id: string;
    idTipoMotor: string;
    idTipoMovimiento: string;
    tipoMovimiento: string;
    rendimiento: number;
    activo: boolean;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
}

export class RendimientoMotor implements IRendimientoMotor {
    id: string;
    idTipoMotor: string;
    idTipoMovimiento: string;
    tipoMovimiento: string;
    rendimiento: number;
    activo: boolean;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    constructor(fechaCreacion?: Date, fechaModificacion?: Date ) {
        this.id = '00000000-0000-0000-0000-000000000000';
        this.idTipoMotor = '00000000-0000-0000-0000-000000000000';
        this.idTipoMovimiento = '00000000-0000-0000-0000-000000000000';
        this.tipoMovimiento = '';
        this.rendimiento = 0;
        this.activo = false;
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaCreacion = fechaCreacion || new Date();
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';
    }
}