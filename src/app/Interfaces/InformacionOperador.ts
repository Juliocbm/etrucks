export interface InformacionOperador {
    succes: boolean;
    mensaje: string;
    adeudos: Adeudo[];
   /*  viajes: Viaje[];
    conceptos: Concepto[]; */
    data: Data;
  }

  export interface Data {
    viajes: Viaje[];
    conceptos: Concepto[]; 
  }

  export interface Concepto {
    id_concepto: number;
    monto: number;
    desc_concepto: string;
    total_concepto: number;
    cantidad:number;
  }
  
 export interface Adeudo {
    id_doc: number;
    id_area: number;
    no_doc: string;
    id_personal: number;
    monto: number;
    id_concepto: number;
    desc_adeudo: string;
    tipo_doc: number;
    tipo_adeudo: number;
    cantidad_liq: number;
    fecha_doc: string; // o Date si vas a convertirlo a objeto Date
    porcentaje_desc: number;
  }
  
 export interface Viaje {
    id_area: number;
    no_viaje: number;
    fecha_real_viaje: string; // o Date si vas a convertirlo a objeto Date
    desc_ruta: string;
    id_unidad: string;
    observacionesviaje: string;
    pagar_Viaje: number;
    c_anticipo: number;
    c_vale: number;
    porcentaje_reseteo: number;
    id_asignacion: number;
    anticipos: Anticipo[]; // Define el tipo de objeto si tienes la estructura
    tramos: Tramo[];
  }

  export interface Anticipo {
    id_area: number;
    no_anticipo: number;
    no_viaje: number;
    fecha_anticipo: string; // O puedes usar Date si vas a convertir la cadena a un objeto Date
    monto_anticipo: number;
    status_anticipo: string;
    monto_anticipo_iva: number;
    observaciones: string;
    tipo_anticipo: number;
  }
  
  
  export interface Tramo {
    no_guia: number;
    id_tramo: number;
    no_viaje: number;
    consecutivo_viaje: number;
    direccion_tramo: number;
    desc_ruta: string;
    kms_tramo: number;
    incentivo_tramo: number;
    id_tipo_operacion: number;
  }
  