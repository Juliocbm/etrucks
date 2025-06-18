export class Concepto {
    id: number;
    no_guia: number;
    cantidad?: number;
    importe?: number;
    descripcion?: string;
    montoIvaOtro?: number;
    factorIva?: number;
    montoRetencion?: number;
    factorRetencion?: number;
    claveProdServ?: string;
    idConceptolis?: number;
    cpeNoIdentificador?: string;
    fechaInsert?: Date;
    editable?:boolean;
    tieneErrores?:boolean;
    errores: any

    constructor(
        id:number,
        no_guia: number,
        cantidad?: number,
        importe?: number,
        descripcion?: string,
        montoIvaOtro?: number,
        factorIva?: number,
        montoRetencion?: number,
        factorRetencion?: number,
        claveProdServ?: string,
        idConceptolis?: number,
        cpeNoIdentificador?: string,
        fechaInsert?: Date,
        editable?:boolean
    ) {
        this.id = id;
        this.no_guia = no_guia;
        this.cantidad = cantidad;
        this.importe = importe;
        this.descripcion = descripcion;
        this.montoIvaOtro = montoIvaOtro;
        this.factorIva = factorIva;
        this.montoRetencion = montoRetencion;
        this.factorRetencion = factorRetencion;
        this.claveProdServ = claveProdServ;
        this.idConceptolis = idConceptolis;
        this.cpeNoIdentificador = cpeNoIdentificador;
        this.fechaInsert = fechaInsert;
        this.editable = editable;
    }
}
