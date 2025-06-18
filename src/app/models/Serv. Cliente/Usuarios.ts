export class Usuarios {
  id: string;
  vmUsuario: string;
  contraseña: string;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  activo: boolean;
  creadoPor: string;
  modificadoPor: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  resetToken: string | null;
  resetTokenExpires: Date | null;
  email: string;
  codigoVerificacion: string | null;
  usuarioRols: any[];

  constructor(
    id: string,
    vmUsuario: string,
    contraseña: string,
    nombres: string,
    apellidoPat: string,
    apellidoMat: string,
    activo: boolean,
    creadoPor: string,
    modificadoPor: string,
    fechaCreacion: Date,
    fechaModificacion: Date,
    resetToken: string | null,
    resetTokenExpires: Date | null,
    email: string,
    codigoVerificacion: string | null,
    usuarioRols: any[]
  ) {
    this.id = id;
    this.vmUsuario = vmUsuario;
    this.contraseña = contraseña;
    this.nombres = nombres;
    this.apellidoPat = apellidoPat;
    this.apellidoMat = apellidoMat;
    this.activo = activo;
    this.creadoPor = creadoPor;
    this.modificadoPor = modificadoPor;
    this.fechaCreacion = fechaCreacion;
    this.fechaModificacion = fechaModificacion;
    this.resetToken = resetToken;
    this.resetTokenExpires = resetTokenExpires;
    this.email = email;
    this.codigoVerificacion = codigoVerificacion;
    this.usuarioRols = usuarioRols;
  }
}
