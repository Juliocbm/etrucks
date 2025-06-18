export class repAdeudosModel {
  numEmpleado: number;
  Empleado: string;
  Descripcion: string;
  Fecha: Date;
  no_liquidacion: string;
  Monto: number;


  constructor() {
    this.numEmpleado = 0;
    this.Empleado = '';
    this.Descripcion = '';
    this.Fecha = new Date();
    this.no_liquidacion = '';
    this.Monto = 0;
  }

}
