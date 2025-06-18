export class ViajeEstatus {
  idViajeEstatus: number;
  nombre: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioCreadoPor: string;
  usuarioModificadoPor: string;
  constructor(
      idViajeEstatus?: number,
      nombre?: string,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      usuarioCreadoPor?: string,
      usuarioModificadoPor?: string
  ) {
      this.idViajeEstatus = idViajeEstatus || 0;
      this.nombre = nombre || '';
      this.activo = activo || false;
      this.fechaCreacion = fechaCreacion || new Date();
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
  }
}
