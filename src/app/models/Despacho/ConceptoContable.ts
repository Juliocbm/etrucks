
//Define la interfaz para Plaza
export interface IConceptoContable {
    idConceptoContable: number;
    nombre: string;
    idTipoConcepto: string;
    tipoConcepto: string;
    nomTipo:string;
    idTipoNaturaleza: string;
    tipoNaturaleza: string;
    nomNaturaleza:string;
    imprimible: boolean;
    iva: number;
    cuenta: number;
    subcuenta: string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
  }

  export class ConceptoContable implements IConceptoContable {
    
    idConceptoContable: number;
    nombre: string;
    idTipoConcepto: string;
    tipoConcepto: string;
    nomTipo: string;
    idTipoNaturaleza: string;
    tipoNaturaleza: string;
    nomNaturaleza: string;
    imprimible: boolean;
    iva: number;
    cuenta: number;
    subcuenta: string;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
  
    constructor(imprimible?: boolean, activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
      this.idConceptoContable = 0;
      this.nombre = '';
      this.idTipoConcepto = ''
      this.tipoConcepto = '';
      this.nomTipo = '';
      this.idTipoNaturaleza = ''
      this.tipoNaturaleza = '';
      this.nomNaturaleza = '';
      this.imprimible = imprimible || false;
      this.iva = 0;
      this.cuenta = 0;
      this.subcuenta = '';
      this.activo = activo || true;
      this.creadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaCreacion = fechaCreacion || new Date();
      this.modificadoPor = '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.usuarioCreadoPor = '';
      this.usuarioModificadoPor = '';
    }   
  } 