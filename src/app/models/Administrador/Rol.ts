export class Rol {
    id:number;
    nombre: string;
    descripcion: string;
    usuarioCreadoPor:string;
    usuarioModificadoPor:string;
    idSistema:number;
    idCompania:number;
    activo:boolean;
    creadoPor:string;
    modificadoPor:string;
    fechaCreacion:Date;
    fechaModificacion:Date;
    rolPermisos: RolPermiso[];
    constructor(){
        this.id = 0;
        this.nombre = '';
        this.descripcion = '';
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
        this.idSistema = 0;
        this.idCompania = 0;
        this.activo = true;
        this.creadoPor = '';
        this.modificadoPor = '';
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
        this.rolPermisos = [];
    }
}

export class RolCompania {
    id:number;
    nombre:string;
    permisoHg:boolean;
    permisoCh:boolean;
    permisoLinda:boolean;
    permisoRl:boolean;
    permisoGta:boolean;
    constructor(){
        this.id = 0;
        this.nombre = '';
        this.permisoHg = false;
        this.permisoCh = false;
        this.permisoLinda = false;
        this.permisoRl = false;
        this.permisoGta = false;
    }
}

export class RolPermiso {
    idRolPermiso: number;
    idRol: number;
    idMenu: number;
    idPermiso: number;
    activo: boolean;
    creadoPor: string;
    modificadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    idPadre:number;
    constructor(){
        this.idRolPermiso = 0;
        this.idRol = 0;
        this.idMenu = 0;
        this.idPermiso = 0;
        this.activo = true;
        this.creadoPor = '';
        this.modificadoPor = '';
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
        this.idPadre = 0;
    }
}