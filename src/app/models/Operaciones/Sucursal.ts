export class Sucursal {
  idSucursal: number;
  nombre: string;
  clave: string;
  idTipoSucursal: string;
  tipoSucursal: string;
  idCompania: number;
  compania: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  usuarioCreadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioModificadoPor: string;
  companiaSucursal: any | null;

  constructor(
    idSucursal: number = 0,
    nombre: string = '',
    clave: string = '',
    idTipoSucursal: string = '',
    tipoSucursal: string = '',
    idCompania: number = 0,
    compania: string = '',
    activo: boolean = true,
    fechaCreacion: Date = new Date(),
    creadoPor: string = '',
    usuarioCreadoPor: string = '',
    fechaModificacion: Date = new Date(),
    modificadoPor: string = '',
    usuarioModificadoPor: string = '',
    companiaSucursal: any | null = null
  ) {
    this.idSucursal = idSucursal;
    this.nombre = nombre;
    this.clave = clave;
    this.idTipoSucursal = idTipoSucursal;
    this.tipoSucursal = tipoSucursal;
    this.idCompania = idCompania;
    this.compania = compania;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.creadoPor = creadoPor;
    this.usuarioCreadoPor = usuarioCreadoPor;
    this.fechaModificacion = fechaModificacion;
    this.modificadoPor = modificadoPor;
    this.usuarioModificadoPor = usuarioModificadoPor;
    this.companiaSucursal = companiaSucursal;
  }
}
