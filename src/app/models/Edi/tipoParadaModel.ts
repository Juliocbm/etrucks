export class TipoParada {
    idTipoParada: number;
    tipoParada: string;
    codigoParada: string;
    activo: boolean;
    creadoPor: string;       // Guid como string
    fechaCreacion: Date;
    modificadoPor: string;   // Guid como string
    fechaModificacion: Date;
  
    constructor(
      idTipoParada: number,
      tipoParada: string,
      codigoParada: string,
      creadoPor: string,
      modificadoPor: string,
      activo: boolean = false,
      fechaCreacion: Date = new Date(),
      fechaModificacion: Date = new Date()
    ) {
      this.idTipoParada = idTipoParada;
      this.tipoParada = tipoParada;
      this.codigoParada = codigoParada;
      this.activo = activo;
      this.creadoPor = creadoPor;
      this.fechaCreacion = fechaCreacion;
      this.modificadoPor = modificadoPor;
      this.fechaModificacion = fechaModificacion;
    }
  }