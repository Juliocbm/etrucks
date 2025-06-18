export class repExcesoVelocidad {
  id: number;
  semana: number;
  operador: string;
  unidad: string;
  velocidadKm: string;
  noViaje: number;
  ruta: string;
  f_evento: Date;

  constructor() {
    this.id = 0;
    this.semana = 0;
    this.operador = '';
    this.unidad = '';
    this.velocidadKm = '';
    this.noViaje = 0;
    this.ruta = '';
    this.f_evento = new Date();
  }

}
