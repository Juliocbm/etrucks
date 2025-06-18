
export class Modulo{

    id:number;
    nombre:string;
    menus: Menu[];
    constructor(){
        this.id = 0;
        this.nombre = '';
        this.menus = [];
    }
}

export class Menu{

    id:number;
    idPadre: number;
    nombre:string;
    asignar: boolean;
    todos: boolean;
    crear: boolean;
    editar: boolean;
    eliminar: boolean;
    imprimir: boolean;
    descargar: boolean;

    constructor(){
        this.id = 0;
        this.idPadre = 0;
        this.nombre = '';
        this.asignar = false;
        this.todos = false;
        this.crear = false;
        this.editar = false;
        this.eliminar = false;
        this.imprimir = false;
        this.descargar = false;

    }
}

export class RolModulos{

    id:number;
    nombre:string;
    modulos: Modulo[];
    activo:boolean;
    creadoPor:string;
    modificadoPor:string;
    fechaCreacion:Date;
    fechaModificacion:Date;
    idCompania:number;
    idSistema:number;
    nomUsuarioCreadoPor:string;
    nomUsuarioModificadoPor:string;

    constructor(){
        this.id = 0;
        this.nombre = '';
        this.modulos = [];
        this.activo = true;
        this.creadoPor = '';
        this.modificadoPor = '';
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
        this.idCompania = 0;
        this.idSistema = 1;
        this.nomUsuarioCreadoPor = '';
        this.nomUsuarioModificadoPor ='';

    }
}

export class MenuDTO{
    id:number;
    idPadre:number;
    nombre:string;
    permisos:MenuPermisoDTO[];
    asignar:boolean;
    constructor(){
        this.id = 0;
        this.idPadre = 0;
        this.nombre = '';
        this.permisos = [];
        this.asignar = false;
    }
}

export class MenuPermisoDTO{
    idMenuPermiso:number;
    idMenu:number;
    idPermiso:number;
    permiso:string;
    asignado:boolean;
    constructor(){
        this.idMenuPermiso = 0;
        this.idMenu = 0;
        this.idPermiso = 0;
        this.permiso = '';
        this.asignado = false;
    }
}