export interface CargoCajaAhorro {
    idCaja: number;
    numEmpleado: number;
    nombre: string;
    descripcion: string;
    idTipoCaja: number;
    idTipoAdeudo: number;
    fechaCaja: string;
    montoCaja: number | string | null;
    noLiquidacion: number | null;
    fechaIngreso: string;
    periodo: string;
    archivoConfirmacion: string;
}