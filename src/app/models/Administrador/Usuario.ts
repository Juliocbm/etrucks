export class Usuario {
    id:string;
    usuario1:string;
    contraseña:string;
    nombres:string;
    apellidoPat:string;
    apellidoMat:string;
    activo:boolean;
    creadoPor:string;
    modificadoPor:string;
    fechaCreacion:Date;
    fechaModificacion:Date;
    email:string;
    usuarioRols:UsuarioRol[];
    companiasSelect: any[];
    rolAsignados: string;
    companias:string;
    usuarioCreadoPor:string;
    usuarioModificadoPor:string;
    idSistema: number;

    constructor(){
        this.id = '00000000-0000-0000-0000-000000000000';
        this.usuario1 = '';
        this.contraseña = '';
        this.nombres = '';
        this.apellidoPat ='';
        this.apellidoMat = '';
        this.activo = true;
        this.creadoPor = '';
        this.modificadoPor = '';
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
        this.email = '';
        this.usuarioRols = [];
        this.companiasSelect = []
        this.rolAsignados = '';
        this.companias = '';
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
        this.idSistema = 0;
        this.idSistema = 0;
}
}

export class UsuarioRol {

    id:number;
    idUsuario:string;
    idRol:number;
    creadoPor:string;
    modificadoPor:string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    idCompania:number;
    activo: boolean;

    constructor(){
        this.id = 0 ;
        this.idUsuario = '00000000-0000-0000-0000-000000000000';
        this.idRol = 0;
        this.creadoPor = '';
        this.modificadoPor = '';
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
        this.idCompania = 0;
        this.activo = true;
    }   
}

export class Companias  {   
    item_id: number;
    item_text: string;
    constructor(){
        this.item_id = 0;
        this.item_text = '';
        
    }
  }