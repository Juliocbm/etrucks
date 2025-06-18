export class Sucursal {
    idSucursal: number;
    nombre: string;
    idCompania: number;
    compania: string;
    clave: string;
    idSucursalRef: number | null;
    activo: boolean;
    creadoPor: string;
    usuarioCreadoPor: string;
    modificadoPor: string;
    usuarioModificadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    sucursalDetalle: SucursalDetalle[];
    tipoSucursalSelect: any[];
    companiaSucursal: CompaniaSucursal[];
    companiasSelect:any[];
    sucursalGeocerca: SucursalGeocerca[];
    geocercasSelect:any[];
    constructor() {
      this.idSucursal = 0;
      this.nombre = '';
      this.idCompania = 0;
      this.compania = '';
      this.clave = '';
      this.idSucursalRef = null;
      this.activo = false;
      this.creadoPor = '';
      this.usuarioCreadoPor = '';
      this.modificadoPor = '';
      this.usuarioModificadoPor = '';
      this.fechaCreacion = new Date();
      this.fechaModificacion = new Date();
      this.sucursalDetalle = [];
      this.tipoSucursalSelect = [];
      this.companiaSucursal = [];
      this.companiasSelect = [];
      this.sucursalGeocerca = [];
      this.geocercasSelect = [];
    }
  }
  export class SucursalDetalle {
    idSucursalDetalle: number;
    idSucursal: number;
    idTipoSucursal: string;
    activo: boolean;
    creadoPor: string;
    modificadoPor: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    sucursal?: Sucursal;
  
    constructor() {
      this.idSucursalDetalle = 0;
      this.idSucursal = 0;
      this.idTipoSucursal = '';
      this.activo = false;
      this.creadoPor = '';
      this.modificadoPor = '';
      this.fechaCreacion = new Date();
      this.fechaModificacion = new Date();
      this.sucursal = undefined;
    }
  }

  export class SucursalGeocerca {
    idSucursalGeocerca: number;
    idSucursal: number;
    //Sucursal: string;
    idTipoSucursal: string | null;
    idGeocerca: string;
    nombreGeocerca: string;
    idCompania: number;
    activo: boolean;
    creado: Date;
    creadoPor: string;
    modificado: Date;
    modificadoPor: string;
    //sucursal?: Sucursal;
  
    constructor() {
      this.idSucursalGeocerca = 0;
      this.idSucursal = 0;
      //this.Sucursal = '';
      this.idTipoSucursal = null;
      this.idGeocerca = '00000000-0000-0000-0000-000000000000';
      this.nombreGeocerca = '';
      this.idCompania = 0;
      this.activo = false;
      this.creado = new Date();
      this.creadoPor = '';
      this.modificado = new Date();
      this.modificadoPor = '';
      //this.sucursal = undefined;
    }
  }
// export interface ISucursal {
//     idSucursal: number;
//     nombre: string;
//     clave: string;
//     idTipoSucursal: string;
//     tipoSucursal: string;
//     idCompania: number;
//     compania: string;
//     activo: boolean;
//     fechaCreacion: Date;
//     creadoPor: string;
//     usuarioCreadoPor: string;
//     fechaModificacion: Date;
//     modificadoPor: string;
//     usuarioModificadoPor: string;

//     companiaSucursal: CompaniaSucursal[];
// }

// export class Sucursal implements ISucursal {
//     idSucursal: number;
//     nombre: string;
//     clave: string;
//     idTipoSucursal: string;
//     tipoSucursal: string;
//     idCompania: number;
//     compania: string;
//     activo: boolean;
//     fechaCreacion: Date;
//     creadoPor: string;
//     usuarioCreadoPor: string;
//     fechaModificacion: Date;
//     modificadoPor: string;
//     usuarioModificadoPor: string;

//     companiaSucursal: CompaniaSucursal[];
//     companiasSelect:any[];
//     constructor(fechaCreacion?: Date, fechaModificacion?: Date) {
//         this.idSucursal = 0;
//         this.nombre = '';
//         this.clave = '';
//         this.idTipoSucursal = '';
//         this.tipoSucursal = '';
//         this.idCompania = 0;
//         this.compania = '';
//         this.activo = true;
//         this.fechaCreacion = fechaCreacion || new Date();
//         this.creadoPor = '00000000-0000-0000-0000-000000000000';
//         this.usuarioCreadoPor = '';
//         this.fechaModificacion = fechaModificacion || new Date();
//         this.modificadoPor = '00000000-0000-0000-0000-000000000000';
//         this.usuarioModificadoPor = '';

//         this.companiaSucursal = [];
//         this.companiasSelect = [];
//     }
// }

export interface ICompaniaSucursal {
    id: number;
    idSucursal: number;
    idCompania: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
}

export class CompaniaSucursal implements ICompaniaSucursal {
    id: number;
    idSucursal: number;
    idCompania: number;
    activo: boolean;
    fechaCreacion: Date;
    creadoPor: string;
    fechaModificacion: Date;
    modificadoPor: string;
    public constructor(fechaCreacion?: Date, fechaModificacion?: Date) {
        this.id = 0;
        this.idSucursal = 0;
        this.idCompania = 0;
        this.activo = false;
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    }
}