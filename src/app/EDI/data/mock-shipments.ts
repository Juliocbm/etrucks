/**
 * Datos de prueba para el EDI Tracker
 * Contiene información sobre estatus de shipments, shipments y eventos
 */

// Interfaces según el modelo requerido

// Estatus de Shipment
export interface EstatusShipment {
  idEstatusShipment: number;
  estatusShipment: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: Date;
}

// Shipment Base
export interface ShipmentBase {
  idShipment: number;
  idConexionDetalle: number;
  idArchivoDescarga: number;
  idEstatusShipment: number;
  shipment: string;
  equipo: string;
  origen: string;
  destino: string;
  numControl: string;
  codigoTipoFechaExp: string;
  fechaExpiracion: Date | null;
  cruce: number;
  observacion: string;
  activo: boolean;
  fechaCreacion: Date;
  modificadoPor: string; // UUID
  fechaModificacion: Date;
  idEdiPedido: string | null;
  idEdiViaje: string | null;
}

// Evento de Shipment
export interface EventoShipment {
  idEventoShipmentParada: number;
  idShipmentParadas: number;
  idEvento: number;
  enviado: boolean;
  tituloArchivo: string;
  contenidoArchivo: string;
  fechaEnviado: Date;
  esManual: boolean;
  activo: boolean;
  creadoPor: string; // UUID
  fechaCreacion: Date;
  modificadoPor: string; // UUID
  fechaModificacion: Date;
}

// Modelo Detallado del Tracker
export interface ShipmentDetallado {
  id: string;
  cabecera: {
    estatus: string;
    scac: string;
    fecha_ingreso: Date;
    shipment_id: string;
  };
  transporte: {
    pedido: string;
    viaje: string;
    unidad: string;
    satelite_mac: string | null;
    inicio_viaje: Date | null;
    fin_viaje: Date | null;
    rango_horas: string;
  };
  remitente: {
    nombre: string;
    site_id: string;
    geocerca: string;
  };
  destinatario: {
    nombre: string;
    site_id: string;
    geocerca: string;
  };
  eventos_app: Array<{
    mensaje: string;
    fecha: Date;
    sistema: string;
    viaje: string;
    id_personalizado: string;
  }>;
  stops: Array<{
    numero: number;
    cliente: string;
    tipo: string;
    entrada: Date;
    salida: Date;
    lugar: string;
  }>;
  eventos_reportados: Array<{
    caso: string;
    descripcion: string;
    fecha: Date;
  }>;
  estatus_seguimiento: Array<{
    caso: string;
    estatus: string;
    fecha_notificacion: Date;
  }>;
  mapa: {
    ruta: [number, number][];
    geocercas: Array<{
      nombre: string;
      poligono: [number, number][];
    }>;
    marcadores: Array<{
      tipo: string;
      posicion: [number, number];
      datos: {
        nombre: string;
        tiempo: Date;
        estado: string;
      };
    }>;
  };
}

// Lista de estatus posibles para un shipment
export const estatusShipments: EstatusShipment[] = [
  {
    idEstatusShipment: 1,
    estatusShipment: 'NUEVO',
    descripcion: 'Archivo EDI 204 recien procesado',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  },
  {
    idEstatusShipment: 2,
    estatusShipment: 'POR CONFIRMAR',
    descripcion: 'Generacion pendiente archivo 990 confirmado',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  },
  {
    idEstatusShipment: 3,
    estatusShipment: 'POR CANCELAR',
    descripcion: 'Generacion pendiente de archivo 990 cancelado',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  },
  {
    idEstatusShipment: 4,
    estatusShipment: 'CONFIRMADO',
    descripcion: 'Confirmacion de shipment, se envia edi 990',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  },
  {
    idEstatusShipment: 5,
    estatusShipment: 'CANCELADO',
    descripcion: 'Cuando se cancela un shipment',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  },
  {
    idEstatusShipment: 6,
    estatusShipment: 'RELACIONADO',
    descripcion: 'Relacion de viaje/pedido a pedido edi',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  },
  {
    idEstatusShipment: 7,
    estatusShipment: 'REPORTANDO EVENTOS',
    descripcion: 'Reporte de eventos 214 EDI',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  },
  {
    idEstatusShipment: 8,
    estatusShipment: 'FINALIZADO',
    descripcion: 'Se termino de generar eventos 214 del shipment',
    activo: true,
    fechaCreacion: new Date('2025-01-20 13:40:21.083')
  }
];

