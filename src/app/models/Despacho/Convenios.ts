
export class Convenio {

    idConvenio: number;
    idCompania:number;
    compania:string;
    nombre:string;
    idCliente:string;
    clientePaga:string;
    esConvenioEdi:boolean;
    idSucursal:number;
    idSucursalDespacho:number;
    sucursalDespacho:string;
    idTipoOperacion:number;
    idTipoServicio:string;
    idRuta:number;
    ruta:string;
    idPlazaOrigen:number;
    plazaOrigen:string;
    idPlazaDestino:number;
    plazaDestino:string;
    esViajeRedondo:boolean;
    kmsReales:number;
    idClienteOrigen:string;
    clienteOrigen:string;
    idClienteDestino: string;
    clienteDestino:string;
    notasRemitente:string;
    notasDestinatario:string;
    esDobleOperador:boolean;
    esDobleRemolque:boolean;
    idTipoSeguimiento: number;
    tipoSeguimiento:string;
    tiempoDespacho: number;
    despacharConUnidad: string;
    idFlotaDespachar: number;
    flota:string;
    idMarcaDespachar:number;
    marca:string;
    idClienteFactura: string;
    clienteFactura:string;
    contacto:string;
    activo:boolean;
    fechaCreacion:Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor:string;
    idMoneda:string;
    idTipoCobro:string;
    facturable:boolean;
    convenioDetalles: ConvenioDetalles[];
    convenioEvidenciaViaje: ConvenioEvidenciaViaje[];
    convenioCasetaPeajes:ConvenioCasetaPeaje[];
    convenioRutas:ConvenioRuta[];
    convenioMarcas:ConvenioMarca[];
    convenioClientes:ConvenioCliente[];
    dirOrigen:string;
    dirDestinatario:string;
    facturar:string;
    comentario:string;
    idDespacharConUnidad:string;
    tipoOperacion:string;
    tipoServicio: string;
    moneda:string;
    tipoCobro:string;
    tipoMoneda:string;
    companiaCorto:string;
    usuarioModificadoPor:string;
    usuarioCreadoPor:string;
    despUnidad:string;
    idcargoAjusteCombustible:number;
    kmCpac:number;
    cargo:string;
    idPlazaRemRef:number;
    idPlazaDestRef:number;
    idClienteRemRef:string;
    idClienteDestRef:string;
    facturarA: string

    constructor(){
        this.idConvenio = 0;
        this.idCompania = 0;
        this.compania = "";
        this.nombre= "";
        this.idCliente = "";
        this.esConvenioEdi= false;
        this.idSucursal= 0;
        this.idSucursalDespacho= 0;
        this.idTipoOperacion= 0;
        this.idTipoServicio= "";
        this.idRuta= 0;
        this.idPlazaOrigen= 0;
        this.idPlazaDestino= 0;
        this.esViajeRedondo= false;
        this.kmsReales= 0;
        this.idClienteOrigen = "";
        this.idClienteDestino = "";
        this.notasRemitente= "";
        this.notasDestinatario= "";
        this.esDobleOperador= false;
        this.esDobleRemolque= false;
        this.idTipoSeguimiento= 0;
        this.tiempoDespacho= 0;
        this.despacharConUnidad= "";
        this.idFlotaDespachar= 0;
        this.idMarcaDespachar= 0;
        this.idClienteFactura= "";
        this.contacto= "";
        this.activo= false;
        this.fechaCreacion= new Date();
        this.creadoPor= "";
        this.fechaModificacion= new Date();
        this.modificadoPor= "";
        this.idMoneda = "";
        this.idTipoCobro = "";
        this.facturable = false;
        this.convenioDetalles = [];
        this.convenioCasetaPeajes = [];
        this.convenioEvidenciaViaje = [];
        this.convenioRutas = [];
        this.clientePaga = "";
        this.sucursalDespacho = "";
        this.ruta = "";
        this.plazaOrigen = "";
        this.plazaDestino = "";
        this.clienteOrigen = "";
        this.clienteDestino = "";
        this.tipoSeguimiento = "";
        this.flota = "";
        this.marca = "";
        this.clienteFactura = "";
        this.dirOrigen = "";
        this.dirDestinatario = "";
        this.facturar = "";
        this.comentario = "";
        this.idDespacharConUnidad = "";
        this.tipoOperacion = "";
        this.tipoServicio = "";
        this.moneda = "";
        this.tipoCobro = "";
        this.tipoMoneda = "";
        this.companiaCorto = "";
        this.usuarioCreadoPor = "";
        this.usuarioModificadoPor = "";    
        this.despUnidad = "";
        this.idcargoAjusteCombustible = 0;
        this.kmCpac = 0;
        this.idPlazaRemRef = 0;
        this.idPlazaDestRef = 0;
        this.idClienteRemRef = "";
        this.idClienteDestRef = "";
        this.cargo = "";
        this.facturarA = "";
        this.convenioMarcas = [];
        this.convenioClientes = [];
    }
}

