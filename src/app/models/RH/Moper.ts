export class ArchivoMoper {
  _01: number;
  REGISTRO: number;
  SOCIO: number;
  CAMPO4: number;
  EMPRESA: number;
  PLANTA: number;
  C_DEPTO: string;
  NOMBRE: string;
  PATERNO: string;
  MATERNO: string;
  F_NACIM: string;
  SEXO: string;
  E_CIVIL: string;
  I_GRUPO: string;
  I_EMPRESA: string;
  F_PAGO: string;
  T_TRAB: string;
  R_PAGO: string;
  BANCO: string;
  CUENTA_B?: string;
  CTA_CLABE?: string;
  S_MENSUAL: string;
  S_NETO: string;
  AGUINALDO: string;
  PRIMA_V: string;
  PTU: string;
  FONDO_AH: string;
  PRESTA_FA: string;
  IMSS: string;
  RFC: string;
  CURP: string;
  EMAIL?: string;
  C_SUC?: string;
  N_SUC?: string;
  N_DEPTO?: string;
  JEFE_I?: string;
  D_CALLE?: string;
  D_NUME?: string;
  D_NUMI?: string;
  D_COL?: string;
  D_MUN?: string;
  D_EDO?: string;
  D_PAIS?: string;
  D_CP: number;
  PARCIALIDAD: string;
  ANIVERSARIO: string;
  P_PANIV: string;

  constructor(
    _01: number,
    REGISTRO: number,
    SOCIO: number,
    CAMPO4: number,
    EMPRESA: number,
    PLANTA: number,
    C_DEPTO: string,
    NOMBRE: string,
    PATERNO: string,
    MATERNO: string,
    F_NACIM: string,
    SEXO: string,
    E_CIVIL: string,
    I_GRUPO: string,
    I_EMPRESA: string,
    F_PAGO: string,
    T_TRAB: string,
    R_PAGO: string,
    BANCO: string,
    CUENTA_B?: string,
    CTA_CLABE?: string,
    S_MENSUAL?: string,
    S_NETO?: string,
    AGUINALDO?: string,
    PRIMA_V?: string,
    PTU?: string,
    FONDO_AH?: string,
    PRESTA_FA?: string,
    IMSS?: string,
    RFC?: string,
    CURP?: string,
    EMAIL?: string,
    C_SUC?: string,
    N_SUC?: string,
    N_DEPTO?: string,
    JEFE_I?: string,
    D_CALLE?: string,
    D_NUME?: string,
    D_NUMI?: string,
    D_COL?: string,
    D_MUN?: string,
    D_EDO?: string,
    D_PAIS?: string,
    D_CP?: number,
    PARCIALIDAD?: string,
    ANIVERSARIO?: string,
    P_PANIV?: string
  ) {
    this._01 = _01;
    this.REGISTRO = REGISTRO;
    this.SOCIO = SOCIO;
    this.CAMPO4 = CAMPO4;
    this.EMPRESA = EMPRESA;
    this.PLANTA = PLANTA;
    this.C_DEPTO = C_DEPTO;
    this.NOMBRE = NOMBRE;
    this.PATERNO = PATERNO;
    this.MATERNO = MATERNO;
    this.F_NACIM = F_NACIM;
    this.SEXO = SEXO;
    this.E_CIVIL = E_CIVIL;
    this.I_GRUPO = I_GRUPO;
    this.I_EMPRESA = I_EMPRESA;
    this.F_PAGO = F_PAGO;
    this.T_TRAB = T_TRAB;
    this.R_PAGO = R_PAGO;
    this.BANCO = BANCO;
    this.CUENTA_B = CUENTA_B;
    this.CTA_CLABE = CTA_CLABE;
    this.S_MENSUAL = S_MENSUAL || '0';
    this.S_NETO = S_NETO || '0';
    this.AGUINALDO = AGUINALDO || '0';
    this.PRIMA_V = PRIMA_V || '0';
    this.PTU = PTU || '0';
    this.FONDO_AH = FONDO_AH || '0';
    this.PRESTA_FA = PRESTA_FA || '0';
    this.IMSS = IMSS || '0';
    this.RFC = RFC || '';
    this.CURP = CURP || '';
    this.EMAIL = EMAIL;
    this.C_SUC = C_SUC;
    this.N_SUC = N_SUC;
    this.N_DEPTO = N_DEPTO;
    this.JEFE_I = JEFE_I;
    this.D_CALLE = D_CALLE;
    this.D_NUME = D_NUME;
    this.D_NUMI = D_NUMI;
    this.D_COL = D_COL;
    this.D_MUN = D_MUN;
    this.D_EDO = D_EDO;
    this.D_PAIS = D_PAIS;
    this.D_CP = D_CP || 0;
    this.PARCIALIDAD = PARCIALIDAD || '0';
    this.ANIVERSARIO = ANIVERSARIO || '';
    this.P_PANIV = P_PANIV || '0';
  }
}
