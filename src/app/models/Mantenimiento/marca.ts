export class Marca {
  idMarca: string;
  nombre: string;
  descripcion: string;
  idTipoMarca: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(
      idMarca?: string,
      nombre?: string,
      descripcion?: string,
      idTipoMarca?: string,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string
  ) {
      this.idMarca = idMarca || '00000000-0000-0000-0000-000000000000';
      this.nombre = nombre || '';
      this.descripcion = descripcion || '';
      this.idTipoMarca = idTipoMarca || 'AEFCBD66-F3E1-46B2-B520-4A1901E993A8';
      this.activo = activo || false;
      this.fechaCreacion = fechaCreacion || new Date();
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
  }
}

