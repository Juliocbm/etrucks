export class Unidades {
  idUnidad: string;
  idOperador: number;
  idFlota: number;

  constructor(data: Partial<Unidades> = {}) {
    this.idUnidad = data.idUnidad ?? '';
    this.idOperador = data.idOperador ?? 0;
    this.idFlota = data.idFlota ?? 0;
  }
}
