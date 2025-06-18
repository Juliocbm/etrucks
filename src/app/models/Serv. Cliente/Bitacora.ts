// export class Bitacora {
//     idBitacora: number;             // int
//     idCompania: number;             // tinyint
//     idPeriodo: number;              // int
//     idFlota: number;                // int
//     idUnidad: string;               // varchar(10)
//     idOperador: string;              // uniqueidentifier
//     nombreOperador: string;         // varchar(100)
//     apellidoPatOperador: string;    // varchar(100)
//     apellidoMatOperador: string;    // varchar(100)
//     idEstatus: string;              // uniqueidentifier
//     estatus: string;                // varchar(50)
//     idTurno: string;                // smallint
//     turno: string;                  // varchar(50)
//     idCliente: number;              // int
//     kmIniciales: number;            // decimal(10, 2)
//     kmFinales?: number;             // decimal(10, 2), Checked (nullable)
//     horaIniciales: number;          // decimal(10, 2)
//     horaFinales?: number;           // decimal(10, 2), Checked (nullable)
//     activo: boolean;                // bit
//     fechaCreacion: Date;            // datetime
//     creadoPor: string;              // uniqueidentifier
//     usuarioCreadoPor: string;       // varchar(100)
//     fechaModificacion: Date;        // datetime
//     modificadoPor: string;          // uniqueidentifier
//     usuarioModificadoPor: string;   // varchar(100)

//     constructor(data: Partial<Bitacora> = {}) {
//         this.idBitacora = data.idBitacora ?? 0;
//         this.idCompania = data.idCompania ?? 0;
//         this.idPeriodo = data.idPeriodo ?? 0;
//         this.idFlota = data.idFlota ?? 0;
//         this.idUnidad = data.idUnidad ?? '';
//         this.idOperador = data.idOperador ?? '';
//         this.nombreOperador = data.nombreOperador ?? '';
//         this.apellidoPatOperador = data.apellidoPatOperador ?? '';
//         this.apellidoMatOperador = data.apellidoMatOperador ?? '';
//         this.idEstatus = data.idEstatus ?? '';
//         this.estatus = data.estatus ?? '';
//         this.idTurno = data.idTurno ?? '';
//         this.turno = data.turno ?? '';
//         this.idCliente = data.idCliente ?? 0;
//         this.kmIniciales = data.kmIniciales ?? 0;
//         this.kmFinales = data.kmFinales ?? undefined;
//         this.horaIniciales = data.horaIniciales ?? 0;
//         this.horaFinales = data.horaFinales ?? undefined;
//         this.activo = data.activo ?? false;
//         this.fechaCreacion = data.fechaCreacion ?? new Date();
//         this.creadoPor = data.creadoPor ?? '';
//         this.usuarioCreadoPor = data.usuarioCreadoPor ?? '';
//         this.fechaModificacion = data.fechaModificacion ?? new Date();
//         this.modificadoPor = data.modificadoPor ?? '';
//         this.usuarioModificadoPor = data.usuarioModificadoPor ?? '';
//     }
// }
export class Bitacora {
  idBitacora: number;                    // int
  idCompania: number;                    // tinyint
  idPeriodo: number;                     // int
  idFlota: number;                       // int
  idUnidad: string;                      // varchar(10)
  idOperador: string;                    // uniqueidentifier
  nombreOperador: string;                // varchar(100)
  apellidoPatOperador: string;           // varchar(100)
  apellidoMatOperador: string;           // varchar(100)
  idEstatus: string;                     // uniqueidentifier
  estatus: string;                       // varchar(50)
  idTurno: string;                       // smallint
  turno: string;                         // varchar(50)
  idCliente: number;                     // int
  kmIniciales: number;                   // decimal(10, 2)
  kmFinales?: number;                    // decimal(10, 2), Checked (nullable)
  horaIniciales: number;                 // decimal(10, 2)
  horaFinales?: number;                  // decimal(10, 2), Checked (nullable)
  activo: boolean;                       // bit
  fechaCreacion: Date;                   // datetime
  creadoPor: string;                     // uniqueidentifier
  usuarioCreadoPor: string;              // varchar(100)
  fechaModificacion: Date;               // datetime
  modificadoPor: string;                 // uniqueidentifier
  usuarioModificadoPor: string;          // varchar(100)
  bitacoraMovs: BitacoraMovimiento[];   // Array of BitacoraMovimiento

