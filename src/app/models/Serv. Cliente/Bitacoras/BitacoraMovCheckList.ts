import { BitacoraMov } from "./BitacoraMov";

export interface IBitacoraMovCheckList {
    idBitacoraMovCheckList: number;
    idBitacoraMov: number;
    idCheckListSeguridad: number;
    realizado: boolean;
    comentario: string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
}

export class BitacoraMovCheckList {
    idBitacoraMovCheckList: number;
    idBitacoraMov: number;
    idCheckListSeguridad: number;
    realizado: boolean;
    comentario: string;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    constructor(activo?:boolean, fechaModificacion?: Date, fechaCreacion?: Date, realizado?: boolean) {
        this.idBitacoraMovCheckList = 0;
        this.idBitacoraMov = 0;
        this.idCheckListSeguridad = 0;
        this.realizado = realizado || false;;
        this.comentario = '';
        this.activo = activo || true ;
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = '';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = '';
    }
}

