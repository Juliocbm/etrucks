export class TraficoGuia {
    numGuia: string;
    fechaIngreso: Date;
    pdf64: string;
    xml64: string;
    pod64: string;
    uuid?: string;

    constructor(numGuia: string, fechaIngreso: Date, xml64:string, pdf64: string, pod64: string, uuid?: string) {
        this.numGuia = numGuia;
        this.fechaIngreso = fechaIngreso;
        this.xml64 = xml64;
        this.pdf64 = pdf64;
        this.pod64 = pod64;
        this.uuid = uuid;
    }
}
