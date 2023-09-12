export class Unidad {
  idUnidad: number;
  idCompania: number;
  clave: string;
  descripcion: string;
  noSerie: string;
  modelo: number;
  placas: string;
  idMarca: string;
  idTipoUnidad: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor() {
      this.idUnidad = 0;
      this.idCompania = 0;
      this.clave = '';
      this.descripcion = '';
      this.noSerie = '';
      this.modelo = 0;
      this.placas = '';
      this.idMarca = '00000000-0000-0000-0000-000000000000';
      this.idTipoUnidad = '00000000-0000-0000-0000-000000000000';
      this.activo = false;
      this.fechaCreacion = new Date();
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
  }
}
