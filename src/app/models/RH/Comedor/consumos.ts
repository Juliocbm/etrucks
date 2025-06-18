export class ConsumosModel {
    idPersonal: number;
    nombre: string;
    tipoEmpleado: string;
    cantConsumos: number;
    total: number;
    diaConsumo: Date;
    fechaCorte: string;
    estatus: string;
    empresa: string;
    sucursal: string;
    activo: boolean;
    tipoNomina: string;
    constructor() {
      this.idPersonal = 0;
      this.nombre = '';
      this.tipoEmpleado = '';
      this.cantConsumos = 0;
      this.total = 0;
      this.diaConsumo = new Date();
      this.fechaCorte = '';
      this.estatus = '';
      this.empresa = '';
      this.sucursal = '';
      this.activo = true;
      this.tipoNomina = '';
    }
  }
  