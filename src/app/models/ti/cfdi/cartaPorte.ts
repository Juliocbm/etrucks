import { ArchivoCFDi } from "./ArchivoCfdi";
import { Concepto } from "./concepto";
import { ErrorTimbrado } from "./error";
import { Mercancia } from "./mercancia";
import { OperacionRyder } from "./operacionRyder";
import { RegimenAduanero } from "./regimenAduanero";
import { Sustitucion } from "./sustitucion";
import { Ubicacion } from "./ubicacion";

export class CartaPorte {
    id: number;
    noGuia: number;
    numGuia: string;
    statusGuia: string;
    compania: string;
    observacionesPedido?: string;
    sistemaTimbrado?: number;
    estatusTimbrado?: number;
    mensajeTimbrado?: string;
    fechaInsert?: Date ;
    shipment?: string;
    shipperAccount?: string;
    moneda?: string;
    diasCredito?: number;
    formaPago?: string;
    metodoPago?: string;
    cteEmisorNombre?: string;
    cteEmisorRfc?: string;
    cteEmisorCalle?: string;
    cteEmisorNoExterior?: string;
    cteEmisorColonia?: string;
    cteEmisorLocalidad?: string;
    cteEmisorPais?: string;
    cteEmisorCp?: string;
    cteEmisorRegimenFiscal?: string;
    cteReceptorId?: number;
    cteReceptorNombre?: string;
    cteReceptorCp?: string;
    cteReceptorRegimenFiscal?: string;
    cteReceptorDomicilio?: string;
    cteReceptorRfc?: string;
    cteReceptorUsoCfdi?: string;
    cteReceptorTipoCambio?: number;
    idUnidad?: string;
    modeloUnidad?: string;
    placaUnidad?: string;
    configVehicular?: string;
    aseguradora?: string;
    polizaUnidad?: string;
    pesoBrutoVehicular?: number;
    claveTipoPermiso?: string;
    numTipoPermiso?: string;
    operador?: string;
    rfcOperador?: string;
    licenciaOperador?: string;
    noViaje?: string;
    totalDistanciaRec?: number;
    idRemolque?: string;
    placaRemolque1?: string;
    subtipoRemolque1?: string;
    placaRemolque2?: string;
    subtipoRemolque2?: string;
    esTransporteInternacional?: string;
    /* claveRegimenAduanero?: string; */
    entSalMercancia?: string;
    viaEntradaSalida?: number;
    pedimento?: string;
    rfcImpo?: string;
    idClienteLis?: number;
    idUnidadLis?: string;
    idRemolqueLis?: string;
    idRemolque2Lis?: string;
    idPlazaOrLis?: number;
    idPlazaDeLis?: number;
    idRutaLis?: number;
    idOperadorLis?: number;
    idLineaRem1Lis?: string;
    idLineaRem2Lis?: string;
    idSucursalLis?: number;
    idClienteRemitenteLis?: number;
    idClienteDestinatarioLis?: number;

    fechaTimbrado?: Date;
    fechaSolicitudTimbrado?: Date;
	estatusTrasladoLis?: number;
	mensajeTrasladoLis?: string;
	fechaTrasladoLis?: Date;
	idTipoOperacionLis?: number;
	tipoOperacion?: string;
	idTipoServicioLis?: string;
	tipoServicio?: string;
	numCartaPorteLis?: string;

    idOperador?: number;
    idRuta?: number;
    idPlazaOrigen?: number;
    idPlazaDestino?: number;
    idClienteRemitente?: number;
    idClienteDestinatario?: number;

    //datos para timbrado de permisionario
    esPermisionario?: boolean;
    codigoTransportista?: string;
    rfcTransportista?: string;
    nombreTransportista?: string;
    regimenfiscalTransportista?: string;

    //auditoria
    modificadoPor?: string;
    
    cartaPorteDetalles: Concepto[];
    cartaPorteMercancia: Mercancia[];  
    cartaPorteUbicaciones: Ubicacion[];
    cartaPorteOperacionRyder: OperacionRyder[];
    cartaPorteSustituciones?: Sustitucion[];
    cartaPorteRegimenesAduaneros: RegimenAduanero[];

    erroresTimbradoGenerals?: ErrorTimbrado[];