// Lista de shipments
export const shipments: ShipmentBase[] = [
  {
    idShipment: 584,
    idConexionDetalle: 2,
    idArchivoDescarga: 8458,
    idEstatusShipment: 1,
    shipment: '49453760',
    equipo: '',
    origen: 'HG TRANSPORTES CARRIER YARD',
    destino: 'DAIMLER TRACTOCAMIONES - 013',
    numControl: '104391030',
    codigoTipoFechaExp: '',
    fechaExpiracion: null,
    cruce: 0,
    observacion: '',
    activo: true,
    fechaCreacion: new Date('2025-03-24 11:33:24.920'),
    modificadoPor: 'B4F7AA36-4232-4BE1-BD9D-F772CEBAA002',
    fechaModificacion: new Date('2025-03-24 11:33:24.920'),
    idEdiPedido: null,
    idEdiViaje: null
  },
  {
    idShipment: 583,
    idConexionDetalle: 1,
    idArchivoDescarga: 9064,
    idEstatusShipment: 6,
    shipment: '85763656',
    equipo: '5345914',
    origen: 'MOLDED FIBER GLASS COMPANIES-56305S1',
    destino: 'NAV PALOS GARZA',
    numControl: '101077',
    codigoTipoFechaExp: '64',
    fechaExpiracion: new Date('2025-01-27 15:30:00.000'),
    cruce: 0,
    observacion: 'Test',
    activo: true,
    fechaCreacion: new Date('2025-01-27 13:46:50.343'),
    modificadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaModificacion: new Date('2025-03-11 14:18:04.697'),
    idEdiPedido: '100',
    idEdiViaje: '100'
  },
  {
    idShipment: 582,
    idConexionDetalle: 1,
    idArchivoDescarga: 9022,
    idEstatusShipment: 6,
    shipment: '85772270',
    equipo: 'W31451',
    origen: 'CRISTALES INASTILLABLES DE MEXICO -21657X2',
    destino: 'ABSOLUTE NUEVO LAREDO',
    numControl: '101074',
    codigoTipoFechaExp: '64',
    fechaExpiracion: new Date('2025-01-27 15:29:00.000'),
    cruce: 0,
    observacion: '',
    activo: true,
    fechaCreacion: new Date('2025-01-27 13:40:48.690'),
    modificadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaModificacion: new Date('2025-03-11 14:30:12.903'),
    idEdiPedido: '146',
    idEdiViaje: '97'
  },
  {
    idShipment: 581,
    idConexionDetalle: 1,
    idArchivoDescarga: 9021,
    idEstatusShipment: 6,
    shipment: '85729308',
    equipo: '381117',
    origen: 'MOLDED MATERIALS DE MEXICO',
    destino: 'NAV TRANSPORTES FEMA HUB',
    numControl: '101073',
    codigoTipoFechaExp: '64',
    fechaExpiracion: new Date('2025-01-27 15:25:00.000'),
    cruce: 0,
    observacion: 'Cancelado',
    activo: true,
    fechaCreacion: new Date('2025-01-27 13:38:48.690'),
    modificadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaModificacion: new Date('2025-03-11 14:30:21.277'),
    idEdiPedido: '110',
    idEdiViaje: '96'
  },
  {
    idShipment: 580,
    idConexionDetalle: 1,
    idArchivoDescarga: 9020,
    idEstatusShipment: 6,
    shipment: '85729308',
    equipo: '381117',
    origen: 'MOLDED MATERIALS DE MEXICO',
    destino: 'NAV TRANSPORTES FEMA HUB',
    numControl: '101073',
    codigoTipoFechaExp: '64',
    fechaExpiracion: new Date('2025-01-27 15:25:00.000'),
    cruce: 0,
    observacion: '',
    activo: true,
    fechaCreacion: new Date('2025-01-27 13:37:48.463'),
    modificadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaModificacion: new Date('2025-03-11 11:47:34.427'),
    idEdiPedido: null,
    idEdiViaje: null
  }
];

