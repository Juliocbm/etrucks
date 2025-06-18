export interface Liquidacion {
  idLiquidacion: number;
  nombre: string;
  rfc: string;
  fecha: Date;
  estatus: number;
  mensaje: string;
  intentos: number;
  proximoIntento: Date | null;
  uuid: string | null;
  xml?: Blob | null;
  pdf?: Blob | null;
  /** Indicador de procesamiento en UI */
  timbrando?: boolean;
}
