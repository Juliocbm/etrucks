export class EdiClienteParada {
    idEdiClienteParadas: number;
    idConexionDetalle: number;
    codigoParada: string;
    clienteParada: string | null;
    calle: string | null;
    ciudad: string | null;
    cp: string | null;
    claveEstado: string | null;
    clavePais: string | null;
    activo: boolean;
    creadoPor: string;       // Guid como string
    fechaCreacion: Date;
    modificadoPor: string;   // Guid como string
    fechaModificacion: Date;
  
    constructor(
      idEdiClienteParadas: number,
      idConexionDetalle: number,
      codigoParada: string,
      creadoPor: string,
      modificadoPor: string,
      clienteParada: string | null = null,
      calle: string | null = null,
      ciudad: string | null = null,
      cp: string | null = null,
      claveEstado: string | null = null,
      clavePais: string | null = null,
      activo: boolean = false,
      fechaCreacion: Date = new Date(),
      fechaModificacion: Date = new Date()
    ) {
      this.idEdiClienteParadas = idEdiClienteParadas;
      this.idConexionDetalle = idConexionDetalle;
      this.codigoParada = codigoParada;
      this.clienteParada = clienteParada;
      this.calle = calle;
      this.ciudad = ciudad;
      this.cp = cp;
      this.claveEstado = claveEstado;
      this.clavePais = clavePais;
      this.activo = activo;
      this.creadoPor = creadoPor;
      this.fechaCreacion = fechaCreacion;
      this.modificadoPor = modificadoPor;
      this.fechaModificacion = fechaModificacion;
    }
  }