// Lista de eventos para los shipments
export const eventosShipment: EventoShipment[] = [
  {
    idEventoShipmentParada: 21,
    idShipmentParadas: 1169,
    idEvento: 6,
    enviado: false,
    tituloArchivo: 'HGTR_214X6_ID1169_20250114055058.edi',
    contenidoArchivo: `ISA*00*          *00*          *02*HGTR           *01*006922827DML1  *250114*0544*U*00401*000745291*0*P*|~
GS*QM*HGTR*006922827DML1*20250114*0544*745291*X*004010~
ST*214*000745291~
B10*2969952*49321852*HGTR~
LX*1~
AT7*X6*NS***20250114*0544*CT~
MS1****-100.51*25.7252*W*N~
MS2*HGTR*1351~
L11*142750993*2I~
SE*8*000745291~
GE*1*745291~
IEA*1*000745291~`,
    fechaEnviado: new Date('2025-01-14 16:58:00.000'),
    esManual: false,
    activo: true,
    creadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaCreacion: new Date('2025-04-14 17:06:20.073'),
    modificadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaModificacion: new Date('2025-04-14 17:06:20.073')
  },
  {
    idEventoShipmentParada: 22,
    idShipmentParadas: 1170,
    idEvento: 3,
    enviado: true,
    tituloArchivo: 'HGTR_214X3_ID1170_20250114063022.edi',
    contenidoArchivo: `ISA*00*          *00*          *02*HGTR           *01*006922827DML1  *250114*0630*U*00401*000745292*0*P*|~
GS*QM*HGTR*006922827DML1*20250114*0630*745292*X*004010~
ST*214*000745292~
B10*2969952*49321852*HGTR~
LX*1~
AT7*X3*NS***20250114*0630*CT~
MS1****-100.31*25.7052*W*N~
MS2*HGTR*1351~
L11*142750993*2I~
SE*8*000745292~
GE*1*745292~
IEA*1*000745292~`,
    fechaEnviado: new Date('2025-01-14 18:30:00.000'),
    esManual: false,
    activo: true,
    creadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaCreacion: new Date('2025-04-14 18:35:10.123'),
    modificadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaModificacion: new Date('2025-04-14 18:35:10.123')
  },
  {
    idEventoShipmentParada: 23,
    idShipmentParadas: 1171,
    idEvento: 7,
    enviado: true,
    tituloArchivo: 'HGTR_214X7_ID1171_20250115102211.edi',
    contenidoArchivo: `
      ISA*00*          *00*          *02*HGTR           *01*006922827DML1  *250115*1022*U*00401*000745293*0*P*|~
      GS*QM*HGTR*006922827DML1*20250115*1022*745293*X*004010~
      ST*214*000745293~
      B10*2969952*49321852*HGTR~
      LX*1~
      AT7*X7*NS***20250115*1022*CT~
      MS1****-101.01*25.9152*W*N~
      MS2*HGTR*1352~
      L11*142750993*2I~
      SE*8*000745293~
      GE*1*745293~
      IEA*1*000745293~`,
    fechaEnviado: new Date('2025-01-15 10:25:00.000'),
    esManual: false,
    activo: true,
    creadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaCreacion: new Date('2025-04-15 10:30:15.456'),
    modificadoPor: '6700B259-2F9A-487D-B2C1-F1B82B8E5C6A',
    fechaModificacion: new Date('2025-04-15 10:30:15.456')
  }
];

