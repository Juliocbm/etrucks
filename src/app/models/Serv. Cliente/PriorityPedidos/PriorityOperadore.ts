export class PriorityOperadore {
  idArea: number;
  idPersonal: number;
  nombreOperador?: string;
  priorityPosition: number;
  fechaDisponible?: Date;
  fechaInsert?: Date;
  manualPosition: boolean;
  idUbicacion: number;
  ubicacion?: string;
  idSucursal?: number;
  sucursal?: string;
  estadoOperador?: string;

  constructor(
      idArea: number,
      idPersonal: number,
      nombreOperador: string | undefined,
      priorityPosition: number,
      fechaDisponible: string | undefined,
      fechaInsert: string | undefined,
      manualPosition: boolean,
      idUbicacion: number,
      ubicacion: string | undefined,
      idSucursal: number | undefined,
      sucursal: string | undefined,
      estadoOperador: string | undefined
  ) {
      this.idArea = idArea;
      this.idPersonal = idPersonal;
      this.nombreOperador = nombreOperador;
      this.priorityPosition = priorityPosition;
      this.fechaDisponible = fechaDisponible ? new Date(fechaDisponible) : undefined;
      this.fechaInsert = fechaInsert ? new Date(fechaInsert) : undefined;
      this.manualPosition = manualPosition;
      this.idUbicacion = idUbicacion;
      this.ubicacion = ubicacion;
      this.idSucursal = idSucursal;
      this.sucursal = sucursal;
      this.estadoOperador = estadoOperador;
  }
}
