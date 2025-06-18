export class demorasRemolques{
    idRemolque: number;
    idLinea: string;
    cteActual: string;
    status: string;
    localidad: string;
    placa: string;
    tjCirculacion: string;
    ejecutivoSC: string;
    demora: string;
    diasDemora: string;
    costoDemora: number;
    tipoCambioDemora: string;
    frecuenciaDemora: string;
    fechaStatus: Date;
    constructor(){
        this.idRemolque = 0;
        this.idLinea = '';
        this.cteActual = '';
        this.status = '';
        this.localidad = '';
        this.placa = '';
        this.tjCirculacion = '';
        this.ejecutivoSC = '';
        this.demora = '';
        this.diasDemora = '';
        this.costoDemora = 0;
        this.tipoCambioDemora = '';
        this.frecuenciaDemora = '';
        this.fechaStatus = new Date();
    }
}