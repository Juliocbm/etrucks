export class ReporteSeguimientoViaje {
    vrId: string;
    fechaViaje: Date;
    estatusViaje: string;
    carrier: string;
    observaciones: string;
    fechaInicioViaje: Date;
    fechaFinViaje: Date;
    tiempoTotalViaje: string;
    fechaInicioReporte: Date;
    fechaFinReporte: Date;
    tiempoTotalReporte: string;
    idUnidad: string;
    mctnumber: string;
    placas: string;
    totalPingEnviados:number;
    totalPingValidos:number;
    noViaje:number;
    constructor() {
        this.vrId = '';
        this.fechaViaje= new Date();
        this.estatusViaje= '';
        this.carrier = '';
        this.observaciones = '';
        this.fechaInicioViaje = new Date();
        this.fechaFinViaje = new Date();
        this.tiempoTotalViaje = '';
        this.fechaInicioReporte = new Date();
        this.fechaFinReporte = new Date();
        this.tiempoTotalReporte = '';
        this.idUnidad = '';
        this.mctnumber = '';
        this.placas = '';
        this.totalPingEnviados = 0;
        this.totalPingValidos = 0;
        this.noViaje = 0;
    }
  }
  

  export class ReporteViajeDetalle {
    vrId: string;
    assetId: string;
    assetType: string;
    carrierId: string;
    inMotion: string;
    version: string;
    timestamp: string;
    latitude: string;
    longitude: string;
    provider: string;
    
  
    constructor() {
        this.vrId = '';
        this.assetId= '';
        this.assetType= '';
        this.carrierId = '';
        this.inMotion = '';
        this.version = '';
        this.timestamp = '';
        this.latitude = '';
        this.longitude = '';
        this.provider = '';
    }
  }
  