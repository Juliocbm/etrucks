export interface IProveedorCostoCombustible {
    idProveedorCostoCombustible: number;
    idProveedorDiesel: number;
    idTipoCombustible: string;
    tipoCombustible: string;
    costoUnitario: number | null;
    total: number | null;
    activo: boolean;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaModificacion: Date;
}

export class ProveedorCostoCombustible implements IProveedorCostoCombustible {
    idProveedorCostoCombustible: number;
    idProveedorDiesel: number;
    idTipoCombustible: string;
    tipoCombustible: string;
    costoUnitario: number | null;
    total: number | null;
    activo: boolean;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaCreacion: Date;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaModificacion: Date;
    constructor(fechaCreacion?: Date, fechaModificacion?: Date) {
        this.idProveedorCostoCombustible = 0;
        this.idProveedorDiesel = 0;
        this.idTipoCombustible = '';
        this.tipoCombustible= '';
        this.costoUnitario = 0;
        this.total = 0;
        this.activo = true;
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaCreacion = fechaCreacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';
        this.fechaModificacion = fechaModificacion || new Date();
    }
}
