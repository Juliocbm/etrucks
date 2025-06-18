export interface IImpuestoNomina {
    idImpuestoNomina: number;
    // nombre: string;
    clave: string;
    monto: number;
    fechaVigencia: Date | null;
    activo: boolean;
    idTipoImpuesto: string,
    tipoImpuesto: string,
    idPeriodoDescuento: string,
    periodoDescuento: string;
    
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
}

export class ImpuestoNomina implements IImpuestoNomina {
    idImpuestoNomina: number;
    // nombre: string;
    clave: string;
    monto: number;
    fechaVigencia: Date | null;
    activo: boolean;
    idTipoImpuesto: string;
    tipoImpuesto: string;
    idPeriodoDescuento: string;
    periodoDescuento: string;
    
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    constructor(activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
        this.idImpuestoNomina = 0;
        // this.nombre = '';
        this.clave = '';
        this.monto = 0;
        this.fechaVigencia = null;
        this.activo = activo || true;
        this.idTipoImpuesto = '';
        this.tipoImpuesto = '';
        this.idPeriodoDescuento = '';
        this.periodoDescuento = '';
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaCreacion = fechaCreacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = fechaModificacion || new Date();
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
    }
}