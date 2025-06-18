
export interface DescargaRegistro {
    id: string;
    nombreCliente: string;
    nombreArchivo: string;
    fechaInicio: Date;
    fechaFin: Date;
    progreso: number;
    urlDescarga?: string; // URL opcional para descargar el archivo, se llenará cuando la descarga esté completa
  }