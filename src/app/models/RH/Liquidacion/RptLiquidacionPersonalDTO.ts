

export interface IRptLiquidacionPersonalDTO {
    idPersonal: number;
    numEmpleado: string | null;
    nombre: string | null;
    imss: string | null;
    idConcepto: number | null;
    concepto: string | null;
    nombreConcepto: string | null;
    monto: number | null;
    montoFormato: string | null;
    estatusTimbrado: number | null;
    folio: string | null;
    mensaje: string | null;
    tipoEmpleado: string | null;
    estatusLiquidacion: string | null;
    fechaLiquidacion: Date | null;
}

export class RptLiquidacionPersonalDTO implements IRptLiquidacionPersonalDTO {
    idPersonal: number;
    numEmpleado: string | null;
    nombre: string | null;
    imss: string | null;
    idConcepto: number | null;
    concepto: string | null;
    nombreConcepto: string | null;
    monto: number | null;
    montoFormato: string | null;
    estatusTimbrado: number | null;
    folio: string | null;
    mensaje: string | null;
    tipoEmpleado: string | null;
    estatusLiquidacion: string | null;
    fechaLiquidacion: Date | null;
    constructor() {
        this.idPersonal = 0,
        this.numEmpleado = '',
        this.nombre = '',
        this.imss = '',
        this.idConcepto = 0,
        this.concepto = '',
        this.nombreConcepto = '',
        this.monto = 0,
        this.montoFormato = '0';
        this.estatusTimbrado = 0,
        this.folio = '',
        this.mensaje = '',
        this.tipoEmpleado = '',
        this.estatusLiquidacion = '',
        this.fechaLiquidacion = new Date()
    }
}
