export interface IConfiguracionTipoUnidad {
    idConfigTipoUnidad: string;
    idTipoUnidad: string;
    tipoUnidad: string;
    numLlantas: number;
    idConfigVehicular: number;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaModificacion: Date;
    claveConfigVehicular: string;
    descripcionConfigVehicular: string;
}

export class ConfiguracionTipoUnidad implements IConfiguracionTipoUnidad {
    idConfigTipoUnidad: string;
    idTipoUnidad: string;
    tipoUnidad: string;
    numLlantas: number;
    idConfigVehicular: number;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaModificacion: Date;
    claveConfigVehicular: string;
    descripcionConfigVehicular: string;
    constructor(fechaCreacion?: Date, fechaModificacion?: Date) {
        this.idConfigTipoUnidad = '';
        this.idTipoUnidad = '';
        this.tipoUnidad = '';
        this.numLlantas = 0;
        this.idConfigVehicular = 0;
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaCreacion = fechaCreacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';
        this.fechaModificacion = fechaModificacion || new Date();
        this.claveConfigVehicular = '';
        this.descripcionConfigVehicular = '';
    }

}