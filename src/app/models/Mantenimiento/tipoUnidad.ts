export class tipoUnidad {
    idCatGenDetalle: string;
    idCatGeneral: string;
    idElemento: number;
    clave: string;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
  
    constructor() {
      this.idCatGenDetalle = '00000000-0000-0000-0000-000000000000';
      this.idCatGeneral = '00000000-0000-0000-0000-000000000000';
      this.idElemento = 0;
      this.clave = '';
      this.nombre = '';
      this.activo = false;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
  }
  