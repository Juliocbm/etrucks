import { TimeService } from "src/app/shared-module/services/time.service";


export class consumoModel {
  idConsumo: number;
  idSucursal: number;
  idMenu: number;
  idPersonal: number;
  precio: number;
  porcentajeSubsidio: number;
  fechaIngreso: Date;
  idEstatus: number;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  esManual: boolean;
  idCompania: number;


  constructor(
    idConsumo: number = 0,
    idSucursal: number = 1,
    idMenu: number = 0,
    idPersonal: number = 0,
    precio: number = 0,
    porcentajeSubsidio: number = 0,
    fechaIngreso: Date = new Date(),
    idEstatus: number = 1,
    activo: boolean = true,
    fechaCreacion: Date = new Date(),
    creadoPor: string = '',
    fechaModificacion: Date = new Date(),
    modificadoPor: string = '',
    esManual: boolean = true,
    idCompania: number = 1
  ) {
    this.idConsumo = idConsumo;
    this.idSucursal = idSucursal;
    this.idMenu = idMenu;
    this.idPersonal = idPersonal;
    this.precio = precio;
    this.porcentajeSubsidio = porcentajeSubsidio;
    this.fechaIngreso = fechaIngreso;
    this.idEstatus = idEstatus;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.creadoPor = creadoPor;
    this.fechaModificacion = fechaModificacion;
    this.modificadoPor = modificadoPor;
    this.esManual = esManual;
    this.idCompania = idCompania;
  }
}

export class VwConsumoModel {
  idConsumo: number;
  idSucursal: number;
  nombreSucursal: string;
  idMenu: number;
  comidaMenu: string;
  idPersonal: number;
  nombrePersonal: string;
  precio: number;
  porcentajeSubsidio: number;
  fechaIngreso: Date;
  idEstatus: number;
  estatusConsumo: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  usuarioCreadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioModificadoPor: string;
  esManual: boolean;
  idCompania: number;


  constructor(
    idConsumo: number = 0,
    idSucursal: number = 0,
    nombreSucursal: string = '',
    idMenu: number = 0,
    comidaMenu: string = '',
    idPersonal: number = 0,
    nombrePersonal: string = '',
    precio: number = 0,
    porcentajeSubsidio: number = 0,
    fechaIngreso: Date = new Date(),
    idEstatus: number = 1,
    estatusConsumo: string = '',
    activo: boolean = true,
    fechaCreacion: Date = new Date(),
    creadoPor: string = '',
    usuarioCreadoPor: string = '',
    fechaModificacion: Date = new Date(),
    modificadoPor: string = '',
    usuarioModificadoPor: string = '',
    esManual: boolean = true,
    idCompania: number = 1
  ) {
    this.idConsumo = idConsumo;
    this.idSucursal = idSucursal;
    this.nombreSucursal = nombreSucursal;
    this.idMenu = idMenu;
    this.comidaMenu = comidaMenu;
    this.idPersonal = idPersonal;
    this.nombrePersonal = nombrePersonal;
    this.precio = precio;
    this.porcentajeSubsidio = porcentajeSubsidio;
    this.fechaIngreso = fechaIngreso;
    this.idEstatus = idEstatus;
    this.estatusConsumo = estatusConsumo;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.creadoPor = creadoPor;
    this.usuarioCreadoPor = usuarioCreadoPor;
    this.fechaModificacion = fechaModificacion;
    this.modificadoPor = modificadoPor;
    this.usuarioModificadoPor = usuarioModificadoPor;
    this.esManual = esManual;
    this.idCompania = idCompania;
  }
}
