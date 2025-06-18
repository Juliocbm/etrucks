export class VwEdiClienteParadasGeocercaDto {
    idEdiClienteParadasGeocerca: number | null;
    idEdiClienteParadas: number;
    clienteParada: string;
    activo: boolean;
    creadoPor: string | null;             // Guid en C#
    nombreCreadoPor: string | null;
    modificadoPor: string | null;         // Guid en C#
    nombreModificadoPor: string | null;
    cantidadGeocercas: number;
    geocercasConcatenadas: string;         // Lista concatenada de nombres de geocercas
    geocercas: Geocercas[];                // Lista de geocercas
  
    constructor(
      idEdiClienteParadasGeocerca: number | null = null,
      idEdiClienteParadas: number = 0,
      clienteParada: string = '',
      activo: boolean = false,
      creadoPor: string | null = null,
      nombreCreadoPor: string | null = '',
      modificadoPor: string | null = null,
      nombreModificadoPor: string | null = '',
      cantidadGeocercas: number = 0,
      geocercasConcatenadas: string = '',
      geocercas: Geocercas[] = []
    ) {
      this.idEdiClienteParadasGeocerca = idEdiClienteParadasGeocerca;
      this.idEdiClienteParadas = idEdiClienteParadas;
      this.clienteParada = clienteParada;
      this.activo = activo;
      this.creadoPor = creadoPor;
      this.nombreCreadoPor = nombreCreadoPor;
      this.modificadoPor = modificadoPor;
      this.nombreModificadoPor = nombreModificadoPor;
      this.cantidadGeocercas = cantidadGeocercas;
      this.geocercasConcatenadas = geocercasConcatenadas;
      this.geocercas = geocercas;
    }
  }
  
  export class Geocercas {
    idGeocerca: number | null;
    geocerca: string | '';
    points: string | '';
  
    constructor(
      idGeocerca: number | null = null,
      geocerca: string | '' = '',
      points: string | '' = ''
    ) {
      this.idGeocerca = idGeocerca;
      this.geocerca = geocerca;
      this.points = points;
    }
  }
  