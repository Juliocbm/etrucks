export class ArchivoCFDi {
    idArchivoCFDi?: number;
    noGuia?: number;
    numGuia?: string;
    compania?: string;
    xml: Blob | null;
    pdf: Blob | null;
    fechaCreacion: Date | null;
  
  
    constructor(
      idArchivoCFDi: number | 0,
      noGuia: number | 0,
      numGuia: string | '',
      compania: string | '',
      xml: Blob | null,
      pdf: Blob | null,
      fechaCreacion: Date | null
    ) {
      this.idArchivoCFDi = idArchivoCFDi;
      this.noGuia = noGuia;
      this.numGuia = numGuia;
      this.compania = compania;
      this.xml = xml;
      this.pdf = pdf;
      this.fechaCreacion = fechaCreacion;
    }
  }
  