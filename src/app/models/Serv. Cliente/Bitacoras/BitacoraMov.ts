import { BitacoraMovCheckList } from "./BitacoraMovCheckList";

export interface IBitacoraMov {
    idBitacoraMov: number;
    idBitacora: number;
    idEstatus: string;
    estatus: string;
    solicitante: string;
    noCaja: string;
    rampaOrigen: string;
    rampaDestino: string;
    cajaDescripcion: string;
    horaInicial: Date;
    horaFinal: Date;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioModificadoPor: string;
    bitacoraMovCheckLists: BitacoraMovCheckList[];
}

export class BitacoraMov implements IBitacoraMov {
    idBitacoraMov: number;
    idBitacora: number;
    idEstatus: string;
    estatus: string;
    solicitante: string;
    noCaja: string;
    rampaOrigen: string;
    rampaDestino: string;
    cajaDescripcion: string;
    horaInicial: Date;
    horaFinal: Date;
    activo: boolean;
    fechaCreacion: Date | null;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioModificadoPor: string;
    bitacoraMovCheckLists: BitacoraMovCheckList[];
    constructor(activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date, horaInicial?: Date, horaFinal?: Date) {

        let date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        this.idBitacoraMov = 0;
        this.idBitacora = 0;
        this.idEstatus = '';
        this.estatus = '';
        this.solicitante = '';
        this.noCaja = '';
        this.rampaOrigen = '';
        this.rampaDestino = '';
        this.cajaDescripcion = '';
        this.horaInicial = horaInicial || new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
        this.horaFinal = horaFinal || new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
        this.activo = activo || true;
        this.fechaCreacion = fechaCreacion || new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
        this.creadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioCreadoPor = '';
        this.fechaModificacion = fechaModificacion || new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
        this.modificadoPor = '00000000-0000-0000-0000-000000000000';
        this.usuarioModificadoPor = '';
        this.bitacoraMovCheckLists = [];
    }
}