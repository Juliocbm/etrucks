export class Mercancia {
    id: number;
    no_guia: number;
    cantidad: number;
    peso?: number;
    claveProdServ?: string;
    fraccionArancelaria?: string;
    pedimento?: string;
    descripcion?: string;
    claveUnidad?: string;
    claveUnidadPeso?: string;
    esMaterialPeligroso?: string;
    cveMaterialPeligroso?: string;
    valorMercancia?: number;
    descripcionMateria?: string;
    tipoMateria?: string;
    editable?:boolean;
    tieneErrores?:boolean;
    errores: any
    [key: string]: any; // <-- agregá esto

    constructor(
        id: number,
        no_guia: number,
        cantidad: number,
        peso?: number,
        claveProdServ?: string,
        fraccionArancelaria?: string,
        pedimento?: string,
        descripcion?: string,
        claveUnidad?: string,
        claveUnidadPeso?: string,
        esMaterialPeligroso?: string,
        cveMaterialPeligroso?: string,
        valorMercancia?: number,
        descripcionMateria?: string,
        tipoMateria?: string,
        editable?:boolean,
        tieneErrores?:boolean
    ) {
        this.no_guia = no_guia;
        this.cantidad = cantidad;
        this.peso = peso;
        this.claveProdServ = claveProdServ;
        this.fraccionArancelaria = fraccionArancelaria;
        this.pedimento = pedimento;
        this.descripcion = descripcion;
        this.claveUnidad = claveUnidad;
        this.claveUnidadPeso = claveUnidadPeso;
        this.esMaterialPeligroso = esMaterialPeligroso;
        this.cveMaterialPeligroso = cveMaterialPeligroso;
        this.valorMercancia = valorMercancia;
        this.descripcionMateria = descripcionMateria;
        this.tipoMateria = tipoMateria;
        this.editable = editable;
        this.tieneErrores = tieneErrores;
        this.id = id;
    }
    
}
