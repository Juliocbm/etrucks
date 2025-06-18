export class EstadoModel {
    idEstado: number;
    cveEstado: string;
    nombre: string;
    idPais: number;
    activo: boolean;
    fechaCreacion: Date;
    fechaModificacion: Date;

    constructor() {
        this.idEstado = 0;
        this.cveEstado = '';
        this.nombre = '';
        this.idPais = 0;
        this.activo = true;
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
    }
}
