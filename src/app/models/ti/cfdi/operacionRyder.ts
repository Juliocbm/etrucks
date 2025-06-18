export class OperacionRyder
{
    id: number;
    noGuia: number;
    compania: string
    idOperacionRyder: number;
    idViajeRyder: number;
    fechaInsert: Date;    
    estatusEnvio: Boolean;

    constructor(
        id: number,
        noGuia: number,
        compania: string,
        idOperacionRyder: number,
        idViajeRyder: number,
        fechaInsert: Date,
        estatusEnvio: Boolean
    ) {
        this.id = id,
        this.noGuia = noGuia,
        this.compania = compania,
        this.idOperacionRyder = idOperacionRyder,
        this.idViajeRyder = idViajeRyder,
        this.fechaInsert = fechaInsert,
        this.estatusEnvio = estatusEnvio
    }
}
