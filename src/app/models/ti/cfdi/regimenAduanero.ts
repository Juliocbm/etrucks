export class RegimenAduanero {
    id: number;
    noGuia: number;
    compania: string;
    regimenAduanero: string;
    fechaInsert: Date | null;
    editable?:boolean;
    errores: any
    
    constructor(
        id: number,
        noGuia: number,
        compania: string,
        regimenAduanero: string,
        fechaInsert: Date | null,
        editable?:boolean
    ) {
        this.id = id;
        this.noGuia = noGuia;
        this.compania = compania;
        this.regimenAduanero = regimenAduanero;
        this.fechaInsert = fechaInsert;        
        this.editable = editable;
    }
}
