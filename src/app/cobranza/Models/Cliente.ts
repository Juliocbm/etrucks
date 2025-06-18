export class Cliente {
    idCliente: number;
    nombre: string;
    rfc: string;

    constructor(idCliente: number, nombre: string, rfc: string) {
        this.idCliente = idCliente;
        this.nombre = nombre;
        this.rfc = rfc;
    }
}