// Datos enriquecidos para la visualización del Tracker
export const shipmentDetailedData: ShipmentDetallado[] = [
  {
    id: '49453760',
    cabecera: {
      estatus: '1 - Nuevo',
      scac: 'HGTR',
      fecha_ingreso: new Date('2025-03-24 11:33:24.920'),
      shipment_id: '49453760'
    },
    transporte: {
      pedido: '104391030',
      viaje: '',
      unidad: '',
      satelite_mac: '',
      inicio_viaje: null,
      fin_viaje: null,
      rango_horas: ''
    },
    remitente: {
      nombre: 'HG TRANSPORTES CARRIER YARD',
      site_id: 'HGTCY-001',
      geocerca: 'PATIO CARRIER'
    },
    destinatario: {
      nombre: 'DAIMLER TRACTOCAMIONES - 013',
      site_id: 'DAIMT-013',
      geocerca: 'ALAMACÉN DAIMLER'
    },
    eventos_app: [
      {
        mensaje: 'Se procesó archivo EDI 204',
        fecha: new Date('2025-03-24 11:33:24.920'),
        sistema: 'SISTEMA-EDI',
        viaje: '',
        id_personalizado: 'EV-584-001'
      },
      {
        mensaje: 'Notificación enviada al transportista',
        fecha: new Date('2025-03-24 11:40:05.300'),
        sistema: 'APP-MÓVIL',
        viaje: '',
        id_personalizado: 'EV-584-002'
      },
      {
        mensaje: 'Usuario recibió notificación de nuevo viaje',
        fecha: new Date('2025-03-24 12:15:30.745'),
        sistema: 'APP-MÓVIL',
        viaje: '',
        id_personalizado: 'EV-584-003'
      }
    ],
    stops: [],
    eventos_reportados: [
      {
        caso: 'RT-49453760-001',
        descripcion: 'Shipment recibido por sistema EDI',
        fecha: new Date('2025-03-24 11:33:24.920')
      },
      {
        caso: 'RT-49453760-002',
        descripcion: 'Notificación enviada a transportista',
        fecha: new Date('2025-03-24 11:40:05.300')
      }
    ],
    estatus_seguimiento: [
      {
        caso: 'ST-49453760-001',
        estatus: 'Nuevo',
        fecha_notificacion: new Date('2025-03-24 11:33:24.920')
      },
      {
        caso: 'ST-49453760-002',
        estatus: 'Por confirmar',
        fecha_notificacion: new Date('2025-03-24 11:40:05.300')
      }
    ],
    mapa: {
      ruta: [
        [-100.246, 25.676],
        [-100.250, 25.680],
        [-100.255, 25.685]
      ],
      geocercas: [
        {
          nombre: 'PATIO CARRIER',
          poligono: [
            [-100.240, 25.670],
            [-100.240, 25.680],
            [-100.250, 25.680],
            [-100.250, 25.670]
          ]
        },
        {
          nombre: 'ALAMACÉN DAIMLER',
          poligono: [
            [-100.251, 25.681],
            [-100.251, 25.691],
            [-100.261, 25.691],
            [-100.261, 25.681]
          ]
        }
      ],
      marcadores: [
        {
          tipo: 'Origen',
          posicion: [-100.246, 25.676],
          datos: {
            nombre: 'HG TRANSPORTES CARRIER YARD',
            tiempo: new Date('2025-03-24 11:33:24.920'),
            estado: 'Visitado'
          }
        },
        {
          tipo: 'Destino',
          posicion: [-100.255, 25.685],
          datos: {
            nombre: 'DAIMLER TRACTOCAMIONES - 013',
            tiempo: new Date('2025-03-24 11:40:05.300'),
            estado: 'Completado'
          }
        },
        {
          tipo: 'Posición',
          posicion: [-100.250, 25.680],
          datos: {
            nombre: 'Posición actual del vehículo',
            tiempo: new Date('2025-03-24 12:15:30.745'),
            estado: 'En ruta'
          }
        }
      ]
    }
  },
  {
    id: '85763656',
    cabecera: {
      estatus: '6 - Relacionado',
      scac: 'NAVL',
      fecha_ingreso: new Date('2025-01-27 13:46:50.343'),
      shipment_id: '85763656'
    },
    transporte: {
      pedido: '100',
      viaje: '100',
      unidad: '5345914',
      satelite_mac: '00:1B:44:11:3A:B7',
      inicio_viaje: new Date('2025-01-27 14:00:00'),
      fin_viaje: new Date('2025-01-28 11:30:00'),
      rango_horas: '21h 30m'
    },
    remitente: {
      nombre: 'MOLDED FIBER GLASS COMPANIES-56305S1',
      site_id: 'MFGC-56305S1',
      geocerca: 'MOLDED FIBER GLASS'
    },
    destinatario: {
      nombre: 'NAV PALOS GARZA',
      site_id: 'NAVPG-001',
      geocerca: 'ALMACÉN PALOS GARZA'
    },
    eventos_app: [
      {
        mensaje: 'Se procesa archivo EDI 204',
        fecha: new Date('2025-01-27 13:46:50.343'),
        sistema: 'SISTEMA-EDI',
        viaje: '100',
        id_personalizado: 'EV-583-001'
      },
      {
        mensaje: 'Se relaciona con viaje/pedido',
        fecha: new Date('2025-01-27 14:00:00.000'),
        sistema: 'SISTEMA-EDI',
        viaje: '100',
        id_personalizado: 'EV-583-002'
      },
      {
        mensaje: 'AA - Llegada a punto de carga',
        fecha: new Date('2025-01-27 15:30:00.000'),
        sistema: 'APP-MOVIL',
        viaje: '100',
        id_personalizado: 'EV-583-003'
      },
      {
        mensaje: 'X3 - Inicio de carga',
        fecha: new Date('2025-01-27 15:45:00.000'),
        sistema: 'APP-MOVIL',
        viaje: '100',
        id_personalizado: 'EV-583-004'
      },
      {
        mensaje: 'AF - Fin de carga',
        fecha: new Date('2025-01-27 17:30:00.000'),
        sistema: 'APP-MOVIL',
        viaje: '100',
        id_personalizado: 'EV-583-005'
      },
      {
        mensaje: 'X6 - En ruta hacia destino',
        fecha: new Date('2025-01-27 17:35:00.000'),
        sistema: 'APP-MOVIL',
        viaje: '100',
        id_personalizado: 'EV-583-006'
      },
      {
        mensaje: 'X1 - Inicio de descarga',
        fecha: new Date('2025-01-28 09:15:00.000'),
        sistema: 'APP-MOVIL',
        viaje: '100',
        id_personalizado: 'EV-583-008'
      },
      {
        mensaje: 'D1 - Fin de descarga',
        fecha: new Date('2025-01-28 11:30:00.000'),
        sistema: 'APP-MOVIL',
        viaje: '100',
        id_personalizado: 'EV-583-009'
      },
      {
        mensaje: 'Viaje completado',
        fecha: new Date('2025-01-28 11:35:00.000'),
        sistema: 'SISTEMA-EDI',
        viaje: '100',
        id_personalizado: 'EV-583-010'
      }
    ],
    stops: [
      {
        numero: 1,
        cliente: 'MOLDED FIBER GLASS COMPANIES',
        tipo: 'Carga',
        entrada: new Date('2025-01-27 15:30:00.000'),
        salida: new Date('2025-01-27 17:35:00.000'),
        lugar: 'MOLDED FIBER GLASS'
      },
      {
        numero: 2,
        cliente: 'NAV PALOS GARZA',
        tipo: 'Descarga',
        entrada: new Date('2025-01-28 09:00:00.000'),
        salida: new Date('2025-01-28 11:35:00.000'),
        lugar: 'ALMACÉN PALOS GARZA'
      }
    ],
    eventos_reportados: [
      {
        caso: 'T-101',
        descripcion: 'Retraso por tráfico pesado',
        fecha: new Date('2025-01-27 21:15:00.000')
      }
    ],
    estatus_seguimiento: [
      {
        caso: 'T-101',
        estatus: 'Resuelto',
        fecha_notificacion: new Date('2025-01-27 23:30:00.000')
      }
    ],
    mapa: {
      ruta: [
        [-100.246, 25.676],
        [-100.300, 25.700],
        [-100.350, 25.730],
        [-100.400, 25.760],
        [-100.450, 25.790]
      ],
      geocercas: [
        {
          nombre: 'MOLDED FIBER GLASS',
          poligono: [
            [-100.240, 25.670],
            [-100.240, 25.680],
            [-100.250, 25.680],
            [-100.250, 25.670]
          ]
        },
        {
          nombre: 'ALMACÉN PALOS GARZA',
          poligono: [
            [-100.445, 25.785],
            [-100.445, 25.795],
            [-100.455, 25.795],
            [-100.455, 25.785]
          ]
        }
      ],
      marcadores: [
        {
          tipo: 'Origen',
          posicion: [-100.246, 25.676],
          datos: {
            nombre: 'MOLDED FIBER GLASS COMPANIES-56305S1',
            tiempo: new Date('2025-01-27 15:30:00.000'),
            estado: 'Visitado'
          }
        },
        {
          tipo: 'Destino',
          posicion: [-100.450, 25.790],
          datos: {
            nombre: 'NAV PALOS GARZA',
            tiempo: new Date('2025-01-28 09:00:00.000'),
            estado: 'Completado'
          }
        },
        {
          tipo: 'Posición',
          posicion: [-100.400, 25.760],
          datos: {
            nombre: 'Posición actual',
            tiempo: new Date('2025-01-28 08:30:00.000'),
            estado: 'En ruta'
          }
        }
      ]
    }
  }
];
