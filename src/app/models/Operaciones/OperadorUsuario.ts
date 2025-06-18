export interface IOperadorUsuario {
    idOperadorUsuario: number;
    idPersonal: number;
    clave: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
}

export class OperadorUsuario implements IOperadorUsuario {
    idOperadorUsuario: number;
    idPersonal: number;
    clave: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    constructor() {
        this.idPersonal = 0;
        this.idOperadorUsuario = 0;
        this.clave = '';
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';;
    }
}
