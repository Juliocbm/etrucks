export class Guia {
    idGuia: number;
    idCompania: number;
    folioCompania: number;
    idGuiaEstatus: number;
    idViaje: number;
    idTipoOperacion: string;
    idCliente: string;
    idClienteOrigen: string;
    idClienteDestino: string;
    idRuta: number;
    idRemolque: number;
    idUnidad: number;
    idMoneda: number | null;
    subTotal: number;
    totalImpRetencion: number;
    totalImpTraslado: number;
    total: number;
    poliza: string | null;
    fechaContabilizada: Date | null;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    detalles: GuiaDetalle[];
    mercanciasCCP: GuiaMercanciaCCP[];

    constructor() {
        this.idGuia = 0;
        this.idCompania = 0;
        this.folioCompania = 0;
        this.idGuiaEstatus = 0;
        this.idViaje = 0;
        this.idTipoOperacion = '';
        this.idCliente = '';
        this.idClienteOrigen = '';
        this.idClienteDestino = '';
        this.idRuta = 0;
        this.idRemolque = 0;
        this.idUnidad = 0;
        this.idMoneda = null;
        this.subTotal = 0;
        this.totalImpRetencion = 0;
        this.totalImpTraslado = 0;
        this.total = 0;
        this.poliza = null;
        this.fechaContabilizada = null;
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.detalles = [];
        this.mercanciasCCP = [];
    }
}
export class GuiaDetalle {
    idGuiaDetalle: number;
    idGuia: number;
    idCompania: number;
    numConsecutivo: number;
    cveProdServSAT?: string;
    idConcepto: number;
    precioUnitario: number;
    impuestoRet: number;
    valorImpRet: number;
    impuestoTras: number;
    valorImpTras: number;
    total: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

    constructor() {
        this.idGuiaDetalle = 0;
        this.idGuia = 0;
        this.idCompania = 0;
        this.numConsecutivo = 0;
        this.cveProdServSAT = '';
        this.idConcepto = 0;
        this.precioUnitario = 0;
        this.impuestoRet = 0;
        this.valorImpRet = 0;
        this.impuestoTras = 0;
        this.valorImpTras = 0;
        this.total = 0;
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
    }
}
export class GuiaMercanciaCCP {
    idMercanciaCCP: number;
    idGuia: number;
    idCompania: number;
    numConsecutivo: number;
    cveProdServSAT?: string | null;
    descripcion?: string | null;
    cveUnidad?: string | null;
    cantidad: number;
    peso: number;
    fraccionArancelaria?: string | null;
    matPeligroso: boolean;
    cveMaterialPeligroso?: string;
    idMoneda: number | null;
    numPedimento?: string | null;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;

    constructor() {
        this.idMercanciaCCP = 0;
        this.idGuia = 0;
        this.idCompania = 0;
        this.numConsecutivo = 0;
        this.cveProdServSAT = null;
        this.descripcion = null;
        this.cveUnidad = null;
        this.cantidad = 0;
        this.peso = 0;
        this.fraccionArancelaria = null;
        this.matPeligroso = false;
        this.cveMaterialPeligroso = ''
        this.idMoneda = null;
        this.numPedimento = null;
        this.activo = false;
        this.fechaCreacion = new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
    }
}
