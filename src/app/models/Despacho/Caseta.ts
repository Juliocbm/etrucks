/* import { string } from 'guid-typescript';   */

export class CasetaPeaje {
  idCasetaPeaje: number;
  nombre: string;
  idProvPeaje: string;
  provPeaje: string;
  autorizadaPor: string;
  autorizadaPorName: string;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  casetaCarril: CasetaPeajeCarril[];
  usuarioModificadoPor: string;
  usuarioCreadoPor: string;

  constructor() {
    this.idCasetaPeaje = 0;
    this.nombre = '';
    this.idProvPeaje = '00000000-0000-0000-0000-000000000000';
    this.provPeaje = '';
    this.autorizadaPor = '00000000-0000-0000-0000-000000000000';
    this.autorizadaPorName = '';
    this.activo = true;
    this.fechaCreacion = new Date();
    this.creadoPor = '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = new Date();
    this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    this.casetaCarril = [];
    this.usuarioModificadoPor = "";
    this.usuarioCreadoPor = "";
  }
}

export class CasetaPeajeCarril {
  idCasetaPeajeCarril: number;
  nombre: string;
  idCasetaPeaje: number;
  idSitio: number;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;
  carrilTarifa: CasetaPeajeCarrilTarifa[];

  constructor() {
    this.idCasetaPeajeCarril = 0;
    this.nombre = '';
    this.idCasetaPeaje = 0;
    this.idSitio = 0;
    this.activo = true;
    this.fechaCreacion = new Date();
    this.creadoPor = '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = new Date();
    this.modificadoPor = '00000000-0000-0000-0000-000000000000';
    this.carrilTarifa = [];
  }
}

export class CasetaPeajeCarrilTarifa {
  idCasetaPeajeCarrilTarifa: number;
  idCasetaPeajeCarril: number;
  idTipoUnidad: string;
  idNumeroEjes: string;
  tarifa: number;
  activo: boolean;
  fechaCreacion: Date;
  creadoPor: string;
  fechaModificacion: Date;
  modificadoPor: string;

  constructor() {
    this.idCasetaPeajeCarrilTarifa = 0;
    this.idCasetaPeajeCarril = 0;
    this.idTipoUnidad = '00000000-0000-0000-0000-000000000000';
    this.idNumeroEjes = '00000000-0000-0000-0000-000000000000';
    this.tarifa = 0;
    this.activo = true;
    this.fechaCreacion = new Date();
    this.creadoPor = '00000000-0000-0000-0000-000000000000';
    this.fechaModificacion = new Date();
    this.modificadoPor = '00000000-0000-0000-0000-000000000000';
  }
}