  constructor(data: Partial<Bitacora> = {}) {
      this.idBitacora = data.idBitacora ?? 0;
      this.idCompania = data.idCompania ?? 0;
      this.idPeriodo = data.idPeriodo ?? 0;
      this.idFlota = data.idFlota ?? 0;
      this.idUnidad = data.idUnidad ?? '';
      this.idOperador = data.idOperador ?? '';
      this.nombreOperador = data.nombreOperador ?? '';
      this.apellidoPatOperador = data.apellidoPatOperador ?? '';
      this.apellidoMatOperador = data.apellidoMatOperador ?? '';
      this.idEstatus = data.idEstatus ?? '';
      this.estatus = data.estatus ?? '';
      this.idTurno = data.idTurno ?? '';
      this.turno = data.turno ?? '';
      this.idCliente = data.idCliente ?? 0;
      this.kmIniciales = data.kmIniciales ?? 0;
      this.kmFinales = data.kmFinales ?? undefined;
      this.horaIniciales = data.horaIniciales ?? 0;
      this.horaFinales = data.horaFinales ?? undefined;
      this.activo = data.activo ?? false;
      this.fechaCreacion = data.fechaCreacion ?? new Date();
      this.creadoPor = data.creadoPor ?? '';
      this.usuarioCreadoPor = data.usuarioCreadoPor ?? '';
      this.fechaModificacion = data.fechaModificacion ?? new Date();
      this.modificadoPor = data.modificadoPor ?? '';
      this.usuarioModificadoPor = data.usuarioModificadoPor ?? '';
      this.bitacoraMovs = data.bitacoraMovs ?? [];
  }
}

export class BitacoraMovimiento {
  idBitacoraMov: number;           // int
  idBitacora: number;               // int
  idEstatus: string;                // uniqueidentifier
  estatus: string;                  // varchar(50)
  solicitante: string;              // varchar(100)
  noCaja: string;                   // varchar(100)
  rampaOrigen: string;              // varchar(100)
  rampaDestino: string;             // varchar(100)
  cajaDescripcion: string;          // varchar(100)
  horaInicial: Date;                // datetime
  horaFinal: Date;                  // datetime
  activo: boolean;                  // bit
  fechaCreacion: Date;              // datetime
  creadoPor: string;                // uniqueidentifier
  usuarioCreadoPor: string;         // varchar(100)
  fechaModificacion: Date;          // datetime
  modificadoPor: string;            // uniqueidentifier
  usuarioModificadoPor: string;     // varchar(100)
  bitacoraMovCheckLists: BitacoraMovCheckList[];  // Array of BitacoraMovCheckList

  constructor(data: Partial<BitacoraMovimiento> = {}) {
      this.idBitacoraMov = data.idBitacoraMov ?? 0;
      this.idBitacora = data.idBitacora ?? 0;
      this.idEstatus = data.idEstatus ?? '';
      this.estatus = data.estatus ?? '';
      this.solicitante = data.solicitante ?? '';
      this.noCaja = data.noCaja ?? '';
      this.rampaOrigen = data.rampaOrigen ?? '';
      this.rampaDestino = data.rampaDestino ?? '';
      this.cajaDescripcion = data.cajaDescripcion ?? '';
      this.horaInicial = data.horaInicial ?? new Date();
      this.horaFinal = data.horaFinal ?? new Date();
      this.activo = data.activo ?? false;
      this.fechaCreacion = data.fechaCreacion ?? new Date();
      this.creadoPor = data.creadoPor ?? '';
      this.usuarioCreadoPor = data.usuarioCreadoPor ?? '';
      this.fechaModificacion = data.fechaModificacion ?? new Date();
      this.modificadoPor = data.modificadoPor ?? '';
      this.usuarioModificadoPor = data.usuarioModificadoPor ?? '';
      this.bitacoraMovCheckLists = data.bitacoraMovCheckLists ?? [];
  }
}

export class BitacoraMovCheckList {
  idBitacoraMovCheckList: number;    // int
  idBitacoraMov: number;              // int
  idCheckListSeguridad: number;       // int
  realizado: boolean;                 // bit
  comentario: string;                 // varchar(255)
  activo: boolean;                    // bit
  fechaCreacion: Date;                // datetime
  creadoPor: string;                  // uniqueidentifier
  fechaModificacion: Date;            // datetime
  modificadoPor: string;              // uniqueidentifier

  constructor(data: Partial<BitacoraMovCheckList> = {}) {
      this.idBitacoraMovCheckList = data.idBitacoraMovCheckList ?? 0;
      this.idBitacoraMov = data.idBitacoraMov ?? 0;
      this.idCheckListSeguridad = data.idCheckListSeguridad ?? 0;
      this.realizado = data.realizado ?? false;
      this.comentario = data.comentario ?? '';
      this.activo = data.activo ?? false;
      this.fechaCreacion = data.fechaCreacion ?? new Date();
      this.creadoPor = data.creadoPor ?? '';
      this.fechaModificacion = data.fechaModificacion ?? new Date();
      this.modificadoPor = data.modificadoPor ?? '';
  }
}
