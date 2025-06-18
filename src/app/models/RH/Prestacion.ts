export class Prestacion{

    idPrestacion: number;
    idOperador: number;
    operador:string;
    nombre: string; 
    idTipoDescuento: number;
    tipoDescuento: string;
    idPeriodoDescuento: number;
    periodoDescuento: string;
    montoTotal: number;
    descuento: number;
    saldo: number;
    activo: boolean;
	fechaCreacion: Date;
	creadoPor: string;
	fechaModificacion: Date;
	modificadoPor: string;
    diasDemora: number;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    observaciones:string
    constructor(){
        this.idPrestacion = 0;
        this.idOperador= 0;
        this.operador = '';
        this.nombre = ''; 
        this.idTipoDescuento = 0;
        this.tipoDescuento = '';
        this.idPeriodoDescuento = 0;
        this.periodoDescuento = '';
        this.montoTotal = 0;
        this.descuento = 0;
        this.saldo = 0;
        this.activo = true;
        this.fechaCreacion = new Date;
        this.creadoPor = '';
        this.fechaModificacion = new Date;
        this.modificadoPor = '';
        this.diasDemora = 0;
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
        this.observaciones = '';
    }
}