    archivoCFDi?: ArchivoCFDi | undefined;
    constructor(
        id: number,
        noGuia: number,
        numGuia: string,
        statusGuia: string,
        compania: string,
        cartaPorteDetalles: Concepto[],
        cartaPorteMercancia: Mercancia[],
        cartaPorteUbicaciones: Ubicacion[],
        cartaPorteOperacionRyder: OperacionRyder[],
        cartaPorteSustituciones: Sustitucion[],
        cartaPorteRegimenesAduaneros: RegimenAduanero[],
        erroresTimbradoGenerals: ErrorTimbrado[],
        observacionesPedido?: string,
        sistemaTimbrado?: number,
        estatusTimbrado?: number,
        mensajeTimbrado?: string,
        fechaInsert?: Date,
        shipment?: string,
        shipperAccount?: string,
        moneda?: string,
        diasCredito?: number,
        formaPago?: string,
        metodoPago?: string,
        cteEmisorNombre?: string,
        cteEmisorRfc?: string,
        cteEmisorCalle?: string,
        cteEmisorNoExterior?: string,
        cteEmisorColonia?: string,
        cteEmisorLocalidad?: string,
        cteEmisorPais?: string,
        cteEmisorCp?: string,
        cteEmisorRegimenFiscal?: string,
        cteReceptorId?: number,
        cteReceptorNombre?: string,
        cteReceptorCp?: string,
        cteReceptorRegimenFiscal?: string,
        cteReceptorDomicilio?: string,
        cteReceptorRfc?: string,
        cteReceptorUsoCfdi?: string,
        cteReceptorTipoCambio?: number,
        idUnidad?: string,
        modeloUnidad?: string,
        placaUnidad?: string,
        configVehicular?: string,
        aseguradora?: string,
        polizaUnidad?: string,
        pesoBrutoVehicular?: number,
        claveTipoPermiso?: string,
        numTipoPermiso?: string,
        operador?: string,
        rfcOperador?: string,
        licenciaOperador?: string,
        noViaje?: string,
        totalDistanciaRec?: number,
        idRemolque?: string,
        placaRemolque1?: string,
        subtipoRemolque1?: string,
        placaRemolque2?: string,
        subtipoRemolque2?: string,
        esTransporteInternacional?: string,
        /* claveRegimenAduanero?: string, */
        entSalMercancia?: string,
        viaEntradaSalida?: number,
        pedimento?: string,
        rfcImpo?: string,
        idClienteLis?: number,
        idUnidadLis?: string,
        idRemolqueLis?: string,
        idRemolque2Lis?: string,
        idPlazaOrLis?: number,
        idPlazaDeLis?: number,
        idRutaLis?: number,
        idOperadorLis?: number,
        idLineaRem1Lis?: string,
        idLineaRem2Lis?: string,
        idSucursalLis?: number,
        idClienteRemitenteLis?: number,
        idClienteDestinatarioLis?: number,
        archivoCFDi?: ArchivoCFDi,

        fechaTimbrado?: Date,
        fechaSolicitudTimbrado?: Date,
        estatusTrasladoLis?: number,
        mensajeTrasladoLis?: string,
        fechaTrasladoLis?: Date,
        idTipoOperacionLis?: number,
        tipoOperacion?: string,
        idTipoServicioLis?: string,
        tipoServicio?: string,
        numCartaPorteLis?: string,

        idOperador?: number,
        idRuta?: number,
        idPlazaOrigen?: number,
        idPlazaDestino?: number,
        idClienteRemitente?: number,
        idClienteDestinatario?: number,

        //datos para timbrado de permisionario
        esPermisionario?: boolean,
        codigoTransportista?: string,
        rfcTransportista?: string,
        nombreTransportista?: string,
        regimenfiscalTransportista?: string,

        //auditoria
        modificadoPor?: string
    ) {
        this.id = id;
        this.noGuia = noGuia;
        this.numGuia = numGuia;
        this.statusGuia = statusGuia;
        this.compania = compania;
        this.observacionesPedido = observacionesPedido;
        this.sistemaTimbrado = sistemaTimbrado;
        this.estatusTimbrado = estatusTimbrado;
        this.mensajeTimbrado = mensajeTimbrado;
        this.fechaInsert = fechaInsert;
        this.shipment = shipment;
        this.shipperAccount = shipperAccount;
        this.moneda = moneda;
        this.diasCredito = diasCredito;
        this.formaPago = formaPago;
        this.metodoPago = metodoPago;
        this.cteEmisorNombre = cteEmisorNombre;
        this.cteEmisorRfc = cteEmisorRfc;
        this.cteEmisorCalle = cteEmisorCalle;
        this.cteEmisorNoExterior = cteEmisorNoExterior;
        this.cteEmisorColonia = cteEmisorColonia;
        this.cteEmisorLocalidad = cteEmisorLocalidad;
        this.cteEmisorPais = cteEmisorPais;
        this.cteEmisorCp = cteEmisorCp;
        this.cteEmisorRegimenFiscal = cteEmisorRegimenFiscal;
        this.cteReceptorId = cteReceptorId;
        this.cteReceptorNombre = cteReceptorNombre;
        this.cteReceptorCp = cteReceptorCp;
        this.cteReceptorRegimenFiscal = cteReceptorRegimenFiscal;
        this.cteReceptorDomicilio = cteReceptorDomicilio;
        this.cteReceptorRfc = cteReceptorRfc;
        this.cteReceptorUsoCfdi = cteReceptorUsoCfdi;
        this.cteReceptorTipoCambio = cteReceptorTipoCambio;
        this.idUnidad = idUnidad;
        this.modeloUnidad = modeloUnidad;
        this.placaUnidad = placaUnidad;
        this.configVehicular = configVehicular;
        this.aseguradora = aseguradora;
        this.polizaUnidad = polizaUnidad;
        this.pesoBrutoVehicular = pesoBrutoVehicular;
        this.claveTipoPermiso = claveTipoPermiso;
        this.numTipoPermiso = numTipoPermiso;
        this.operador = operador;
        this.rfcOperador = rfcOperador;
        this.licenciaOperador = licenciaOperador;
        this.noViaje = noViaje;
        this.totalDistanciaRec = totalDistanciaRec;
        this.idRemolque = idRemolque;
        this.placaRemolque1 = placaRemolque1;
        this.subtipoRemolque1 = subtipoRemolque1;
        this.placaRemolque2 = placaRemolque2;
        this.subtipoRemolque2 = subtipoRemolque2;
        this.esTransporteInternacional = esTransporteInternacional;
 /*        this.claveRegimenAduanero = claveRegimenAduanero; */
        this.entSalMercancia = entSalMercancia;
        this.viaEntradaSalida = viaEntradaSalida;
        this.pedimento = pedimento;
        this.rfcImpo = rfcImpo;
        this.idClienteLis = idClienteLis;
        this.idUnidadLis = idUnidadLis;
        this.idRemolqueLis = idRemolqueLis;
        this.idRemolque2Lis = idRemolque2Lis;
        this.idPlazaOrLis = idPlazaOrLis;
        this.idPlazaDeLis = idPlazaDeLis;
        this.idRutaLis = idRutaLis;
        this.idOperadorLis = idOperadorLis;
        this.idLineaRem1Lis = idLineaRem1Lis;
        this.idLineaRem2Lis = idLineaRem2Lis;
        this.idSucursalLis = idSucursalLis;
        this.idClienteRemitenteLis = idClienteRemitenteLis;
        this.idClienteDestinatarioLis = idClienteDestinatarioLis;

        this.fechaTimbrado = fechaTimbrado;
        this.estatusTrasladoLis = estatusTrasladoLis;
        this.mensajeTrasladoLis = mensajeTrasladoLis;
        this.fechaTrasladoLis = fechaTrasladoLis;
        this.idTipoOperacionLis = idTipoOperacionLis;
        this.tipoOperacion = tipoOperacion;
        this.idTipoServicioLis = idTipoServicioLis;
        this.tipoServicio = tipoServicio;
        this.numCartaPorteLis = numCartaPorteLis;

        this.idOperador = idOperador;
        this.idRuta = idRuta;
        this.idPlazaOrigen = idPlazaOrigen;
        this.idPlazaDestino = idPlazaDestino;
        this.idClienteRemitente = idClienteRemitente;
        this.idClienteDestinatario =idClienteDestinatario;


        this.fechaSolicitudTimbrado =fechaSolicitudTimbrado;

         //datos para timbrado de permisionario
         this.esPermisionario =esPermisionario;
         this.codigoTransportista =codigoTransportista;
         this.rfcTransportista =rfcTransportista;
         this.nombreTransportista =nombreTransportista;
         this.regimenfiscalTransportista =regimenfiscalTransportista;
 
         //auditoria
         this.modificadoPor =modificadoPor;

        this.cartaPorteDetalles = cartaPorteDetalles;
        this.cartaPorteMercancia = cartaPorteMercancia;
        this.cartaPorteUbicaciones = cartaPorteUbicaciones;
        this.cartaPorteOperacionRyder = cartaPorteOperacionRyder;
        this.cartaPorteSustituciones = cartaPorteSustituciones;
        this.cartaPorteRegimenesAduaneros = cartaPorteRegimenesAduaneros;
        this.erroresTimbradoGenerals = erroresTimbradoGenerals;

        this.archivoCFDi = archivoCFDi;
    }

}



