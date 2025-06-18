export class TipoParadaEvento {
    idTipoParadaEvento: number;
    idConexionDetalle: number;
    idTipoParada: number;
    // idEntidad: number;
    idEvento: number;
    orden: number;
    activo: boolean;
    creadoPor: string;       // Guid como string
    fechaCreacion: Date;
    modificadoPor: string;   // Guid como string
    fechaModificacion: Date;
  
    constructor(
      idTipoParadaEvento: number,
      idConexionDetalle: number,
      idTipoParada: number,
      // idEntidad: number,
      idEvento: number,
      orden: number,
      creadoPor: string,
      modificadoPor: string,
      activo: boolean = false,
      fechaCreacion: Date = new Date(),
      fechaModificacion: Date = new Date()
    ) {
      this.idTipoParadaEvento = idTipoParadaEvento;
      this.idConexionDetalle = idConexionDetalle;
      this.idTipoParada = idTipoParada;
      // this.idEntidad = idEntidad;
      this.idEvento = idEvento;
      this.orden = orden;
      this.activo = activo;
      this.creadoPor = creadoPor;
      this.fechaCreacion = fechaCreacion;
      this.modificadoPor = modificadoPor;
      this.fechaModificacion = fechaModificacion;
    }
  }