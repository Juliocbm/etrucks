export class MenuComedorModel {
    idComida: number;
    descripcion: string;
    precio: number;
    porcentajeSubsidio: number;
    idSucursal: number;
    sucursal: string;
    creadoPor: string;
    usuarioCreadoPor: string;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    activo: boolean;
  
    constructor() {
      this.idComida = 0;
      this.descripcion = '';
      this.precio = 0;
      this.porcentajeSubsidio = 0;
      this.idSucursal = 0;
      this.sucursal = '';
      this.creadoPor = '';
      this.usuarioCreadoPor = '';
      this.modificadoPor = '';
      this.usuarioModificadoPor = '';
      this.fechaCreacion = new Date();
      this.fechaModificacion = new Date();
      this.activo = false;
    }
  }