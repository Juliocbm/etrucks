export class Evento {
    idEvento: number;
    evento1: string;
    codigo: string;
    activo: boolean;
    creadoPor: string;  // Guid como string
    fechaCreacion: Date;
    modificadoPor: string;  // Guid como string
    fechaModificacion: Date;
    
    // @JsonIgnore
    // tipoParadaEventos: TipoParadaEvento[];
  
    constructor(
      idEvento: number,
      evento1: string,
      codigo: string,
      creadoPor: string,
      modificadoPor: string,
      activo: boolean = false,
      fechaCreacion: Date = new Date(),
      fechaModificacion: Date = new Date(),
    //   tipoParadaEventos: TipoParadaEvento[] = []
    ) {
      this.idEvento = idEvento;
      this.evento1 = evento1;
      this.codigo = codigo;
      this.activo = activo;
      this.creadoPor = creadoPor;
      this.fechaCreacion = fechaCreacion;
      this.modificadoPor = modificadoPor;
      this.fechaModificacion = fechaModificacion;
    //   this.tipoParadaEventos = tipoParadaEventos;
    }
  }
  
  // Clase relacionada (asumiendo su estructura básica)
//   export class TipoParadaEvento {
//     // Propiedades básicas de ejemplo
//     idTipoParada: number;
//     nombre: string;
//   }