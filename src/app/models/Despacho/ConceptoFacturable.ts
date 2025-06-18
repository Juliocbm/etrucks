export class ConceptoFacturable {
    idConceptoFacturable: number;
    nombre: string;
    clave: string;
    tipoNaturaleza: string;
    nombreTipoNaturaleza: string;
    tipoImpuesto: string;
    tipoImpTasa: number;
    cuenta: number;
    subcuenta: number;
    cveProdServSat: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;

    constructor(
    ) {
        this.idConceptoFacturable = 0;
        this.nombre = '';
        this.clave = '';
        this.tipoNaturaleza = '';
        this.nombreTipoNaturaleza = '';
        this.tipoImpuesto = 'IVA';
        this.tipoImpTasa = 16;
        this.cuenta = 0;
        this.subcuenta = 0;
        this.cveProdServSat = '';
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '';
        this.usuarioCreadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.usuarioModificadoPor = '';
    }
}
