export class PersonalBanco {
    idPersonalBanco: number;
    idPersonal: number;
    nombre: string;
    idBanco: number;
    banco: string;
    noCuenta: string;
    clave: string;
    idCompania: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;

    constructor() {
        this.idPersonalBanco = 0;
        this.idPersonal = 0;
        this.nombre = '';
        this.idBanco = 0;
        this.banco = '';
        this.noCuenta = '';
        this.clave = '';
        this.idCompania = 0;
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '';
        this.usuarioCreadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.usuarioModificadoPor = '';
    }
}
