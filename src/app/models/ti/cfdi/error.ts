export class ErrorTimbrado {
    id: number;
    noGuia: number | null;
    numGuia: string;
    compania: string;
    error: string;
    idOperadorLis: number | null;
    idUnidadLis: string;
    idRemolqueLis: string;
    fechaInsert: Date;
  
    constructor(
      id: number,
      noGuia: number,
      numGuia: string,
      compania: string,
      error: string,
      idOperadorLis: number,
      idUnidadLis: string,
      idRemolqueLis: string,
      fechaInsert: Date
    ) {
      this.id = id || 0;
      this.noGuia = noGuia || null;
      this.numGuia = numGuia || '';
      this.compania = compania || '';
      this.error = error;
      this.idOperadorLis = idOperadorLis || null;
      this.idUnidadLis = idUnidadLis || '';
      this.idRemolqueLis = idRemolqueLis || '';
      this.fechaInsert = fechaInsert;
    }
  }
  