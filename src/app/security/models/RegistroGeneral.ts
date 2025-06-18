// Define la interfaz para CatGeneral
export interface IRegistroGeneral {
  idCatGeneral: string; // UniqueIdentifier en SQL suele mapearse a un string en TypeScript
  idCatPadre: string | null; // Puede ser null según tu tabla SQL
  idElemento: number;
  clave: string;
  nombre: string;
  publico: boolean;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
}

// Implementa la interfaz en la clase
export class RegistroGeneral implements IRegistroGeneral {
  idCatGeneral: string;
  idCatPadre: string | null;
  idElemento: number;
  clave: string;
  nombre: string;
  publico: boolean;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  // Constructor para inicializar las propiedades
  constructor(
    idCatGeneral?: string,
    idCatPadre?: string | null,
    idElemento?: number,
    clave?: string,
    nombre?: string,
    publico?: boolean,
    activo?: boolean,
    fechaCreacion?: Date,
    creadoPor?: string,
    fechaModificacion?: Date,
    modificadoPor?: string
  ) {
    this.idCatGeneral = idCatGeneral || '00000000-0000-0000-0000-000000000000';
    this.idCatPadre = idCatPadre || null;
    this.idElemento = idElemento || 0;
    this.clave = clave || '';
    this.nombre = nombre || '';
    this.publico = publico || false;
    this.activo = activo || true; // Según tu SQL, el valor por defecto es true
    this.fechaCreacion = fechaCreacion || new Date();
    this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = fechaModificacion || new Date();
    this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
  }
}
