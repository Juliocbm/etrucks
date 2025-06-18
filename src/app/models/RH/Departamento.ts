export interface IDepartamento {
    idDepartamento: number;
    nombre: string;
    clave: string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    companiaDepartamento: CompaniaDepartamento[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    companiasSelect:any[];
  }

export class Departamento {

    idDepartamento: number;
    nombre: string;
    clave: string;
	activo: boolean;
	fechaCreacion: Date;
	creadoPor: string;
	fechaModificacion: Date;
	modificadoPor: string;
    companiaDepartamento: CompaniaDepartamento[];
    usuarioCreadoPor: string;
    usuarioModificadoPor: string;
    companiasSelect:any[];

    constructor(
        idDepartamento?: number,
        nombre?: string,
        clave?: string,
        activo?: boolean,
        fechaCreacion?: Date,
        creadoPor?: string,
        fechaModificacion?: Date,
        modificadoPor?: string,
        usuarioCreadoPor?: string,
        usuarioModificadoPor?: string,
    ) {
        this.idDepartamento = idDepartamento || 0;
        this.nombre = nombre || '';
        this.clave = clave || '';
        this.activo = activo || true;
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
        this.companiaDepartamento = [];
        this.usuarioCreadoPor = '';
        this.usuarioModificadoPor = '';
        this.companiasSelect = [];
    }
  }

    export class CompaniaDepartamento  {   
        id:number;
        idDepartamento: number;
        idCompania: number;
        nombreCorto?: string;
        activo: boolean;
        fechaCreacion: Date | null;
        creadoPor: string;
        fechaModificacion: Date | null;
        modificadoPor: string;
        constructor(activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date){
            this.id = 0;
            this.idDepartamento = 0;
            this.idCompania = 0;    
            this.activo = activo || true;
            this.creadoPor = '00000000-0000-0000-0000-000000000000';
            this.fechaCreacion = fechaCreacion || new Date();
            this.modificadoPor = '00000000-0000-0000-0000-000000000000';
            this.fechaModificacion = fechaModificacion || new Date();
            this.nombreCorto = '';
        }
    }