export class ConvenioDetalles {

    idConvenioDetalle: number;
    idConvenio:number;
    idConceptoFacturable:number;
    nombre:string;
    precioUnitario:number;
    impuestoRet: number;
    valorImpRet:number;
    impuestoTras:number;
    valorImpTras:number;
    total:number;
    activo:boolean;
    fechaCreacion:Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor:string;

    constructor(){

        this.idConvenioDetalle = 0;
        this.idConvenio = 0;
        this.nombre = "";
        this.idConceptoFacturable = 0;
        this.precioUnitario = 0;
        this.impuestoRet = 0;
        this.valorImpRet = 0;
        this.impuestoTras = 0;
        this.total = 0;
        this.activo = true;
        this.fechaCreacion =  new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.valorImpTras = 0;
    }
}

export class ConvenioEvidenciaViaje {
    seleccionado: boolean;
    idConvenioEvicenciaViaje: number;
    idConvenio:number;
    idEvidenciaViaje:number;
    nombre:string;
    activo:boolean;
    fechaCreacion:Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor:string;

    constructor(){
        this.seleccionado = false;
        this.idConvenioEvicenciaViaje = 0;
        this.idConvenio = 0;
        this.nombre = "";
        this.idEvidenciaViaje = 0;
        this.activo = true;
        this.fechaCreacion =  new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
    }
}

export class ConvenioCasetaPeaje {
    seleccionado: boolean;
    idConvenioCasetaPeaje: number;
    idConvenio:number;
    idCasetaPeaje :number;
    nombre:string;
    activo:boolean;
    fechaCreacion:Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor:string;

    constructor(){
        this.seleccionado = false;
        this.idConvenioCasetaPeaje = 0;
        this.idConvenio = 0;
        this.idCasetaPeaje = 0;
        this.activo = true;
        this.fechaCreacion =  new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.nombre = '';
    }
}


export class ConvenioRuta {
    seleccionado: boolean;
    idConvenioRuta: number;
    idConvenio:number;
    idRuta:number;
    activo:boolean;
    fechaCreacion:Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor:string;
    nombre: string;
    estadoOrigen:string;
    estadoDestino:string;

    constructor(){
        this.seleccionado = false;
        this.idConvenioRuta = 0;
        this.idConvenio = 0;
        this.nombre = "";
        this.idRuta = 0;
        this.activo = true;
        this.fechaCreacion =  new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.nombre = '';
        this.estadoOrigen = '';
        this.estadoDestino = '';
    }
}

export class ConvenioMarca {
    seleccionado: boolean;
    idConvenioMarca: number;
    idConvenio:number;
    idMarca:string;
    activo:boolean;
    fechaCreacion:Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor:string;
    nombre: string;
    estadoOrigen:string;
    estadoDestino:string;

    constructor(){
        this.seleccionado = false;
        this.idConvenioMarca = 0;
        this.idConvenio = 0;
        this.nombre = "";
        this.idMarca = "";
        this.activo = true;
        this.fechaCreacion =  new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.nombre = '';
        this.estadoOrigen = '';
        this.estadoDestino = '';
    }
}

export class ConvenioCliente {
    seleccionado: boolean;
    idConvenioCliente: number;
    idConvenio:number;
    idCliente:string;
    activo:boolean;
    fechaCreacion:Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor:string;
    nombre: string;
    estadoOrigen:string;
    estadoDestino:string;

    constructor(){
        this.seleccionado = false;
        this.idConvenioCliente = 0;
        this.idConvenio = 0;
        this.nombre = "";
        this.idCliente = "";
        this.activo = true;
        this.fechaCreacion =  new Date();
        this.creadoPor = '';
        this.fechaModificacion = new Date();
        this.modificadoPor = '';
        this.nombre = '';
        this.estadoOrigen = '';
        this.estadoDestino = '';
    }
}