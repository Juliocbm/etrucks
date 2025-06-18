export class bitacoraPeriodo {
  idSemana: number;
  anio: number;
  fechaIni: Date;
  fechaFin: Date;
  idConsecutivo: number;

  constructor(data: Partial<bitacoraPeriodo> = {}) {
    this.idSemana = data.idSemana ?? 0;
    this.anio = data.anio ?? 0;
    this.fechaIni = data.fechaIni ?? new Date();
    this.fechaFin = data.fechaFin ?? new Date();
    this.idConsecutivo = data.idConsecutivo ?? 0;
  }
}
