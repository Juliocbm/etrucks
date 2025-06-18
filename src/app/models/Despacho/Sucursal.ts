export class Sucursal {
  idSucursal: number;
  nombre: string;
  clave: string;
  idTipoSucursal: string;
  tipoSucursal: string;
  idCompania: number;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  usuarioCreadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  usuarioModificadoPor: string;
  companiaSucursal:CompaniaSucursal[];
  companiasSelect:any[];
  constructor(
      idSucursal?: number,
      nombre?: string,
      clave?: string,
      idCompania?: number,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      usuarioCreadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
      usuarioModificadoPor?:string
  ) {
      this.idSucursal =  0;
      this.nombre ='';
      this.clave = '';
      this.idTipoSucursal =  '';
      this.tipoSucursal = '';
      this.idCompania = idCompania || 0;
      this.activo = activo || false;
      this.fechaCreacion = fechaCreacion || new Date();
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.usuarioCreadoPor = usuarioCreadoPor ||'';
      this.fechaModificacion = fechaModificacion || new Date();
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
      this.usuarioModificadoPor = usuarioModificadoPor || '';
      this.companiaSucursal = [];
      this.companiasSelect= [];
  }
}


export class CompaniaSucursal {
  id: number;
  idSucursal: number;
  idCompania: number;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor(
      id?: number,
      idSucursal?: number,
      idCompania?: number,
      activo?: boolean,
      fechaCreacion?: Date,
      creadoPor?: string,
      fechaModificacion?: Date,
      modificadoPor?: string,
  ) {
      this.idSucursal = idSucursal || 0;
      this.id = id || 0;
      this.idCompania = idCompania || 0;
      this.activo = activo || false;
      this.fechaCreacion = fechaCreacion || new Date();
      this.creadoPor = creadoPor || '00000000-0000-0000-0000-000000000000';
      this.fechaModificacion = fechaModificacion || new Date();
      this.modificadoPor = modificadoPor || '00000000-0000-0000-0000-000000000000';
  }
}