export class ConexionDetalle {
    idConexionDetalle: number;
    idConexion: number;
    idCompania: number;
    idCliente: string | null;
    descripcion: string;
    scac: string;
    rutaLocalDescarga: string;
    segmento: string;
    elemento: string;
    confirmaShipAut: boolean;
    frecuenciaX6: number;
    requiere997: boolean;
    marcaCruceAut: boolean;
    horaBusqLimInf: number;
    horaBusqLimSup: number;
    extension: string;
    codigoIntercambioCliente: string | null;
    codigoCliente: string;
    codigoIntercambioCompania: string | null;
    codigoCompania: string;
    activo: boolean;
    fechaCreacion: Date;
  
    constructor(
        idConexionDetalle: number = 0,
        idConexion: number = 0,
        idCompania: number = 0,
        idCliente: string | null = null,
        descripcion: string = '',
        scac: string = '',
        rutaLocalDescarga: string = '',
        segmento: string = '',
        elemento: string = '',
        confirmaShipAut: boolean = false,
        frecuenciaX6: number = 0,
        requiere997: boolean = false,
        marcaCruceAut: boolean = false,
        horaBusqLimInf: number = 0,
        horaBusqLimSup: number = 0,
        extension: string = '',
        codigoIntercambioCliente: string | null = null,
        codigoCliente: string = '',
        codigoIntercambioCompania: string | null = null,
        codigoCompania: string = '',
        activo: boolean = false,
        fechaCreacion: Date = new Date()
    ) {
      this.idConexionDetalle = idConexionDetalle;
      this.idConexion = idConexion;
      this.idCompania = idCompania;
      this.idCliente = idCliente;  // Guid? en C#
      this.descripcion = descripcion;
      this.scac = scac;
      this.rutaLocalDescarga = rutaLocalDescarga;
      this.segmento = segmento;
      this.elemento = elemento;
      this.confirmaShipAut = confirmaShipAut;
      this.frecuenciaX6 = frecuenciaX6;
      this.requiere997 = requiere997;
      this.marcaCruceAut = marcaCruceAut;
      this.horaBusqLimInf = horaBusqLimInf;
      this.horaBusqLimSup = horaBusqLimSup;
      this.extension = extension;
      this.codigoIntercambioCliente = codigoIntercambioCliente;
      this.codigoCliente = codigoCliente;
      this.codigoIntercambioCompania = codigoIntercambioCompania;
      this.codigoCompania = codigoCompania;
      this.activo = activo;
      this.fechaCreacion = fechaCreacion;
    }
  }
  