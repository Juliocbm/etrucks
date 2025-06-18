export class Bitacora {
    idBitacora: number;             // int
    idCompania: number;             // tinyint
    idPeriodo: number;              // int
    idFlota: number;                // int
    idUnidad: string;               // varchar(10)
    idUsuario: string;              // uniqueidentifier
    idEstatus: string;              // uniqueidentifier
    idTurno: number;                // smallint
    idCliente: number;              // int
    kmIniciales: number;            // decimal(10, 2)
    kmFinales?: number;             // decimal(10, 2), Checked (nullable)
    horaIniciales: number;          // decimal(10, 2)
    horaFinales?: number;           // decimal(10, 2), Checked (nullable)
    activo: boolean;                // bit
    fechaCreacion: Date;            // datetime
    creadoPor: string;              // uniqueidentifier
    fechaModificacion: Date;        // datetime
    modificadoPor: string;          // uniqueidentifier

    constructor(data: Partial<Bitacora> = {}) {
        this.idBitacora = data.idBitacora ?? 0;
        this.idCompania = data.idCompania ?? 0;
        this.idPeriodo = data.idPeriodo ?? 0;
        this.idFlota = data.idFlota ?? 0;
        this.idUnidad = data.idUnidad ?? '';
        this.idUsuario = data.idUsuario ?? '';
        this.idEstatus = data.idEstatus ?? '';
        this.idTurno = data.idTurno ?? 0;
        this.idCliente = data.idCliente ?? 0;
        this.kmIniciales = data.kmIniciales ?? 0;
        this.kmFinales = data.kmFinales ?? undefined;
        this.horaIniciales = data.horaIniciales ?? 0;
        this.horaFinales = data.horaFinales ?? undefined;
        this.activo = data.activo ?? false;
        this.fechaCreacion = data.fechaCreacion ?? new Date();
        this.creadoPor = data.creadoPor ?? '';
        this.fechaModificacion = data.fechaModificacion ?? new Date();
        this.modificadoPor = data.modificadoPor ?? '';
    }
}
