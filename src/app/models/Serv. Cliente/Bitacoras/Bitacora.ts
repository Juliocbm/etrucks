import { BitacoraMov } from "./BitacoraMov";

export interface IBitacora {
    idBitacora: number;
    idCompania: number;
    idPeriodo: number;
    idFlota: number;
    idUnidad: string;
    idOperador: string;
    idUsuario: string;
    nombreOperador: string;
    apellidoPatOperador: string;
    apellidoMatOperador: string;
    idEstatus: string;
    estatus: string | null;
    idTurno: string;
    turno: string;
    idCliente: number;
    kmIniciales: number;
    kmFinales: number;
    horaIniciales: number;
    horaFinales: number;
    activo: boolean;
    movimientos: BitacoraMov[];
    fechaCreacion: Date | null;
    creadoPor: string;
    usuarioCreadoPor: string | null;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioModificadoPor: string | null;
}

export class Bitacora implements IBitacora {
    idBitacora: number;
    idCompania: number;
    idPeriodo: number;
    idFlota: number;
    idUnidad: string;
    idOperador: string;
    idUsuario: string;
    nombreOperador: string;
    apellidoPatOperador: string;
    apellidoMatOperador: string;
    idEstatus: string;
    estatus: string;
    idTurno: string;
    turno: string;
    idCliente: number;
    kmIniciales: number;
    kmFinales: number;
    horaIniciales: number;
    horaFinales: number;
    activo: boolean;
    movimientos: BitacoraMov[];
    fechaCreacion: Date;
    creadoPor: string;
    usuarioCreadoPor: string;
    fechaModificacion: Date | null;
    modificadoPor: string;
    usuarioModificadoPor: string;
    constructor(activo?: boolean, fechaCreacion?: Date, fechaModificacion?: Date) {
        this.idBitacora = 0;
        this.idCompania = 0;
        this.idPeriodo = 0;
        this.idFlota = 0;
        this.idUnidad = '';
        this.idOperador = '';
        this.idUsuario = '';
        this.nombreOperador = '';
        this.apellidoPatOperador = '';
        this.apellidoMatOperador = '';
        this.idEstatus = '';
        this.estatus = '';
        this.idTurno = '';
        this.turno = '';
        this.idCliente = 0;
        this.kmIniciales = 0;
        this.kmFinales = 0;
        this.horaIniciales = 0;
        this.horaFinales = 0;
        this.activo = activo || true;
        this.movimientos = [];
        this.fechaCreacion = fechaCreacion || new Date();
        this.creadoPor = 'A503A87D-8D6A-40C6-9997-A8A75EE390FB';
        this.usuarioCreadoPor = '';
        this.fechaModificacion = fechaModificacion || new Date();
        this.modificadoPor = 'A503A87D-8D6A-40C6-9997-A8A75EE390FB';;
        this.usuarioModificadoPor = '';
    }

}
