export class Bloqueos {
  // Identificador principal del bloqueador raíz
  rootBlockerSPID: number;
  // Estado de la sesión (ej: 'sleeping', 'RUNNABLE')
  status: string;
  // Usuario asociado a la sesión
  login: string;
  // Nombre del host donde se originó la conexión
  hostName: string;
  // Base de datos afectada
  dbName: string;
  // Último comando ejecutado (ej: 'AWAITING COMMAND', 'UPDATE')
  command: string;
  // Tiempo de CPU en milisegundos
  cpuTime: number;
  // E/S de disco
  diskIO: number;
  // Fecha/hora del último batch procesado
  lastBatch: string;
  // Nombre de la aplicación que originó la conexión
  applicationName: string;
  // Duración del bloqueo en formato "HH:mm:ss"
  duracionBloqueo: string;
  // Acción recomendada (ej: 'KILL - Exceso de tiempo')
  accionRecomendada: string;
  // Número de sesiones bloqueadas
  cantidadBloqueos: number;
  // IDs de sesiones bloqueadas (ej: '71, 106')
  spIdsBloqueados: string;

  constructor() {
    this.rootBlockerSPID = 0;
    this.status = '';
    this.login = '';
    this.hostName = '';
    this.dbName = '';
    this.command = '';
    this.cpuTime = 0;
    this.diskIO = 0;
    this.lastBatch = '';
    this.applicationName = '';
    this.duracionBloqueo = '';
    this.accionRecomendada = '';
    this.cantidadBloqueos = 0;
    this.spIdsBloqueados = '';
  }
}