export class MunicipioModel {
    idMunicipio: number;
    cveMunicipio: string;
    nombre: string;
    idEstado: number;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion: Date;

    constructor() {
        this.idMunicipio = 0;
        this.cveMunicipio = '';
        this.nombre = '';
        this.idEstado = 0;
        this.activo = true;
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
    }
}
