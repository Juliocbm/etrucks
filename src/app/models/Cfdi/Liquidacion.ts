export interface Liquidacion {
  idLiquidacion: number;
  nombre: string;
  rfc: string;
  fecha: Date;
  intentos: number;
  proximoIntento: Date | null;
  uuid: string | null;
  xml?: Blob | null;
  pdf?: Blob | null;
}
