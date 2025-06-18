export class EvidenciaViaje {
  idEvidenciaViaje?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string; // Cambiar el tipo según tus necesidades
  usuarioCreadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string; // Cambiar el tipo según tus necesidades
  usuarioModificadoPor: string;

  constructor() {
    this.nombre = '';
    this.descripcion = '';
    this.activo = false;
    this.fechaCreacion = new Date();
    this.creadoPor = '';
    this.usuarioCreadoPor = '';
    this.fechaModificacion = new Date();
    this.modificadoPor = '';
    this.usuarioModificadoPor = '';
  }
}
