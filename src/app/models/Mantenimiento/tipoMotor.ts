import { RendimientoMotor } from "../Despacho/RendimientoMotor";

export interface ITipoMotor {
    idTipoMotor: string;
    clave: string;
    nombre: string;
    activo: boolean;
    idCompania: number;
    compania: string;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
}


export class TipoMotor implements ITipoMotor {
    idTipoMotor: string;
    clave: string;
    nombre: string;
    activo: boolean;
    idCompania: number;
    compania: string;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    rendimientoMotor: RendimientoMotor[];
    constructor(fechaCreacion?: Date, fechaModificacion?: Date ) {
        this.idTipoMotor = '00000000-0000-0000-0000-000000000000';
        this.clave = '';
        this.nombre = '';
        this.activo = true;
        this.idCompania = 0;
        this.compania = '';
        this.rendimientoMotor = [];
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaCreacion = fechaCreacion || new Date();
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';
    }
}

export class TipoMotorModded implements TipoMotor {
    idTipoMotor: string;
    clave: string;
    nombre: string;
    activo: boolean;
    idCompania: number;
    compania: string;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    rendimientoMotor: RendimientoMotor[];
    cargado: number;
    vacio: number;
    unidad: number;
    constructor(fechaCreacion?: Date, fechaModificacion?: Date ) {
        this.idTipoMotor = '00000000-0000-0000-0000-000000000000';
        this.clave = '';
        this.nombre = '';
        this.activo = true;
        this.idCompania = 0;
        this.compania = '';
        this.rendimientoMotor = [];
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaCreacion = fechaCreacion || new Date();
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';

        this.cargado = 0;
        this.vacio = 0;
        this.unidad = 0;
    }
}