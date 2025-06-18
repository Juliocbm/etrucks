export class Flotas {
  idFlota: number;
  nombre: string;
  jefeFlota: number;
  statusFlota: string;
  idCliente: number;

  constructor(data: Partial<Flotas> = {}) {
    this.idFlota = data.idFlota ?? 0;
    this.nombre = data.nombre ?? '';
    this.jefeFlota = data.jefeFlota ?? 0;
    this.statusFlota = data.statusFlota ?? '';
    this.idCliente = data.idCliente ?? 0;
  }
}
