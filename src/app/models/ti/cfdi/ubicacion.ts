export class Ubicacion {
    id: number;
    noGuia: number;
    compania: string;
    tipoUbicacionOrigen?: string;
    nombreRemitente?: string;
    remitenteRfc?: string;
    remitenteResidenciaFiscal?: string;
    remitenteId?: string;
    remitenteCp?: string;
    remitenteEstado?: string;
    remitentePais?: string;
    remitenteMunicipio?: string;
    remitenteLocalidad?: string;
    remitenteNumRegIdTrib?: string;
    fechaDespachoProgramado?: string;
    tipoUbicacionDestino?: string;
    nombreDestinatario?: string;
    destinatarioRfc?: string;
    destinatarioResidenciaFiscal?: string;
    destinatarioId?: string;
    destinatarioCp?: string;
    destinatarioEstado?: string;
    destinatarioPais?: string;
    destinatarioMunicipio?: string;
    destinatarioLocalidad?: string;
    destinatarioNumRegIdTrib?: string;
    fechaArriboProgramado?: string;
    distanciaRecorrida?: number;
    fechaInsert?: Date;

    constructor(
        id: number,
        noGuia: number,
        compania: string,
        tipoUbicacionOrigen?: string,
        nombreRemitente?: string,
        remitenteRfc?: string,
        remitenteResidenciaFiscal?: string,
        remitenteId?: string,
        remitenteCp?: string,
        remitenteEstado?: string,
        remitentePais?: string,
        remitenteMunicipio?: string,
        remitenteNumRegIdTrib?: string,
        fechaDespachoProgramado?: string,
        tipoUbicacionDestino?: string,
        nombreDestinatario?: string,
        destinatarioRfc?: string,
        destinatarioResidenciaFiscal?: string,
        destinatarioId?: string,
        destinatarioCp?: string,
        destinatarioEstado?: string,
        destinatarioPais?: string,
        destinatarioMunicipio?: string,
        destinatarioNumRegIdTrib?: string,
        fechaArriboProgramado?: string,
        distanciaRecorrida?: number,
        fechaInsert?: Date
    ) {
        this.id = id;
        this.noGuia = noGuia;
        this.compania = compania;
        this.tipoUbicacionOrigen = tipoUbicacionOrigen;
        this.nombreRemitente = nombreRemitente;
        this.remitenteRfc = remitenteRfc;
        this.remitenteResidenciaFiscal = remitenteResidenciaFiscal;
        this.remitenteId = remitenteId;
        this.remitenteCp = remitenteCp;
        this.remitenteEstado = remitenteEstado;
        this.remitentePais = remitentePais;
        this.remitenteMunicipio = remitenteMunicipio;
        this.remitenteNumRegIdTrib = remitenteNumRegIdTrib;
        this.fechaDespachoProgramado = fechaDespachoProgramado;
        this.tipoUbicacionDestino = tipoUbicacionDestino;
        this.nombreDestinatario = nombreDestinatario;
        this.destinatarioRfc = destinatarioRfc;
        this.destinatarioResidenciaFiscal = destinatarioResidenciaFiscal;
        this.destinatarioId = destinatarioId;
        this.destinatarioCp = destinatarioCp;
        this.destinatarioEstado = destinatarioEstado;
        this.destinatarioPais = destinatarioPais;
        this.destinatarioMunicipio = destinatarioMunicipio;
        this.destinatarioNumRegIdTrib = destinatarioNumRegIdTrib;
        this.fechaArriboProgramado = fechaArriboProgramado;
        this.distanciaRecorrida = distanciaRecorrida;
        this.fechaInsert = fechaInsert;
    }
}
