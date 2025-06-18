export class RemolqueEstatus {
    idRemolqueEstatus: number;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
  
    constructor(
      idRemolqueEstatus?: number,
      nombre?: string,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      usuarioCreadoPor?: string,
      usuarioModificadoPor?: string
    ) {
      this.idRemolqueEstatus = 0;
      this.nombre = '';
      this.activo = activo || true;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
    }
  }