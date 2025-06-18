// Modelo para clientes EDI
export interface ClienteEdi {
  idEdiConfig: number;
  idCliente: number;
  scac: string;
  descripcion: string;
  idCompanaia: number;
  activo: boolean;
}

// Modelo para datos del KPI
export interface EdiKpiData {
  anio: number;
  semana: number;
  totalPedidos: number;
  ediShipments: number;
  nonEDIShipments: number;
  loadTender: number;
  metaCliente: number;
  metaInt: number;
  idCliente: number;
  cliente: string;
}

export interface EdiKpiDataDetalle {
  anio: number;           // Año del pedido
  semana: number;         // Número de la semana
  shipment: number;       // ID del shipment
  pedido: number;         // ID del pedido (ep.idPedido)
  remolque: string;       // Número de remolque (ep.remolque)
  viaje: number;          // ID del viaje (ep.idViaje)
  unidad: string;         // Placa de la unidad (ep.unidad)
  esEdi: string;          // 'SI' o 'NO' (ep.esEdi)
  loadTender: number;     // Porcentaje de cumplimiento (calculado en el SP)
  metaCliente: number;    // Meta del cliente (95%)
  metaInterna: number;    // Meta interna (98%)
}


// Modelo genérico para respuestas (solo usa `items`, no el modelo completo)
export interface ApiResponse<T> {
  items: T[];
  totalRecords: number;
  success: boolean;
  errorList: string[];
}
