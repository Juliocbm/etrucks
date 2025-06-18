export class EdiClienteParadasGeocerca {
    idEdiClienteParadasGeocerca: number;
    idEdiClienteParadas: number;
    idGeocerca: number;
    geocerca: string;
    activo: boolean;
    creadoPor: string;             // Guid en C#
    fechaCreacion: Date;
    modificadoPor: string;         // Guid en C#
    fechaModificacion: Date;
    // Campo con [JsonIgnore]
    // idEdiClienteParadasNavigation: any;
  
    constructor(
      idEdiClienteParadasGeocerca: number = 0,
      idEdiClienteParadas: number = 0,
      idGeocerca: number = 0,
      geocerca: string = '',
      activo: boolean = false,
      creadoPor: string = '00000000-0000-0000-0000-000000000000',
      fechaCreacion: Date = new Date('0001-01-01T00:00:00'),
      modificadoPor: string = '00000000-0000-0000-0000-000000000000',
      fechaModificacion: Date = new Date('0001-01-01T00:00:00'),
    //   idEdiClienteParadasNavigation: any = null,
    ) {
      this.idEdiClienteParadasGeocerca = idEdiClienteParadasGeocerca;
      this.idEdiClienteParadas = idEdiClienteParadas;
      this.idGeocerca = idGeocerca;
      this.geocerca = geocerca;
      this.activo = activo;
      this.creadoPor = creadoPor;
      this.fechaCreacion = fechaCreacion;
      this.modificadoPor = modificadoPor;
      this.fechaModificacion = fechaModificacion;
    //   this.idEdiClienteParadasNavigation = idEdiClienteParadasNavigation;
    }
  }
  