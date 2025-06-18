export class Personal {
  idPersonal: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  idSucursal: number; // Puede variar según el tipo de UUID que estés utilizando en tu base de datos.
  sucursal: string;
  idCompania: number;
  compania: string;
  idDepartamento: number;
  departamento: string;
  idCategoria: number;
  categoria: string;
  email: string | null;
  noNomina: string | null;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string; // Puede variar según el tipo de UUID que estés utilizando en tu base de datos.
  fechaModificacion: Date;
  modificadoPor: string; // Puede variar según el tipo de UUID que estés utilizando en tu base de datos.
  usuarioCreadoPor: string;
  usuarioModificadoPor: string;
  rfc: string;
  foto: string;
  codigoBarras: string;
  constructor(
    idPersonal?: number,
    nombre?: string,
    apellidoPaterno?: string,
    apellidoMaterno?: string,
    idSucursal?: string,
    sucursal?: string,
    idCompania?: number,
    compania?: string,
    idDepartamento?: number,
    departamento?: string,
    idCategoria?: number,
    categoria?: string,
    email?: string | null,
    noNomina?: string | null,
    activo?: boolean,
    fechaCreacion?: Date,
    creadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string,
    usuarioCreadoPor?: string,
    usuarioModificadoPor?: string,
    foto?: string,
    codigoBarras?: string
  ) {
    this.idPersonal = idPersonal || 0;
    this.nombre = nombre || '';
    this.apellidoPaterno = apellidoPaterno || '';
    this.apellidoMaterno = apellidoMaterno || '';
    this.idSucursal = 0;
    this.sucursal = sucursal || '';
    this.idCompania = idCompania || 0;
    this.compania = compania || '';
    this.idDepartamento = idDepartamento || 0;
    this.departamento = departamento || '';
    this.idCategoria = idCategoria || 0;
    this.categoria = categoria || '';
    this.email = email || null;
    this.noNomina = noNomina || null;
    this.activo = activo || true;
    this.fechaCreacion = fechaCreacion || new Date();
    this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = fechaModificacion || new Date();
    this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
    this.usuarioCreadoPor = '';
    this.usuarioModificadoPor = '';
    this.rfc = '';
    this.foto = '';
    this.codigoBarras = '';
  }
}
