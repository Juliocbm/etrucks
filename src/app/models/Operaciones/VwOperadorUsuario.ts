export interface IVwOperadorUsuario {
    idPersonal: number;
    nombre: string | null;
    idOperadorUsuario: number | null;
    clave: string | null;
    categoria: string | null;
    claveValida: boolean;
    activo: boolean | null;
    fechaCreacion: Date | null;
    creadoPor: string | null;
    usuarioCreadoPor: string | null;
    fechaModificacion: Date | null;
    modificadoPor: string | null;
    usuarioModificadoPor: string | null;
}

export class VwOperadorUsuario implements IVwOperadorUsuario {
    idPersonal: number;
    nombre: string | null;
    idOperadorUsuario: number | null;
    clave: string | null;
    categoria: string | null;
    claveValida: boolean;
    activo: boolean | null;
    fechaCreacion: Date | null;
    creadoPor: string | null;
    usuarioCreadoPor: string | null;
    fechaModificacion: Date | null;
    modificadoPor: string | null;
    usuarioModificadoPor: string | null;
    constructor() {
        this.idPersonal = 0;
        this.nombre = '';
        this.idOperadorUsuario = 0;
        this.clave = '';
        this.categoria = '';
        this.claveValida = false;
        this.activo = true;
        this.fechaCreacion = new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';;
        this.usuarioModificadoPor = '';
    }
}
