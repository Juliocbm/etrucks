export interface ITipoCaja {
    idTipoCaja: number;
    nombre: string;
    clave: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
}

export class TipoCaja implements ITipoCaja {
    idTipoCaja: number;
    nombre: string;
    clave: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    constructor(
        idTipoCaja?: number,
        nombre?: string,
        clave?: string,
        activo?: boolean,
        fechaCreacion?: Date,
        creadoPor?: string,
        usuarioCreadoPor?: string,
        fechaModificacion?: Date,
        modificadoPor?: string,
        usuarioModificadoPor?: string
    ) {
        this.idTipoCaja = idTipoCaja || 0;
        this.nombre = nombre || '';
        this.clave = clave || '';
        this.activo = activo || true;
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = usuarioCreadoPor || '';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = usuarioModificadoPor || '';
    }
}


