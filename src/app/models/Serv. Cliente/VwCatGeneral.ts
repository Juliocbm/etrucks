export class VwCatGenerals {
  idCatGeneral: string;
  idCatGenDetalle: string;
  claveCat: string;
  nombreCat: string;
  esPublico: boolean;
  idElemento: number;
  claveDet: string;
  nombreDet: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(
    idCatGeneral: string,
    idCatGenDetalle: string,
    claveCat: string,
    nombreCat: string,
    esPublico: boolean,
    idElemento: number,
    claveDet: string,
    nombreDet: string,
    activo: boolean,
    fechaCreacion: Date,
    creadoPor: string,
    fechaModificacion: Date,
    modificadoPor: string
  ) {
    this.idCatGeneral = idCatGeneral;
    this.idCatGenDetalle = idCatGenDetalle;
    this.claveCat = claveCat;
    this.nombreCat = nombreCat;
    this.esPublico = esPublico;
    this.idElemento = idElemento;
    this.claveDet = claveDet;
    this.nombreDet = nombreDet;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
    this.creadoPor = creadoPor;
    this.fechaModificacion = fechaModificacion;
    this.modificadoPor = modificadoPor;
  }
}
