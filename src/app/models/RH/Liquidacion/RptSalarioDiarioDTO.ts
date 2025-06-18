
export interface IRptSalarioDiarioDTO {
    idPersonal: number;
    numEmpleado: string | null;
    nombre: string | null;
    imss: string | null;
    antiguedad: number;
    noLiquidacion: number;
    salario: number | null;
    salarioFormato: string | null;
    fechaIngreso: Date | null;
    fechaLiquidacion: Date | null;
}

export class RptSalarioDiarioDTO implements IRptSalarioDiarioDTO {
    idPersonal: number;
    numEmpleado: string | null;
    nombre: string | null;
    imss: string | null;
    antiguedad: number;
    noLiquidacion: number;
    salario: number | null;
    salarioFormato: string | null;
    fechaIngreso: Date | null;
    fechaLiquidacion: Date | null;
    constructor() {
        this.idPersonal = 0,
        this.numEmpleado = '',
        this.nombre = '',
        this.imss = '',
        this.antiguedad = 0,
        this.noLiquidacion = 0,
        this.salario = 0,
        this.salarioFormato = '0',
        this.fechaIngreso = null,
        this.fechaLiquidacion = null
    }
}
