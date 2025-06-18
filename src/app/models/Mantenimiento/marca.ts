export class Marca {
  idMarca: string;
  nombre: string;
  descripcion: string;
  idTipoMarca: string;
  tipoMarca: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  usuarioCreadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioModificadoPor: string;
  clave: number;
  
  constructor(
      idMarca?: string,
      nombre?: string,
      descripcion?: string,
      // idTipoMarca?: string,
      tipoMarca?: string,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      usuarioCreadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      usuarioModificadoPor?:string
  ) {
      this.idMarca = idMarca || '00000000-0000-0000-0000-000000000000';
      this.nombre = nombre || '';
      this.descripcion = descripcion || '';
      this.idTipoMarca ='';
      this.tipoMarca = tipoMarca || '';
      this.activo = activo || true;
      this.fechaCreacion = fechaCreacion || new Date();
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.usuarioCreadoPor = usuarioCreadoPor ||'';
      this.fechaModificacion = fechaModificacion || new Date();
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
      this.usuarioModificadoPor = usuarioModificadoPor || '';
      this.clave = 0;
  }
}

