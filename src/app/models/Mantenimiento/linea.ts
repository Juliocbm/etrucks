

export class Linea {
    idLinea: number;
    nombreLinea: string;
    clave: string;
	esAmericana: boolean;
	activo: boolean;
	fechaCreacion: Date;
	creadoPor: string;
	fechaModificacion: Date;
	modificadoPor: string;
    diasDemora: number;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    constructor(
        idLinea?: number,
        nombreLinea?: string,
        clave?: string,
        esAmericana?: boolean,
        activo?: boolean,
        fechaCreacion?: Date,
        creadoPor?: string,
        fechaModificacion?: Date,
        modificadoPor?: string,
        diasDemora?: number,
        usuarioCreadoPor?: string,
        usuarioModificadoPor?: string
    ) {
        this.idLinea = idLinea || 0;
        this.nombreLinea = nombreLinea || '';
        this.clave = clave || '';
        this.esAmericana = esAmericana || false;
        this.activo = activo || true;
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
        this.diasDemora = diasDemora || 0;
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
    }
  }