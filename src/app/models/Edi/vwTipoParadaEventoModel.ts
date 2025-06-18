// import { TimeService, toTimeZone } from "src/app/shared-module/services/time.service";

export class VwTipoParadaEvento {
    idTipoParadaEvento: number;
    idConexionDetalle: number;
    conexionDetalle: string;
    idTipoParada: number;
    tipoParada: string;
    idEvento: number;
    evento: string;
    orden: number;
    activo: boolean;
    creadoPor: string;        // Guid en C#
    fechaCreacion: Date;
    modificadoPor: string;    // Guid en C#
    fechaModificacion: Date;
  
    constructor(
      idTipoParadaEvento: number,
      idConexionDetalle: number,
      conexionDetalle: string,
      idTipoParada: number,
      tipoParada: string,
      idEvento: number,
      evento: string,
      orden: number,
      activo: boolean,
      creadoPor: string,
      fechaCreacion: Date,
      modificadoPor: string,
      fechaModificacion: Date
    ) {
      this.idTipoParadaEvento = idTipoParadaEvento || 0;
      this.idConexionDetalle = idConexionDetalle || 0;
      this.conexionDetalle = conexionDetalle;
      this.idTipoParada = idTipoParada || 0;
      this.tipoParada = tipoParada;
      this.idEvento = idEvento || 0;
      this.evento = evento || '';
      this.orden = orden || 0;
      this.activo = activo || false;
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.fechaCreacion = fechaCreacion || new Date('2025-01-01T00:00:00');
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date('2025-01-01T00:00:00');
    }
  }
  