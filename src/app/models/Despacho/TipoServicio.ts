export class TipoServicio {
    idTipoServicio: number;
    clave: string;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
  
    constructor(
      idTipoServicio?: number,
      clave?: string,
      nombre?: string,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string
    ) {
      this.idTipoServicio = idTipoServicio || 0;
      this.clave = clave || '';
      this.nombre = nombre || '';
      this.activo = activo || false;
      this.fechaCreacion =  new Date();
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion =  new Date();
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
    }
  }
  