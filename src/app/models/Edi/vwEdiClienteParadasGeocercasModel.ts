export class VwEdiClienteParadasGeocerca {
    idEdiClienteParadasGeocerca: number;
    idEdiClienteParadas: number;
    clienteParada: string | null;
    idGeocerca: number;
    geocerca: string | null;
    points: string | null;
    activo: boolean;
    creadoPor: string;             // Guid en C#
    nombreCreadoPor: string;
    modificadoPor: string;         // Guid en C#
    nombreModificadoPor: string;
  
    constructor(
      idEdiClienteParadasGeocerca: number = 0,
      idEdiClienteParadas: number = 0,
      clienteParada: string | null = null,
      idGeocerca: number = 0,
      geocerca: string | null = null,
      points: string | null = null,
      activo: boolean = false,
      creadoPor: string = '00000000-0000-0000-0000-000000000000',
      nombreCreadoPor: string = '',
      modificadoPor: string = '00000000-0000-0000-0000-000000000000',
      nombreModificadoPor: string = '',
    ) {
      this.idEdiClienteParadasGeocerca = idEdiClienteParadasGeocerca;
      this.idEdiClienteParadas = idEdiClienteParadas;
      this.clienteParada = clienteParada;
      this.idGeocerca = idGeocerca;
      this.geocerca = geocerca;
      this.points = points;
      this.activo = activo;
      this.creadoPor = creadoPor;
      this.nombreCreadoPor = nombreCreadoPor;
      this.modificadoPor = modificadoPor;
      this.nombreModificadoPor = nombreModificadoPor;
    }
  }
  