export class Patio {
  idPatio: string ; // Cambiado a string
  nombre: string;
  clave: string;
  idCompania: number;
  nomCompania: string;
  idSitio: number;
  nomGeocerca: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioCreadoPor: string;
  usuarioModificadoPor: string;
  idSitioNavigation: {
  };

  constructor(idPatio?: string,) {
    this.idPatio = idPatio || '00000000-0000-0000-0000-000000000000';
    this.nombre = '';
    this.clave = '';
    this.idCompania = 0;
    this.nomCompania= '';
    this.idSitio = 0;
    this.nomGeocerca = '',
    this.activo = true;
    this.fechaCreacion = new Date();
    this.creadoPor = '';
    this.fechaModificacion = new Date();
    this.modificadoPor = '';
    this.idSitioNavigation = {
    };
    this.usuarioCreadoPor = '';
    this.usuarioModificadoPor = '';
  }
}

export class GeocercaPatio
{
  idGeofence: string;
  nameGeo: string;
  polygonPoints: string;

  constructor() {
    this.idGeofence = '';
    this.nameGeo = '';
    this.polygonPoints = '';
  }
}

export class Geocerca {
  idSitio: number;
  nombre: string;
  coordenadasPoli: string;
  idGeocerca: string;
  idProvGps: string;
  activo: boolean;
  tipo: string | null;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  patios: Patio[]; // Asumiendo que cada geocerca tiene una colección de patios.

  constructor() {
    this.idSitio = 0;
    this.nombre = '';
    this.coordenadasPoli = '';
    this.idGeocerca = '00000000-0000-0000-0000-000000000000';
    this.idProvGps = '00000000-0000-0000-0000-000000000000';
    this.activo = false;
    this.tipo = null;
    this.fechaCreacion = new Date();
    this.creadoPor = '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = new Date();
    this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    this.patios = [];
  }
}

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

export class Marca {
  idMarca: string;
  nombre: string;
  descripcion: string;
  idTipoMarca: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  usuarioCreadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioModificadoPor: string;

  constructor(
      idMarca?: string,
      nombre?: string,
      descripcion?: string,
      idTipoMarca?: string,
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
      this.idTipoMarca = idTipoMarca || 'AEFCBD66-F3E1-46B2-B520-4A1901E993A8';
      this.activo = activo || false;
      this.fechaCreacion = fechaCreacion || new Date();
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.usuarioCreadoPor = usuarioCreadoPor ||'';
      this.fechaModificacion = fechaModificacion || new Date();
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
      this.usuarioModificadoPor = usuarioModificadoPor || '';
  }
}
