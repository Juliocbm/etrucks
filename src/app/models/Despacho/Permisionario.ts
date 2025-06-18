

export class Permisionario {
    idPermisionario: number;
    idCompania: number;
    companiaLargo: string;
    companiaCorto: string;
    nombre: string;
    rfc: string;
    razonSocial: string;
    regimenFiscal: string;
    idRegimenFiscal: string;
    dirCalle: string;
    dirNoExt: string;
    dirNoInt: string;
    dirColonia: string;
    dirCodigoP: string;
    dirReferencias: string;
    dirTelefono: string;
    dirCorreo: string;
    logoPath: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;

    idEstado: number | null;
    nombreEstado: string | null;
    cveEstado: string | null;
    nombreMunicipio: string | null;
    cveMunicipio: string | null;
    idMunicipio: number | null;
    nombrePais: string | null;
    cvePais: string | null;
    idPais: number | null;

    constructor(
        idPermisionario?: number,
        idCompania?: number,
        companiaLargo?: string,
        companiaCorto?: string,
        nombre?: string,
        rfc?: string,
        razonSocial?: string,
        regimenFiscal?: string,
        idRegimenFiscal?: string,
        dirCalle?: string,
        dirNoExt?: string,
        dirNoInt?: string,
        dirColonia?: string,
        dirCodigoP?: string,
        dirReferencias?: string,
        dirTelefono?: string,
        dirCorreo?: string,
        logoPath?: string,
        activo?: boolean,
        fechaCreacion?: Date,
        creadoPor?: string,
        usuarioCreadoPor?: string,
        fechaModificacion?: Date,
        modificadoPor?: string,
        usuarioModificadoPor?: string,

        idEstado?: number | null,
        nombreEstado?: string | null,
        cveEstado?: string | null,
        nombreMunicipio?: string | null,
        cveMunicipio?: string | null,
        idMunicipio?: number | null,
        nombrePais?: string | null,
        cvePais?: string | null,
        idPais?: number | null
    ) {
        this.idPermisionario = idPermisionario || 0;
        this.idCompania = idCompania || 0;
        this.companiaLargo = companiaLargo || '';
        this.companiaCorto = companiaCorto || '';
        this.nombre = nombre || '';
        this.rfc = rfc || '';
        this.razonSocial = razonSocial || '';
        this.regimenFiscal = regimenFiscal || '';
        this.idRegimenFiscal = idRegimenFiscal || '';
        this.dirCalle = dirCalle || '';
        this.dirNoExt = dirNoExt || '';
        this.dirNoInt = dirNoInt || ''
        this.dirColonia = dirColonia || '';
        this.dirCodigoP = dirCodigoP || '';

        this.dirReferencias = dirReferencias || '';
        this.dirTelefono = dirTelefono || '';
        this.dirCorreo = dirCorreo || '';
        this.logoPath = logoPath || '';
        this.activo = activo || false;
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = usuarioCreadoPor || '';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = usuarioModificadoPor || '';

        this.cveEstado = cveEstado || '';
        this.nombreEstado = nombreEstado || '';
        this.idEstado = idEstado || 0;
        this.nombreMunicipio = nombreMunicipio || '';
        this.cveMunicipio = cveMunicipio || '';
        this.idMunicipio = idMunicipio || 0;
        this.nombrePais = nombrePais || '';
        this.cvePais = cvePais || '';
        this.idPais = idPais || 0;
    }
}