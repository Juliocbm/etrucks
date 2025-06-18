export class Sustitucion {
    id: number;
    noGuia: number;
    compania: string;
    motivoRelacion: string;
    numGuia: string;
    uuid: string;

    constructor(
        id: number,
        noGuia: number,
        compania: string,
        motivoRelacion: string,
        numGuia: string,
        uuid: string
    ) {
        this.id = id;
        this.noGuia = noGuia;
        this.compania = compania;
        this.motivoRelacion = motivoRelacion;
        this.numGuia = numGuia;
        this.uuid = uuid;
    }
}
