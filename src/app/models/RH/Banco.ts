
export class Banco{
    idBanco: number;
    idCompania: number;
    compania: string;
    claveSat: string;
    nombre: string;
    razonSocial: string;
    idTipoMoneda: string;
    tipoMoneda:string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    cuenta:string;
    clabe:string;

    constructor(){
    this.idBanco = 0;
    this.idCompania = 0;
    this.compania = '';
    this.claveSat = '';
    this.nombre = '';
    this.razonSocial = '';
    this.idTipoMoneda = '';
    this.tipoMoneda = '';
    this.activo = true;
    this.fechaCreacion = new Date;
    this.creadoPor = '';
    this.usuarioCreadoPor = '';
    this.fechaModificacion = new Date;
    this.modificadoPor = '';
    this.usuarioModificadoPor = '';
    this.clabe = '';
    this.cuenta = '';
    }
}
