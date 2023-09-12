/*
export class Liquidacion {

  id_personal?: number | null;
  id_area?: number | null;
  id_depto?: number | null;
  nom_operador?: string;
  id_categoria: number;
  nom_area?: string;
  nom_departamento?: string;
  nom_categoria?: string;
  estado?: string;

  constructor() {
      this.id_personal = 0;
      this.id_area = 0;
      this.id_depto = 0;
      this.nom_operador = '';
      this.id_categoria = 0;
      this.nom_area = '';
      this.nom_departamento = '';
      this.nom_categoria = '';
      this.estado = '';
  }
}
*/
export class Liquidacion {
  no_liquidacion: number;
  periodo_bitacora: string;
  operador: string;
  monto: number;
  iva: number;
  total: number;
  liquidado_por: string;
  fecha_liquidacion: string;
  fecha_aceptacion: string;
  detalle_liquidacion: DetalleLiquidacion[];

  constructor() {
    this.no_liquidacion = 0;
    this.periodo_bitacora = '';
    this.operador = '';
    this.monto = 0;
    this.iva = 0;
    this.total = 0;
    this.liquidado_por = '';
    this.fecha_liquidacion = '';
    this.fecha_aceptacion = '';
    this.detalle_liquidacion = [];
  }
}

export class DetalleLiquidacion {
  no_liquidacion: number;
  id_concepto: number;
  monto_concepto: number;
  iva_concepto: number;
  cantidad: number;
  total_concepto: number;
  desc_concepto: string;

  constructor() {
    this.no_liquidacion = 0;
    this.id_concepto = 0;
    this.monto_concepto = 0;
    this.iva_concepto = 0;
    this.cantidad = 0;
    this.total_concepto = 0;
    this.desc_concepto = '';
  }
}

//Clase para el listado de operadores al liquidar
export class Operadores {

  id_personal?: number | null;
  id_area?: number | null;
  id_depto?: number | null;
  nom_operador?: string;
  id_categoria: number;
  nom_area?: string;
  nom_departamento?: string;
  nom_categoria?: string;
  estado?: string;

  constructor() {
      this.id_personal = 0;
      this.id_area = 0;
      this.id_depto = 0;
      this.nom_operador = '';
      this.id_categoria = 0;
      this.nom_area = '';
      this.nom_departamento = '';
      this.nom_categoria = '';
      this.estado = '';
  }
}
